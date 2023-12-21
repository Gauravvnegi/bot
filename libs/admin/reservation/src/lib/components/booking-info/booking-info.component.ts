import {
  Component,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  ConfigService,
  EntitySubType,
  Option,
} from '@hospitality-bot/admin/shared';
import {
  BookingConfig,
  ReservationCurrentStatus,
} from '../../../../../manage-reservation/src/lib/models/reservations.model';
import * as moment from 'moment';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../../../manage-reservation/src/lib/services/form.service';
import { ReservationForm } from '../../../../../manage-reservation/src/lib/constants/form';
import { Subscription } from 'rxjs';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { SideBarService } from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';

@Component({
  selector: 'hospitality-bot-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: [
    './booking-info.component.scss',
    '../../../../../manage-reservation/src/lib/components/reservation.styles.scss',
  ],
})
export class BookingInfoComponent implements OnInit {
  expandAccordion: boolean = false;
  reservationTypes: Option[] = [];
  statusOptions: Option[] = [];
  eventTypes: Option[] = [];
  bookingType: string;
  reservationId: string;
  isQuickReservation: boolean = false;
  disabledForm: boolean = false;
  defaultDate: number;
  isCheckedIn: boolean = false;
  isCheckedOut: boolean = false;
  /**
   * Props to show extra information
   * @todo Need to handle label for col and row to show information
   */
  @Input() set props(value: BookingInfoProps) {
    for (const key in value) {
      const val = value[key];
      this[key] = val;
    }
  }

  parentFormGroup: FormGroup;

  otaOptions: Option[] = [];

  configData: BookingConfig;
  editMode: boolean = false;
  // agentSource = false;

  today = new Date();
  entityId: string;
  startMinDate = new Date();
  endMinDate = new Date();
  maxDate = new Date();
  minToDate = new Date();

  fromDateValue = new Date();
  toDateValue = new Date();
  selectedAgent: AgentTableResponse;
  selectedCompany: CompanyResponseType;

  sourceValue: string;
  marketSegmentValue: string;

  $subscription = new Subscription();

  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private formService: FormService,
    private sidebarService: SideBarService
  ) {}

  ngOnInit(): void {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.entityId = this.globalFilterService.entityId;
    this.listenForConfigDataChanges();
    this.getCountryCode();
    this.initDates();
    this.listenForSourceData();
  }

  initDates() {
    // Reset dates for continue reservation flow after form submission.
    this.startMinDate = new Date();
    this.endMinDate = new Date();
    this.maxDate = new Date();
    this.minToDate = new Date();
    this.initDefaultDates();
    this.listenForDateChange();
    this.formService.currentJourneyStatus.subscribe((res) => {
      if (res) {
        this.isCheckedIn =
          res &&
          (res === ReservationCurrentStatus.INHOUSE ||
            res === ReservationCurrentStatus.DUEOUT);
        this.isCheckedOut = res === ReservationCurrentStatus.CHECKEDOUT;
      }
    });
  }

  /**
   * Set default to and from dates.
   */
  initDefaultDates() {
    if (!this.reservationId) {
      this.startMinDate = this.defaultDate
        ? new Date(this.defaultDate)
        : new Date();
      this.endMinDate = new Date(this.startMinDate);
      this.endMinDate.setDate(this.endMinDate.getDate() + 1);
      this.minToDate = new Date(this.endMinDate);
      this.minToDate.setDate(this.minToDate.getDate());
    } else {
      this.startMinDate = new Date(new Date());
      this.minToDate.setDate(this.startMinDate.getDate() + 1);
      this.endMinDate = new Date(this.minToDate);
    }

    this.fromDateValue = this.startMinDate;
    this.toDateValue = this.endMinDate;

    if (this.bookingType === EntitySubType.ROOM_TYPE)
      this.maxDate.setDate(this.startMinDate.getDate() + 365);

    // Venue only valid till 24 hours later.
    if (this.bookingType === EntitySubType.VENUE)
      this.maxDate = moment().add(24, 'hours').toDate();
  }

  /**
   * Listen for date changes in ROOM_TYPE and outlets.
   */
  listenForDateChange() {
    const startTime = moment(this.startMinDate).unix() * 1000;
    const endTime = moment(this.endMinDate).unix() * 1000;

    const toDateControl = this.reservationInfoControls?.to;
    const fromDateControl = this.reservationInfoControls?.from;
    const dateAndTimeControl = this.reservationInfoControls?.dateAndTime;

    // Listen to from and to date changes in ROOM_TYPE and set
    // min and max dates accordingly
    if (this.bookingType === EntitySubType.ROOM_TYPE) {
      if (!this.reservationId) {
        fromDateControl.setValue(startTime);
        toDateControl.setValue(endTime);
      }

      let multipleDateChange = false;

      fromDateControl.valueChanges.subscribe((res) => {
        if (res) {
          const maxToLimit = new Date(res);
          this.fromDateValue = new Date(maxToLimit);
          // Check if fromDate is greater than or equal to toDate before setting toDateControl
          maxToLimit.setDate(maxToLimit.getDate() + 1);
          if (maxToLimit >= this.toDateValue) {
            // Calculate the date for one day later
            const nextDayTime = moment(maxToLimit).unix() * 1000;
            multipleDateChange = true;
            toDateControl.setValue(nextDayTime); // Set toDateControl to one day later
          }
          (this.formService.isDataInitialized.value || !this.reservationId) &&
            this.formService.reinitializeRooms.next(true);
          this.updateDateDifference();
          this.minToDate = new Date(maxToLimit); // Create a new date object
          this.minToDate.setDate(maxToLimit.getDate());
          this.formService.reservationDate.next(res);
        }
      });

      toDateControl.valueChanges.subscribe((res) => {
        if (res) {
          this.toDateValue = new Date(res);
          this.updateDateDifference();
          (this.formService.isDataInitialized.value || !this.reservationId) &&
            !multipleDateChange &&
            this.formService.reinitializeRooms.next(true);
          multipleDateChange = false;
        }
      });
    }

    // Listen to from and to date changes in Venue
    else if (this.bookingType === EntitySubType.VENUE) {
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);
      this.endMinDate.setDate(this.startMinDate.getDate());
      fromDateControl.valueChanges.subscribe((res) => {
        const maxLimit = new Date(res);
        toDateControl.setValue(moment(maxLimit).unix() * 1000);
        this.maxDate = moment(maxLimit).add(24, 'hours').toDate();
        this.formService.reservationDate.next(res);
      });
    }

    // Listen for date and time change in restaurant and spa
    else {
      dateAndTimeControl.setValue(startTime);
      this.formService.reservationDateAndTime.next(startTime);

      dateAndTimeControl.valueChanges.subscribe((res) => {
        this.formService.reservationDateAndTime.next(res);
      });
    }
  }

  listenForConfigDataChanges() {
    // Add options Market Segment and Source for external reservations
    this.marketSegmentControl.valueChanges.subscribe((res) => {
      if (res) {
        this.marketSegmentValue = res;
        this.mapMarketSegments();
      }
    });

    this.sourceControl.valueChanges.subscribe((res) => {
      if (res) {
        this.sourceValue = res;
        this.mapSourceOptions();
        this.initSourceDetails(res);
        (!this.editMode || !this.reservationId) &&
          this.sourceNameControl.reset();
      }
    });
    this.otaSourceControl.valueChanges.subscribe((res) => {
      res && this.formService.getSummary.next(true);
    });
  }

  // Map source data for edit reservation
  listenForSourceData() {
    this.editMode = true;
    this.$subscription.add(
      this.formService.sourceData.subscribe((res) => {
        if (res) {
          this.selectedAgent = res.agent && {
            label: res?.agent?.firstName,
            value: res?.agent?.id,
            ...res?.agent,
          };
          this.selectedCompany = res.company && {
            label: res?.company?.firstName,
            value: res?.company?.id,
            ...res?.company,
          };

          this.inputControls.reservationInformation.patchValue({
            marketSegment: res.marketSegment,
            source: res.source,
          });

          // Map source name data according to the source
          const sourceControlMap = {
            OTA: this.otaSourceControl,
            AGENT: this.agentSourceControl,
            COMPANY: this.companySourceControl,
            default: this.sourceNameControl,
          };

          const selectedControl =
            sourceControlMap[res.source] || sourceControlMap['default'];
          selectedControl.patchValue(res.sourceName, { emitEvent: false });
          this.editMode = false;
        }
      })
    );
  }

  // Update sourceName controls values and validity
  initSourceDetails(source: string) {
    switch (source) {
      case 'OTA':
        this.setupControl(this.otaSourceControl, [Validators.required]);
        this.mapOtaOptions(source);
        this.updateValueAndValidity(this.agentSourceControl);
        this.updateValueAndValidity(this.sourceNameControl);
        this.updateValueAndValidity(this.companySourceControl);
        break;
      case 'AGENT':
        this.setupControl(this.agentSourceControl, [Validators.required]);
        this.updateValueAndValidity(this.sourceNameControl);
        this.updateValueAndValidity(this.companySourceControl);
        this.updateValueAndValidity(this.otaSourceControl);
        break;
      case 'COMPANY':
        this.setupControl(this.companySourceControl, [Validators.required]);
        this.updateValueAndValidity(this.otaSourceControl);
        this.updateValueAndValidity(this.agentSourceControl);
        this.updateValueAndValidity(this.sourceNameControl);
        break;
      default:
        this.setupControl(this.sourceNameControl, [
          Validators.required,
          Validators.maxLength(60),
        ]);
        this.updateValueAndValidity(this.otaSourceControl);
        this.updateValueAndValidity(this.agentSourceControl);
        this.updateValueAndValidity(this.companySourceControl);
        break;
    }
  }

  mapOtaOptions(source: string) {
    this.otaOptions = this.configData
      ? this.configData.source.filter((item) => item.value === source)[0].type
      : [];
    !this.otaOptions.some(
      (item) => item.value === this.otaSourceControl?.value
    ) &&
      this.otaSourceControl?.value?.length &&
      this.otaOptions.push({
        label: this.otaSourceControl.value,
        value: this.otaSourceControl.value,
      });
  }

  updateValueAndValidity(control: AbstractControl) {
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity({ emitEvent: false });
  }

  setupControl(control: AbstractControl, validator: ValidatorFn[]) {
    control.setValidators(validator);
    control.markAsUntouched();
  }

  patchValue(control: AbstractControl, value: any) {
    control.patchValue(value, { emitEvent: false });
  }

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
        this.mapMarketSegments();
        this.mapSourceOptions();
        this.reservationInfoControls.source.value === 'OTA' &&
          this.mapOtaOptions(this.reservationInfoControls.source.value);
      });
  }

  mapMarketSegments() {
    if (this.marketSegmentValue && this.configData?.marketSegment.length) {
      !this.configData?.marketSegment.some(
        (item) => item.value === this.marketSegmentValue
      ) &&
        this.configData.marketSegment.push({
          label: this.marketSegmentValue,
          value: this.marketSegmentValue,
        });
      this.patchValue(this.marketSegmentControl, this.marketSegmentValue);
    }
  }

  mapSourceOptions() {
    if (this.sourceValue && this.configData?.source.length) {
      !this.configData.source.some((item) => item.value === this.sourceValue) &&
        this.configData.source.push({
          label: this.sourceValue,
          value: this.sourceValue,
        });
      this.patchValue(this.sourceControl, this.sourceValue);
    }
  }

  updateDateDifference() {
    // Get the toDate and fromDate values from the form service

    if (this.fromDateValue && this.toDateValue) {
      // Calculate the date difference in days
      const dateDiffInMilliseconds =
        this.toDateValue.getTime() - this.fromDateValue.getTime();
      const dateDiffInDays = Math.ceil(
        dateDiffInMilliseconds / (1000 * 60 * 60 * 24)
      );
      // Update the dateDifference BehaviorSubject with the new value
      this.formService.dateDifference.next(dateDiffInDays);
    }
  }

  agentChange(event) {
    if (event && event.id) {
      this.selectedAgent = {
        label: event?.firstName,
        value: event?.id,
        ...event,
      };
      !this.reservationId &&
        event?.marketSegment &&
        this.patchValue(this.marketSegmentControl, event.marketSegment);
      this.formService.getSummary.next(true);
    }
  }

  companyChange(event) {
    if (event.id) {
      this.selectedCompany = {
        label: event?.firstName,
        value: event?.id,
        marketSegment: event?.marketSegment,
        ...event,
      };
      !this.reservationId &&
        event?.marketSegment &&
        this.patchValue(this.marketSegmentControl, event?.marketSegment);
      this.formService.getSummary.next(true);
    }
  }

  showAgent() {
    this.sidebarService.openSidebar({
      componentName: 'AddAgent',
      containerRef: this.sidebarSlide,
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => {
        this.sidebarVisible = false;
        if (typeof res !== 'boolean') {
          this.selectedAgent = {
            label: `${res?.firstName}`,
            value: res?.id,
            ...res,
          };
          res.marketSegment &&
            this.patchValue(this.marketSegmentControl, res.marketSegment);
          this.formService.getSummary.next(true);
        }
      },
    });
  }

  showCompany() {
    this.sidebarService.openSidebar({
      componentName: 'AddCompany',
      containerRef: this.sidebarSlide,
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => {
        this.sidebarVisible = false;
        if (typeof res !== 'boolean') {
          this.selectedCompany = {
            label: `${res?.companyName}`,
            value: res?.id,
            ...res,
          };
          res.marketSegment &&
            this.patchValue(this.marketSegmentControl, res.marketSegment);
          this.formService.getSummary.next(true);
        }
      },
    });
  }

  get reservationInfoControls() {
    return (this.controlContainer.control.get(
      'reservationInformation'
    ) as FormGroup).controls as Record<
      keyof ReservationForm['reservationInformation'],
      AbstractControl
    >;
  }

  get inputControls() {
    return this.parentFormGroup.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  get sourceNameControl() {
    return this.reservationInfoControls.sourceName;
  }

  get marketSegmentControl() {
    return this.reservationInfoControls.marketSegment;
  }

  get sourceControl() {
    return this.reservationInfoControls.source;
  }

  get agentSourceControl() {
    return this.reservationInfoControls.agentSourceName;
  }

  get companySourceControl() {
    return this.reservationInfoControls.companySourceName;
  }

  get otaSourceControl() {
    return this.reservationInfoControls.otaSourceName;
  }

  get roomControls() {
    return this.controlContainer.control.get('roomInformation') as FormGroup;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}

type BookingInfoProps = {
  expandAccordion?: boolean;
  reservationTypes?: Option[];
  statusOptions?: Option[];
  eventTypes?: Option[];
  bookingType?: string;
  reservationId?: string;
  isQuickReservation?: boolean;
  disabledForm: boolean;
  defaultDate?: number;
};
