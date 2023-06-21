import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RoomsData } from '../constants/bulkupdate-response';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import {
  RoomType,
  RoomTypeList,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import {
  AddRoomTypes,
  RoomTypeOption,
} from 'libs/admin/room/src/lib/types/room';
import {
  updateItems,
  roomTypes,
  weeks,
} from '../constants/bulkupdate-response';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import { Subscription } from 'rxjs';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'hospitality-bot-bulk-update',
  templateUrl: './bulk-update.component.html',
  styleUrls: ['./bulk-update.component.scss'],
})
export class BulkUpdateComponent implements OnInit {
  hotelId: string;
  roomsData = RoomsData;
  useForm: FormGroup;
  updateItems = updateItems;
  roomTypes: RoomTypeOption[] = [];
  weeks = weeks;
  pageTitle = 'Bulk Update';
  navRoutes: NavRouteOptions = [];
  startMinDate = new Date();
  endMinDate = new Date();

  /* roomTypes options variable */
  roomTypeOffSet = 0;
  loadingRoomTypes = false;
  noMoreRoomTypes = false;
  roomTypeLimit = 10;

  $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService,
    private libraryService: LibraryService,
    private route: Router
  ) {}

  ngOnInit(): void {
    this.useForm = this.fb.group({
      update: ['AVAILABILITY'], // RATE, AVAILABILITY,
      updateValue: [''],
      fromDate: [''],
      toDate: [''],
      roomType: [''],
      selectedDays: [[]],
    });

    this.hotelId = this.globalFilterService.hotelId;
    this.configRoute();
    this.initOptionsConfig();
  }

  configRoute() {
    const previousRoute = this.route.url.split('/');
    previousRoute.pop();
    this.navRoutes = [
      {
        label:
          previousRoute[previousRoute.length - 1] === 'update-rates'
            ? 'Update Rates'
            : 'Update Inventory',
        link: previousRoute.join('/'),
      },
      { label: 'Bulk Update', link: './' },
    ];
  }

  onChangeNesting() {
    console.log('***Object List***', this.roomsData);
  }

  /**
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes() {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomTypes();
  }

  /**
   * @function initOptionsConfig Initialize room types options
   */
  initOptionsConfig(): void {
    this.getRoomTypes();
  }

  /**
   * @function getCategories to get room type options
   */
  getRoomTypes(): void {
    this.loadingRoomTypes = true;
    this.$subscription.add(
      this.roomService
        .getList<RoomTypeListResponse>(this.hotelId, {
          params: `?type=ROOM_TYPE&offset=${this.roomTypeOffSet}&limit=${this.roomTypeLimit}`,
        })
        .subscribe(
          (res) => {
            const data = new RoomTypeList()
              .deserialize(res)
              .records.map((item) => ({
                label: item.name,
                value: item.id,
                price: item.price,
                currency: item.currency,
              }));
            this.roomTypes = [...this.roomTypes, ...data];
            this.noMoreRoomTypes = data.length < this.roomTypeLimit;
          },
          (error) => {},
          () => {
            this.loadingRoomTypes = false;
          }
        )
    );
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string) {
    if (text) {
      this.loadingRoomTypes = true;
      this.libraryService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=${LibrarySearchItem.ROOM_TYPE}`,
        })
        .subscribe(
          (res) => {
            const data = res && res[LibrarySearchItem.ROOM_TYPE];
            this.roomTypes =
              data
                ?.filter((item) => item.status)
                .map((item) => {
                  const roomType = new RoomType().deserialize(item);

                  return {
                    label: roomType.name,
                    value: roomType.id,
                    price: roomType.price,
                    currency: roomType.currency,
                  };
                }) ?? [];
          },
          (error) => {},
          () => {
            this.loadingRoomTypes = false;
          }
        );
    } else {
      this.roomTypeOffSet = 0;
      this.roomTypes = [];
      this.getRoomTypes();
    }
  }

  onSubmit() {
    console.log(this.useForm.getRawValue());
  }
}
