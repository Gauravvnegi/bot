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
  Validators,
} from '@angular/forms';
import {
  ConfigService,
  CountryCodeList,
  EntitySubType,
  Option,
} from '@hospitality-bot/admin/shared';
import { BookingConfig } from '../../../../../manage-reservation/src/lib/models/reservations.model';
import * as moment from 'moment';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../../../manage-reservation/src/lib/services/form.service';
import { ReservationForm } from '../../../../../manage-reservation/src/lib/constants/form';
import { Subscription } from 'rxjs';
import { AgentTableResponse } from 'libs/admin/agent/src/lib/types/response';
import { AddAgentComponent } from 'libs/admin/agent/src/lib/components/add-agent/add-agent.component';

@Component({
  selector: 'hospitality-bot-booking-info',
  templateUrl: './booking-info.component.html',
  styleUrls: [
    './booking-info.component.scss',
    '../../../../../manage-reservation/src/lib/components/reservation.styles.scss',
  ],
})
export class BookingInfoComponent implements OnInit {
  countries: Option[];
  expandAccordion: boolean = false;
  reservationTypes: Option[] = [];
  statusOptions: Option[] = [];
  eventTypes: Option[] = [];
  bookingType: string;
  reservationId: string;
  isQuickReservation: boolean = false;
  disabledForm: boolean = false;

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

  entityId: string;
  startMinDate = new Date();
  endMinDate = new Date();
  maxDate = new Date();
  minToDate = new Date();

  fromDateValue = new Date();
  toDateValue = new Date();
  selectedAgent: AgentTableResponse;

  $subscription = new Subscription();

  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;

  constructor(
    public controlContainer: ControlContainer,
    private configService: ConfigService,
    private globalFilterService: GlobalFilterService,
    private resolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.entityId = this.globalFilterService.entityId;
    this.getCountryCode();
    this.initDates();
    this.listenForSourceChanges();
  }

  initDates() {
    // Reset dates for continue reservation flow after form submission.
    this.startMinDate = new Date();
    this.endMinDate = new Date();
    this.maxDate = new Date();
    this.minToDate = new Date();
    this.initDefaultDates();
    this.listenForDateChange();
  }
  /**
   * Set default to and from dates.
   */
  initDefaultDates() {
    this.endMinDate.setDate(this.startMinDate.getDate() + 1);
    this.maxDate.setDate(this.endMinDate.getDate() - 1);

    this.fromDateValue = this.startMinDate;
    this.toDateValue = this.endMinDate;
    // Reservation dates should be within 1 year time.
    if (this.bookingType === EntitySubType.ROOM_TYPE)
      this.maxDate.setDate(this.startMinDate.getDate() + 365);

    // Venue only valid till 24 hours later.
    if (this.bookingType === EntitySubType.VENUE)
      this.maxDate = moment().add(24, 'hours').toDate();
    this.endMinDate.setTime(this.endMinDate.getTime() - 5 * 60 * 1000);
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
      fromDateControl.setValue(startTime);
      toDateControl.setValue(endTime);

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
          this.formService.reinitializeRooms.next(true);
          this.updateDateDifference();
          this.minToDate = new Date(maxToLimit); // Create a new date object
          this.minToDate.setDate(maxToLimit.getDate());
          this.formService.reservationDate.next(res);
          if (this.roomControls.valid && !this.isQuickReservation) {
            this.formService.getSummary.next();
          }
        }
      });

      toDateControl.valueChanges.subscribe((res) => {
        if (res) {
          this.toDateValue = new Date(res);
          this.updateDateDifference();
          !multipleDateChange && this.formService.reinitializeRooms.next(true);
          if (
            this.roomControls.valid &&
            !multipleDateChange &&
            !this.isQuickReservation
          ) {
            this.formService.getSummary.next();
          }
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

  listenForSourceChanges() {
    const sourceControl = this.reservationInfoControls.source;
    const sourceNameControl = this.reservationInfoControls.sourceName;
    const marketSegmentControl = this.reservationInfoControls.marketSegment;
    const otaSourceNameControl = this.reservationInfoControls.otaSourceName;
    const agentSourceNameControl = this.reservationInfoControls.agentSourceName;

    marketSegmentControl.valueChanges.subscribe((res) => {
      if (
        res &&
        this.configData?.marketSegment &&
        !this.configData?.marketSegment.some((item) => item.value === res)
      ) {
        this.configData.marketSegment.push({ label: res, value: res });
        marketSegmentControl.patchValue(res, { emitEvent: false });
      }
    });

    sourceControl.valueChanges.subscribe((res) => {
      if (res) {
        if (
          this.configData?.source &&
          !this.configData?.source.some(
            (item) => item.value === sourceNameControl.value
          )
        ) {
          this.configData.source.push({ label: res, value: res });
        }
        this.initSourceDetails(res);
        !this.editMode && sourceNameControl.reset();
      }
    });

    this.$subscription.add(
      this.formService.sourceData.subscribe((res) => {
        if (res && this.configData) {
          this.editMode = true;
          this.selectedAgent = {
            label: `${res?.agent?.firstName} ${res?.agent?.lastName}`,
            value: res?.agent?.id,
            ...res?.agent,
          };
          marketSegmentControl.patchValue(res.marketSegment);
          if (res.source === 'OTA') {
            otaSourceNameControl.setValue(res.sourceName);
          } else if (res.source === 'AGENT') {
            agentSourceNameControl.setValue(res.sourceName);
          } else {
            sourceNameControl.setValue(res.sourceName);
          }
          sourceControl.setValue(res.source);
        }
      })
    );
  }

  initSourceDetails(source: string) {
    const sourceNameControl = this.reservationInfoControls.sourceName;
    const agentSourceNameControl = this.reservationInfoControls.agentSourceName;
    const otaSourceNameControl = this.reservationInfoControls.otaSourceName;
    if (source === 'OTA') {
      otaSourceNameControl.setValidators(Validators.required);
      otaSourceNameControl.markAsUntouched();
      this.updateValueAndValidity(agentSourceNameControl);
      this.updateValueAndValidity(sourceNameControl);
      this.otaOptions = this.configData
        ? this.configData.source.filter((item) => item.value === source)[0].type
        : [];
      if (
        !this.otaOptions.some(
          (item) => item.value === otaSourceNameControl?.value
        ) &&
        otaSourceNameControl?.value?.length
      ) {
        this.otaOptions.push({
          label: otaSourceNameControl.value,
          value: otaSourceNameControl.value,
        });
      }
    } else if (source === 'AGENT') {
      agentSourceNameControl.setValidators(Validators.required);
      agentSourceNameControl.markAsUntouched();
      this.updateValueAndValidity(sourceNameControl);
      this.updateValueAndValidity(otaSourceNameControl);
    } else {
      sourceNameControl.setValidators([
        Validators.required,
        Validators.maxLength(60),
      ]);
      agentSourceNameControl.markAsUntouched();
      this.updateValueAndValidity(agentSourceNameControl);
      this.updateValueAndValidity(otaSourceNameControl);
    }
  }

  updateValueAndValidity(control: AbstractControl) {
    control.reset();
    control.clearValidators();
    control.updateValueAndValidity();
  }

  getCountryCode(): void {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        this.configData = new BookingConfig().deserialize(
          response.bookingConfig
        );
        this.listenForSourceChanges();
      });
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.countries = data.records;
    });
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

  agentChange(event) {}

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
      componentRef.instance.isSideBar = true;
      componentRef.instance.onClose.subscribe((res) => {
        if (typeof res !== 'boolean') {
          this.selectedAgent = {
            label: `${res?.agent?.firstName} ${res?.agent?.lastName}`,
            value: res?.agent?.id,
            ...res?.agent,
          };
        }
        this.sidebarVisible = false;
        componentRef.destroy();
      });
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
};
