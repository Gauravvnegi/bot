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
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../services/form.service';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { ReservationForm } from '../../../constants/form';
import { ReservationCurrentStatus } from '../../../models/reservations.model';
import { SideBarService } from 'apps/admin/src/app/core/theme/src/lib/services/sidebar.service';

@Component({
  selector: 'hospitality-bot-guest-information',
  templateUrl: './guest-information.component.html',
  styleUrls: [
    './guest-information.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class GuestInformationComponent implements OnInit {
  globalQueries = [];
  $subscription = new Subscription();

  entityId: string;
  parentFormGroup: FormGroup;

  selectedGuest: Option;
  @Input() reservationId: string;

  sidebarVisible: boolean;
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  editMode = false;
  isCheckinOrCheckout = true;

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
    private globalFilterService: GlobalFilterService,
    private formService: FormService,
    private sidebarService: SideBarService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.addFormGroup();
    this.listenForGlobalFilters();
    this.initGuestDetails();
  }

  addFormGroup() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    const data = {
      guestDetails: ['', [Validators.required]],
    };
    this.parentFormGroup.addControl('guestInformation', this.fb.group(data));
    this.formService.currentJourneyStatus.subscribe((res) => {
      if (res)
        this.isCheckinOrCheckout =
          res === ReservationCurrentStatus.INHOUSE ||
          res === ReservationCurrentStatus.DUEOUT ||
          res === ReservationCurrentStatus.CHECKEDOUT;
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [...data['dateRange'].queryValue];
        this.entityId = this.globalFilterService.entityId;
      })
    );
  }

  showGuests() {
    this.sidebarService.openSidebar({
      componentName: 'AddGuest',
      containerRef: this.sidebarSlide,
      onOpen: () => (this.sidebarVisible = true),
      onClose: (res) => {
        this.sidebarVisible = false;
        if (typeof res !== 'boolean') {
          this.selectedGuest = {
            label: `${res.firstName} ${res.lastName}`,
            value: res.id,
          };
        }
      },
    });
  }

  initGuestDetails() {
    // if (this.reservationId)
    this.$subscription.add(
      this.formService.guestInformation.subscribe((res) => {
        if (res) {
          this.selectedGuest = {
            label: res.label,
            value: res.value,
          };
          this.formService.offerType.subscribe((res) => {
            if (res && res === 'COMPANY' && this.reservationId)
              this.inputControls.offerId.reset();
          });
        }
      })
    );
  }

  guestChange(event: GuestType) {
    if (event && event?.id) {
      this.selectedGuest = {
        label: `${event.firstName} ${event.lastName}`,
        value: event.id,
      };
      this.formService.offerType.subscribe((res) => {
        if (res && res === 'COMPANY' && this.reservationId)
          this.inputControls.offerId.reset();
      });
    }
  }

  getConfig(type = 'get') {
    if (type === 'search') return { type: 'GUEST' };
    const queries = {
      entityId: this.entityId,
      toDate: this.globalQueries[0].toDate,
      fromDate: this.globalQueries[1].fromDate,
      entityState: 'ALL',
      type: 'GUEST',
    };
    return queries;
  }

  get inputControls() {
    return this.parentFormGroup.controls as Record<
      keyof ReservationForm,
      AbstractControl
    >;
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
