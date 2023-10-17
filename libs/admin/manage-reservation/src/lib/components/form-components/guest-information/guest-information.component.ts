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
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Option } from '@hospitality-bot/admin/shared';
import { GuestTableService } from 'libs/admin/guests/src/lib/services/guest-table.service';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../services/form.service';
import { GuestType } from 'libs/admin/guests/src/lib/types/guest.type';
import { AddGuestComponent } from 'libs/admin/guests/src/lib/components';

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
    private guestService: GuestTableService,
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
            value: res.id,
            phoneNumber: res.contactDetails.contactNumber,
            cc: res.contactDetails.cc,
            email: res.contactDetails.emailId,
          };
          this.parentFormGroup
            .get('guestInformation.guestDetails')
            .patchValue(res.id);
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
          this.getGuestById(res);
          this.editMode = true;
        }
      })
    );
  }

  getGuestById(id: string) {
    this.guestService.getGuestById(id).subscribe((res) => {
      this.selectedGuest = {
        label: `${res.firstName} ${res.lastName}`,
        value: res.id,
        phoneNumber: res.contactDetails.contactNumber,
        cc: res.contactDetails.cc,
        email: res.contactDetails.emailId,
      };
      this.parentFormGroup
        .get('guestInformation.guestDetails')
        .patchValue(res.id);
    });
  }

  guestChange(event: GuestType) {
    if (event && event?.id) {
      this.selectedGuest = {
        label: `${event.firstName} ${event.lastName}`,
        value: event.id,
        phoneNumber: event.contactDetails.contactNumber,
        cc: event.contactDetails.cc,
        email: event.contactDetails.emailId,
      };
      if (!this.editMode) {
        this.formService.getSummary.next();
      }
      setTimeout(() => {
        this.editMode = false;
      }, 2000);
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

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
