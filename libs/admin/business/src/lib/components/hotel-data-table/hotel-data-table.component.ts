import { Component, Input, OnInit } from '@angular/core';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  TableService,
} from '@hospitality-bot/admin/shared';
import { cols } from '../../constant/hotel-data-table';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { HotelService } from '../../services/hotel.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-hotel-data-table',
  templateUrl: './hotel-data-table.component.html',
  styleUrls: [
    './../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './hotel-data-table.component.scss',
  ],
})
export class HotelDataTableComponent extends BaseDatatableComponent
  implements OnInit {
  cols = cols;
  tableName = 'Hotel';
  $subscription = new Subscription();
  hotelId: string;
  loading: boolean = false;
  globalQueries = [];
  tableFG;
  @Input() brandId: string = '';

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    protected tabFilterService: TableService,
    private hotelService: HotelService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.$subscription.add(
      this.hotelService.getHotelList(this.hotelId).subscribe(
        (res) => {
          this.values = res.records;
        },
        (err) => {
          this.loading = false;
        },
        this.handelFinal
      )
    );
  }

  /**
   * To get query params
   */
  getQueryConfig() {
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

  /**
   * @function handleStatus
   * @description To handle status Active/Inactive
   */

  handleStatus(status: boolean, rowData): void {
    this.loading = true;
    this.hotelService.updateHotel(this.hotelId, { status: status }).subscribe(
      (res) => {
        const statusValue = (val: boolean) => (val ? 'ACTIVE' : 'INACTIVE');
        this.updateStatusAndCount(
          statusValue(rowData.status),
          statusValue(status)
        );
        this.values.find((item) => item.id === rowData.id).status = status;
        this.snackbarService.openSnackBarAsText(
          'Status changes successfully',
          '',
          { panelClass: 'success' }
        );
      },
      ({ error }) => {},
      this.handelFinal
    );
  }

  editHotel(Id) {
    console.log(Id);
    this.router.navigate([
      `pages/settings/business-info/brand/${this.brandId}/hotel/${Id}`,
    ]);
  }

  handelFinal = () => {
    this.loading = false;
  };
}
