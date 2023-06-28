import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  QueryConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import { outletCols } from '../../../constants/reservation-table';
import { Subscription } from 'rxjs';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { ManageReservationService } from '../../../services/manage-reservation.service';
import { Router } from '@angular/router';
import { selectedOutlet } from '../../../types/reservation.type';

@Component({
  selector: 'hospitality-bot-reservation-datatable-model',
  templateUrl: './reservation-datatable-model.component.html',
  styleUrls: [
    './reservation-datatable-model.component.scss',
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class ReservationDataTableModelComponent extends BaseDatatableComponent
  implements OnInit {
  navLink: string = ''; //link to navigate to booking page on the basis of outlet type
  hotelId: string;
  cols = outletCols;
  globalQueries = [];
  tableName: string = 'Reservation';

  subscriptionList$ = new Subscription();

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    private reservationService: ManageReservationService,
    private adminUtilityService: AdminUtilityService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  @Input() set selectedOutlet(value: selectedOutlet) {
    this.globalQueries = [];
    this.initTableValues(value.id, value.type);

    //set the nav link on the basis of outlet type
    switch (value.type) {
      case 'HOTEL': 
        this.navLink = '/pages/efrontdesk/manage-reservation/add-reservation';
        break;
      case 'RESTAURANT':
        this.navLink = `/hotel/${this.hotelId}/reservation/restaurant`;
        break;
      case 'SPA':
        this.navLink = `/hotel/${this.hotelId}/reservation/spa`;
        break;
      case 'VENUE':
        this.navLink = `/hotel/${this.hotelId}/reservation/activity`;
    }
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
  }

  initTableValues(outletId, outletType): void {
    //api call to get the outlet list on the basis of outlet id  and outlet type
    this.loading = true;
    this.subscriptionList$.add(
      this.reservationService
        .getReservationList(this.hotelId, this.getQueryConfig())
        .subscribe(
          (res) => {
            this.values = res.records;
            this.initFilters(
              res.entityTypeCounts,
              res.entityStateCounts,
              res.totalRecord
            );
            this.loading = false;
          },
          (err) => {},
          this.handelFinal
        )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters(),
        ...[...this.globalQueries, { order: 'DESC' }],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };

    return config;
  }

  editReservation(reservationId: string) {
    this.router.navigate([
      `/hotel/${this.hotelId}/reservation/edit/${reservationId}`,
    ]);
  }

  /**
   * @function getSelectedQuickReplyFilters To return the selected chip list.
   * @returns The selected chips.
   */
  getSelectedQuickReplyFilters() {
    const chips = this.filterChips.filter(
      (item) => item.isSelected && item.value !== 'ALL'
    );
    return [
      chips.length !== 1
        ? { entityState: null }
        : { entityState: chips[0].value === 'ACTIVE' },
    ];
  }

  handelFinal = () => {
    this.loading = false;
  };
}

