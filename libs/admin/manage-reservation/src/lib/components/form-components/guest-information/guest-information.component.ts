import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  ControlContainer,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { GuestTableService } from 'libs/admin/guests/src/lib/services/guest-table.service';
import { GuestList } from '../../../models/reservations.model';
import { GuestDetails } from '../../../types/forms.types';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { manageGuestRoutes } from 'libs/admin/guests/src/lib/constant/route';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormService } from '../../../services/form.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-guest-information',
  templateUrl: './guest-information.component.html',
  styleUrls: [
    './guest-information.component.scss',
    '../../reservation.styles.scss',
  ],
})
export class GuestInformationComponent implements OnInit {
  guestOptions: Option[] = [];
  loadingGuests = false;
  noMoreGuests = false;
  guestsOffSet = 0;
  globalQueries = [];
  $subscription = new Subscription();
  entityId: string;
  parentFormGroup: FormGroup;

  @Input() reservationId: string;

  @Output() getSummary: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
    private guestService: GuestTableService,
    private router: Router,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.addFormGroup();
    this.listenForGuestDetailsChange();
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

  listenForGuestDetailsChange() {
    // Call summary data on guest details changes for company discount
    this.parentFormGroup
      .get('guestInformation.guestDetails')
      .valueChanges.pipe(debounceTime(1000))
      .subscribe((res) => {
        if (res) {
          this.getSummary.emit();
        }
      });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.entityId = this.globalFilterService.entityId;
        this.globalQueries = [
          ...this.globalQueries,
          {
            order: 'DESC',
            entityType: 'DUEIN',
          },
        ];
        this.getGuests();
      })
    );
  }

  loadMoreGuests() {
    this.guestsOffSet = this.guestsOffSet + 5;
    this.getGuests();
  }

  searchGuests(text: string) {
    if (text) {
      this.loadingGuests = true;
      this.guestService
        .searchGuest({
          params: this.adminUtilityService.makeQueryParams([
            {
              key: text,
              type: 'GUEST',
            },
          ]),
        })
        .subscribe((res) => {
          this.loadingGuests = false;
          const data = new GuestList().deserialize(res).records;
          this.guestOptions = data;
        });
    } else {
      this.guestsOffSet = 0;
      this.guestOptions = [];
      this.getGuests();
    }
  }

  createGuest() {
    this.formService.reservationForm.next(this.parentFormGroup.getRawValue());
    if (this.reservationId) {
      this.router.navigateByUrl(
        `/pages/members/guests/${manageGuestRoutes.editGuest.route}/${this.reservationId}`
      );
    } else {
      this.router.navigateByUrl(
        `/pages/members/guests/${manageGuestRoutes.addGuest.route}`
      );
    }
  }

  getGuests() {
    this.loadingGuests = true;
    this.guestService.getGuestList(this.getConfig()).subscribe(
      (res) => {
        const guests = res.records;
        const guestDetails: GuestDetails[] = guests.map((guest) => ({
          label: `${guest.firstName} ${guest.lastName}`,
          value: guest.id,
          phoneNumber: guest.contactDetails.contactNumber,
          cc: guest.contactDetails.cc,
          email: guest.contactDetails.emailId,
        }));
        this.guestOptions = [...this.guestOptions, ...guestDetails];
        this.noMoreGuests = guests.length < 5;
        this.loadingGuests = false;
      },
      (err) => {
        this.loadingGuests = false;
      }
    );
  }

  initGuestDetails() {
    if (this.reservationId)
      this.formService.guestInformation.subscribe((res) => {
        if (res) {
          if (
            this.guestOptions.findIndex((item) => item.value === res.id) === -1
          ) {
            this.guestOptions.push({
              label: `${res.firstName} ${res.lastName}`,
              value: res.id,
              phoneNumber: res.phoneNumber,
              cc: res.cc,
              email: res.email,
            });
          }
          this.parentFormGroup
            .get('guestInformation.guestDetails')
            .patchValue(res.id);
        }
      });
  }

  getConfig() {
    const config = [
      ...this.globalQueries,
      {
        entityState: 'ALL',
        offset: this.guestsOffSet,
        limit: 5,
        type: 'GUEST',
      },
    ];
    return { params: this.adminUtilityService.makeQueryParams(config) };
  }
}
