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
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../services/form.service';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';
import { ReservationForm } from '../../../constants/form';

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

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
    private globalFilterService: GlobalFilterService,
    private formService: FormService,
    private resolver: ComponentFactoryResolver,
    private compiler: Compiler
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
    const lazyModulePromise = import(
      'libs/admin/guests/src/lib/admin-guests.module'
    )
      .then((module) => {
        return this.compiler.compileModuleAsync(module.AdminGuestsModule);
      })
      .catch((error) => {
        console.error('Error loading the lazy module:', error);
      });
    lazyModulePromise.then((moduleFactory) => {
      this.sidebarVisible = true;
      const factory = this.resolver.resolveComponentFactory(AddGuestComponent);
      this.sidebarSlide.clear();
      const componentRef = this.sidebarSlide.createComponent(factory);
      componentRef.instance.isSideBar = true;
      componentRef.instance.onClose.subscribe((res: GuestType | boolean) => {
        if (typeof res !== 'boolean') {
          this.selectedGuest = {
            label: `${res.firstName} ${res.lastName}`,
            value: res.id
          };
        }
        this.sidebarVisible = false;
        componentRef.destroy();
      });
    });
  }

  initGuestDetails() {
    // if (this.reservationId)
    this.$subscription.add(
      this.formService.guestInformation.subscribe((res) => {
        if (res) {
          this.selectedGuest = {
            label: res.label,
            value: res.value
          };
          this.formService.offerType.subscribe((res) => {
            if (res && res === 'COMPANY' && this.reservationId) {
              this.inputControls.offerId.reset();
            }
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
        if (res && res === 'COMPANY' && this.reservationId) {
          this.inputControls.offerId.reset();
        }
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
