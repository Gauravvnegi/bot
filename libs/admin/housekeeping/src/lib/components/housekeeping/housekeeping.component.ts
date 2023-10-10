import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Option,
  QueryConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import { RoomTypeOptionList } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { RoomList } from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription } from 'rxjs';
import { roomStatusDetails } from '../../constant/room';
import { houseKeepingRoutes } from '../../constant/routes';
import { HousekeepingService } from '../../services/housekeeping.service';

@Component({
  selector: 'hospitality-bot-housekeeping',
  templateUrl: './housekeeping.component.html',
  styleUrls: [
    './housekeeping.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class HousekeepingComponent extends BaseDatatableComponent
  implements OnInit {
  pageTitle = 'Housekeeping';
  navRoutes = [];
  useForm: FormGroup;
  first = 0;
  loading: boolean = false;
  entityId: string;
  roomStatusDetails = roomStatusDetails;
  $subscription = new Subscription();
  roomTypes: Option[] = [
    {
      label: 'All',
      value: '',
    },
  ];
  roomTypeOffSet = 0;
  roomTypeLimit = 10;
  dateValue = {};
  showContent = false;
  isQuickFilterInEmptyView: boolean = false;

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private housekeepingService: HousekeepingService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initForm();
    this.getRoomList();
    this.getRoomType();
    this.listenForRoomTypeChange();
    this.listenForRefreshData();
    this.navRoutes = houseKeepingRoutes['HouseKeeping'].navRoutes;
  }

  loadData(event: LazyLoadEvent): void {
    this.getRoomList();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      date: [new Date(), []],
      roomType: [''],
    });
  }

  listenForRefreshData(): void {
    this.housekeepingService.refreshData.subscribe((value) => {
      if (value) {
        this.getRoomList();
      }
    });
  }

  getRoomList(): void {
    this.loading = true;
    this.housekeepingService
      .getList(this.entityId, this.getQueryConfig())
      .subscribe(
        (res) => {
          const roomList = new RoomList().deserialize(res);
          this.values = roomList.records;
          this.initFilters(
            roomList.entityTypeCounts,
            roomList.entityStateCounts,
            roomList.totalRecord,
            this.roomStatusDetails
          );
          this.values.length > 0
            ? (this.isQuickFilterInEmptyView = false)
            : (this.isQuickFilterInEmptyView = true);

          this.loading = false;
        },
        () => {
          this.values = [];
          this.loading = false;
        }
      );
  }

  /**
   * @function getQueryConfig To get query config
   * @returns QueryConfig
   */

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.getSelectedQuickReplyFilters({
          key: 'roomStatus',
        }),
        {
          type: 'ROOM',
          offset: this.first,
          limit: this.rowsPerPage,
          roomTypeIds: this.useForm.get('roomType').value ?? [],
          raw: true,
        },
      ]),
    };
    return config;
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string): void {
    if (text) {
      this.housekeepingService
        .searchLibraryItem(this.entityId, {
          params: `?key=${text}&type=ROOM_TYPE`,
        })
        .subscribe(
          (res) => {
            if (!res) {
              this.roomTypes = [];
              return;
            }
            const data = res;
            this.roomTypes =
              data.ROOM_TYPE?.filter((item) => item.status)?.map((item) => {
                return {
                  label: item.name,
                  value: item.id,
                };
              }) ?? [];
          },
          ({ error }) => {},
          () => {}
        );
    } else {
      this.roomTypeOffSet = 0;
      this.roomTypes = [{ label: 'All', value: '' }];
      this.getRoomType();
    }
  }

  listenForRoomTypeChange(): void {
    this.useForm.get('roomType').valueChanges.subscribe((value) => {
      this.getRoomList();
    });
  }

  /**
   * @function loadMoreRoomTypes To load more categories
   * @param index offset
   */

  loadMoreRoomTypes(index): void {
    this.roomTypeOffSet = index;
    this.getRoomType();
  }

  /**
   * @function getRoomType to get room types.
   * @param queries global Queries.
   */
  getRoomType(): void {
    const queries = [
      {
        type: 'ROOM_TYPE',
        offset: this.roomTypeOffSet,
        limit: this.roomTypeLimit,
        createBooking: true,
      },
    ];

    const config = {
      params: this.adminUtilityService.makeQueryParams(queries),
    };

    this.$subscription.add(
      this.housekeepingService.getRoomTypeList(this.entityId, config).subscribe(
        (response) => {
          const data = new RoomTypeOptionList()
            .deserialize(response)
            .records.map((item) => ({
              label: item.name,
              value: item.id,
            }));
          this.roomTypes = [...this.roomTypes, ...data];
        },
        ({ error }) => {},
        () => {}
      )
    );
  }
}
