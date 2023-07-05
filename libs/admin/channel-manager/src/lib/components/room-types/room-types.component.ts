import { Component, Input } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { ControlContainer } from '@angular/forms';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';
import { Subscription } from 'rxjs';
import {
  LibrarySearchItem,
  LibraryService,
} from '@hospitality-bot/admin/library';
import { RoomService } from 'libs/admin/room/src/lib/services/room.service';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  RoomType,
  RoomTypeList,
} from 'libs/admin/room/src/lib/models/rooms-data-table.model';
import { RoomTypes } from '../../types/channel-manager.types';

@Component({
  selector: 'hospitality-bot-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss'],
})
export class RoomTypesComponent extends FormComponent {
  entityId = '';
  roomTypes: Option[] = [];

  $subscription = new Subscription();
  /* roomTypes options variable */
  roomTypeOffSet = 0;
  loadingRoomTypes = false;
  noMoreRoomTypes = false;
  roomTypeLimit = 100;

  constructor(
    public controlContainer: ControlContainer,
    private channelMangerForm: ChannelManagerFormService,
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
    this.channelMangerForm.loadRoomTypes(this.entityId);
    this.channelMangerForm.roomDetails.subscribe((rooms: RoomTypes[]) => {
      this.roomTypes = rooms;
    });
  }
}
