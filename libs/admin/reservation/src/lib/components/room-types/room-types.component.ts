import { Component, Input } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { ControlContainer } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import {
  RoomType,
  RoomTypeList,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { RoomTypeListResponse } from 'libs/admin/room/src/lib/types/service-response';

@Component({
  selector: 'hospitality-bot-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss'],
})
export class RoomTypesComponent extends FormComponent {
  entityId = '';
  roomTypes: Option[] = [];
  @Input() isAllSelected = false;

  $subscription = new Subscription();
  /* roomTypes options variable */
  roomTypeOffSet = 0;
  loadingRoomTypes = false;
  noMoreRoomTypes = false;
  roomTypeLimit = 100;

  constructor(
    public controlContainer: ControlContainer,
    private roomService: RoomService,
    private globalFilterService: GlobalFilterService
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.initOptions();
  }

  initOptions() {
    this.initRoomTypes();
  }

  initRoomTypes() {
    this.$subscription.add(
      this.roomService
        .getList<RoomTypeListResponse>(this.entityId, {
          params:
            '?type=ROOM_TYPE&offset=0&limit=200&roomTypeStatus=true&createBooking=true',
        })
        .subscribe((res) => {
          const roomTypesList = new RoomTypeList().deserialize(res).records;
          this.roomTypes = roomTypesList.map((roomType: RoomType) => ({
            label: roomType.name,
            value: roomType.id,
            roomCount: roomType.roomCount,
          }));
          this.isAllSelected && this.defaultSelect();
        })
    );
  }

  defaultSelect() {
    this.controlContainer.control.patchValue(
      {
        [this.controlName]: this.roomTypes.map((item) => item.value),
      },
      { emitEvent: false }
    );
  }
}
