import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';
import { AdminUtilityService } from 'libs/admin/shared/src';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';
import { Subscription } from 'rxjs';
import { roomFields, RoomFieldTypeOption } from '../../constants/reservation';
import { ManageReservationService } from '../../services/manage-reservation.service';

import {
  RoomTypeOption,
  RoomTypeOptionList,
} from '../../models/reservations.model';
@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent
  implements OnInit, OnDestroy {
  @Input() userFormGroup: FormGroup;
  @Output() refreshData = new EventEmitter();
  fields = roomFields;
  globalQueries = [];

  roomTypeOffSet = 0;
  roomTypeLimit = 10;
  roomTypes: RoomFieldTypeOption[] = [];
  hotelId: string;
  $subscription = new Subscription();

  constructor(
    protected fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private manageReservationService: ManageReservationService
  ) {
    super(fb);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.listenForGlobalFilters();
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(): void {
    const data = this.fields.reduce((prev, curr) => {
      const value = curr.required ? ['', Validators.required] : [''];
      prev[curr.name] = value;
      return prev;
    }, {});
    this.userFormGroup.addControl('roomInformation', this.fb.group(data));
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];

      this.getRoomType(this.globalQueries);
    });
  }

  /**
   * @function loadMoreRoomTypes load more categories options
   */
  loadMoreRoomTypes(): void {
    this.roomTypeOffSet = this.roomTypeOffSet + 10;
    this.getRoomType(this.globalQueries);
  }

  /**
   * @function searchRoomTypes To search categories
   * @param text search text
   */
  searchRoomTypes(text: string): void {
    if (text) {
      this.manageReservationService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=ROOM_TYPE`,
        })
        .subscribe(
          (res: any) => {
            const data = res;
            this.roomTypes =
              data.ROOM_TYPE?.filter((item) => item.status).map((item) => {
                new RoomTypeOption().deserialize(item);
                return {
                  label: item.name,
                  value: item.id,
                  roomCount: item.roomCount,
                  maxChildren: item.maxChildren,
                  maxAdult: item.maxAdult,
                };
              }) ?? [];
            this.fields[0].options = this.roomTypes;
          },
          (error) => {}
        );
    } else {
      this.roomTypeOffSet = 0;
      this.roomTypes = [];
      this.getRoomType(this.globalQueries);
    }
  }

  getSummaryData(): void {
    this.refreshData.emit();
  }

  /**
   * @function getRoomType to get room types.
   * @param queries global Queries.
   */
  getRoomType(queries): void {
    queries = [
      ...queries,
      {
        type: 'ROOM_TYPE',
        offset: this.roomTypeOffSet,
        limit: this.roomTypeLimit,
      },
    ];
    const config = {
      params: this.adminUtilityService.makeQueryParams(queries),
    };
    this.$subscription.add(
      this.manageReservationService
        .getRoomTypeList<RoomTypeListResponse>(this.hotelId, config)
        .subscribe((response) => {
          const data = new RoomTypeOptionList()
            .deserialize(response)
            .records.map((item) => ({
              label: item.name,
              value: item.id,
              roomCount: item.roomCount,
              maxChildren: item.maxChildren,
              maxAdult: item.maxAdult,
            }));
          this.roomTypes = [...this.roomTypes, ...data];
          this.fields[0].options = this.roomTypes;
        })
    );
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
