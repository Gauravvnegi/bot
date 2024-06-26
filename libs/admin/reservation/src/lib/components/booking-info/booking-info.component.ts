import {
  Compiler,
  Component,
  ComponentFactoryResolver,
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
  Option,
  manageMaskZIndex,
} from '@hospitality-bot/admin/shared';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AddAgentComponent } from 'libs/admin/agent/src/lib/components/add-agent/add-agent.component';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { AddCompanyComponent } from 'libs/admin/company/src/lib/components/add-company/add-company.component';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import {
  ReservationForm,
  SessionType,
} from '../../../../../manage-reservation/src/lib/constants/form';
import {
  BookingConfig,
  ReservationCurrentStatus,
} from '../../../../../manage-reservation/src/lib/models/reservations.model';
import { FormService } from '../../../../../manage-reservation/src/lib/services/form.service';

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
  reservationId: string;
  isQuickReservation: boolean = false;
  disabledForm: boolean = false;
  defaultDate: number;
  isCheckedIn: boolean = false;
  isCheckedOut: boolean = false;
  readonly SessionType = SessionType;
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
  @Input() bookingSlotList: Option[];

  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private formService: FormService,
    private resolver: ComponentFactoryResolver,
    private compiler: Compiler
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
      this.startMinDate =
        this.defaultDate && !this.isDayBooking
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

    this.maxDate.setDate(this.startMinDate.getDate() + 365);

    this.mapDayBookingDates();
  }

  /**
   * Handles the case when the selected time is before the current
   * time in day booking so that user can't create past bookings.
   */
  mapDayBookingDates() {
    if (this.isDayBooking && !this.reservationId) {
      if (this.defaultDate < Date.now() || !this.defaultDate) {
        this.inputControls.reservationInformation.patchValue(
          {
            from: Date.now(),
            to: Date.now() + 3600 * 1000,
          },
          { emitEvent: false }
        );
      } else {
        this.inputControls.reservationInformation.patchValue(
          {
            from: this.defaultDate,
            to: this.defaultDate + 3600 * 1000,
          },
          { emitEvent: false }
        );
      }
    }
  }

  /**
   * Listen for date changes in ROOM_TYPE.
   */
  listenForDateChange() {
    const startTime = moment(this.startMinDate).unix() * 1000;
    const endTime = moment(this.endMinDate).unix() * 1000;

    const toDateControl = this.reservationInfoControls?.to;
    const fromDateControl = this.reservationInfoControls?.from;

    // Listen to from and to date changes in ROOM_TYPE and set
    // min and max dates accordingly
    if (
      !this.reservationId &&
      (!this.isDayBooking || !this.isQuickReservation)
    ) {
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
        this.formService.reservationDate.next(res);
        this.reservationId &&
          !this.isCheckedIn &&
          this.formService.updateRateImprovement(
            this.inputControls.rateImprovement
          );
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
        this.reservationId &&
          !this.isCheckedIn &&
          this.formService.updateRateImprovement(
            this.inputControls.rateImprovement
          );
      }
    });
  }

  listenForConfigDataChanges() {
    // Add options Market Segment and Source for external reservations
    this.marketSegmentControl?.valueChanges.subscribe((res) => {
      if (res) {
        this.marketSegmentValue = res;
        this.mapMarketSegments();
      }
    });

    this.sourceControl?.valueChanges.subscribe((res) => {
      if (res) {
        this.sourceValue = res;
        this.mapSourceOptions();
        this.initSourceDetails(res);
        this.inputControls?.printRate?.patchValue(
          res !== 'OTA' && res !== 'AGENT' && res !== 'COMPANY',
          { emitEvent: false }
        );
        (!this.editMode || !this.reservationId) &&
          this.sourceNameControl.reset();
      }
    });
    this.otaSourceControl?.valueChanges.subscribe((res) => {
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
        const validators =
          source === 'WALK_IN'
            ? [Validators.maxLength(60)]
            : [Validators.required, Validators.maxLength(60)];
        this.setupControl(this.sourceNameControl, validators);
        this.sourceNameControl.updateValueAndValidity();
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
    } else if (this.configData?.marketSegment.length) {
      // Map the default market segment according to the config.
      this.configData.marketSegment.map((item, index) => {
        if (item.isDefault)
          this.patchValue(this.marketSegmentControl, item.value);
      });
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
    if (!this.reservationId && this.sourceControl.invalid) {
      this.configData.source.forEach((source) => {
        if (source.default) {
          this.patchValue(this.sourceControl, source.value);
          this.initSourceDetails(source.value);
        }
      });
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
    const lazyModulePromise = import(
      'libs/admin/agent/src/lib/admin-agent.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminAgentModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });
    lazyModulePromise.then((moduleFactory) => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(AddAgentComponent);
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSidebar = true;
      componentRef.instance.onCloseSidebar.subscribe((res) => {
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
      });
      manageMaskZIndex();
    });

    // this.sidebarService.openSidebar({
    //   componentName: 'AddAgent',
    //   containerRef: this.sidebarSlide,
    //   onOpen: () => (this.sidebarVisible = true),
    //   manageMask: true,
    //   onClose: (res) => {
    //     this.sidebarVisible = false;
    //     if (typeof res !== 'boolean') {
    //       this.selectedAgent = {
    //         label: `${res?.firstName}`,
    //         value: res?.id,
    //         ...res,
    //       };
    //       res.marketSegment &&
    //         this.patchValue(this.marketSegmentControl, res.marketSegment);
    //       this.formService.getSummary.next(true);
    //     }
    //   },
    // });
  }

  showCompany() {
    const lazyModulePromise = import(
      'libs/admin/company/src/lib/admin-company.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminCompanyModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });
    lazyModulePromise.then((moduleFactory) => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(
        AddCompanyComponent
      );
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSidebar = true;
      componentRef.instance.onCloseSidebar.subscribe((res) => {
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
        this.sidebarVisible = false;
        componentRef.destroy();
      });
      manageMaskZIndex();
    });

    // this.sidebarService.openSidebar({
    //   componentName: 'AddCompany',
    //   containerRef: this.sidebarSlide,
    //   onOpen: () => (this.sidebarVisible = true),
    //   onClose: (res) => {
    //     this.sidebarVisible = false;
    //     if (typeof res !== 'boolean') {
    //       this.selectedCompany = {
    //         label: `${res?.companyName}`,
    //         value: res?.id,
    //         ...res,
    //       };
    //       res.marketSegment &&
    //         this.patchValue(this.marketSegmentControl, res.marketSegment);
    //       this.formService.getSummary.next(true);
    //     }
    //   },
    // });
  }

  handelToggleSwitch(value: boolean) {
    this.reservationInfoControls?.sessionType?.patchValue(
      value ? SessionType.DAY_BOOKING : SessionType.NIGHT_BOOKING
    );
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

  get isDayBooking() {
    return (
      this.reservationInfoControls?.sessionType?.value ===
      SessionType.DAY_BOOKING
    );
  }

  get isDayBooingAvailable(): boolean {
    return this.configService.$isDayBookingAvailable.value;
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
  reservationId?: string;
  isQuickReservation?: boolean;
  disabledForm: boolean;
  defaultDate?: number;
};
