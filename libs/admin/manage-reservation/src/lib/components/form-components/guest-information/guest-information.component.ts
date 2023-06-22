import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { GuestTableService } from 'libs/admin/guests/src/lib/services/guest-table.service';
import { Guest } from '../../../models/reservations.model';
import { GuestDetails } from '../../../types/forms.types';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

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
  hotelId: string;
  
  @Input() reservationId: string;

  constructor(
    public controlContainer: ControlContainer,
    private guestService: GuestTableService,
    private router: Router,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
  ) {}

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenForGlobalFilters();
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
        this.hotelId = this.globalFilterService.hotelId;
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
      this.guestService.searchGuest(text).subscribe((res) => {
        this.loadingGuests = false;
        const data = new Guest().deserialize(res);
        this.guestOptions.push(data);
      });
    } else {
      this.guestsOffSet = 0;
      this.guestOptions = [];
      this.getGuests();
    }
  }

  createGuest() {
    if (this.reservationId) {
      this.router.navigateByUrl(
        `pages/efrontdesk/manage-reservation/edit-reservation/${this.reservationId}/add-guest`
      );
    } else {
      this.router.navigateByUrl(
        'pages/efrontdesk/manage-reservation/add-reservation/add-guest'
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

  getConfig() {
    const config = [
      ...this.globalQueries,
      { entityState: 'ALL', offset: this.guestsOffSet, limit: 5 },
    ];
    return { queryObj: this.adminUtilityService.makeQueryParams(config) };
  }
}
