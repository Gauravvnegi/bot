import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  ModuleNames,
  Option,
  QueryConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import { ChannelManagerFormService } from 'libs/admin/channel-manager/src/lib/services/channel-manager-form.service';
import {
  Room,
  RoomList,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { LazyLoadEvent } from 'primeng/api';
import { Subscription, of } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { roomStatusDetails } from '../../constant/room';
import { houseKeepingRoutes } from '../../constant/routes';
import { HousekeepingService } from '../../services/housekeeping.service';
import { NightAuditService } from 'libs/admin/global-shared/src/lib/services/night-audit.service';

@Component({
  selector: 'hospitality-bot-housekeeping',
  templateUrl: './housekeeping.component.html',
  styleUrls: [
    './housekeeping.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
  providers: [ChannelManagerFormService],
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
  isTabFilters: boolean = false;
  backUpRoomList: Room[];

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private housekeepingService: HousekeepingService,
    private channelMangerForm: ChannelManagerFormService,
    private routesConfigServices: RoutesConfigService,
    private auditService: NightAuditService
  ) {
    super(fb, tabFilterService);
    this.initForm();
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.checkAudit();
    this.listenForRoomTypeChange();
    this.listenForRefreshData();
    this.navRoutes = houseKeepingRoutes['HouseKeeping'].navRoutes;
    this.$subscription.add(
      this.channelMangerForm.roomDetails.subscribe((roomType) => {
        if (roomType.length > 0) {
          this.useForm
            .get('roomType')
            .setValue(roomType.map((item) => item.id));
        }
      })
    );
  }

  loadData(event: LazyLoadEvent): void {
    this.getRoomList();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      date: [new Date(), []],
      roomType: [''],
      search: [''],
    });
    this.listenForSearch();
  }

  listenForSearch() {
    const { search } = this.useForm.controls;
    search.valueChanges
      .pipe(
        debounceTime(1000),
        switchMap((searchTerm) => {
          const filteredValues = this.backUpRoomList.filter((item) =>
            item.roomNo
              .toLocaleLowerCase()
              .includes(searchTerm.toLocaleLowerCase())
          );
          return of(filteredValues);
        })
      )
      .subscribe((updatedValues) => {
        this.values = updatedValues;
      });
  }

  listenForRefreshData(): void {
    this.$subscription.add(
      this.housekeepingService.refreshData.subscribe((value) => {
        if (value) {
          this.getRoomList();
        }
      })
    );
  }

  getRoomList(): void {
    this.loading = true;
    this.$subscription.add(
      this.housekeepingService
        .getList(this.entityId, this.getQueryConfig())
        .subscribe(
          (res) => {
            const roomList = new RoomList().deserialize(res);
            this.backUpRoomList = roomList.records;
            this.values = roomList.records;
            this.initFilters(
              {},
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
        )
    );
  }

  navigateToAddRoom() {
    this.routesConfigServices.navigate({
      subModuleName: ModuleNames.ROOM,
      additionalPath: 'add-room/multiple',
    });
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
          offset: '0',
          limit: '0',
          roomTypeIds: this.useForm.get('roomType').value ?? [],
          raw: true,
        },
      ]),
    };
    return config;
  }

  checkAudit() {
    this.$subscription.add(
      this.auditService.checkAudit(this.entityId).subscribe(
        (res) => {
          const date = res?.shift() ?? Date.now();
          this.useForm.get('date').setValue(new Date(date));
        },
        (error) => {}
      )
    );
  }

  listenForRoomTypeChange(): void {
    this.useForm.get('roomType').valueChanges.subscribe((value) => {
      this.getRoomList();
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
