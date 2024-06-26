import { Component, Input } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { ControlContainer } from '@angular/forms';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { BarPriceService } from '../../services/bar-price.service';
import { RoomTypes } from 'libs/admin/channel-manager/src/lib/models/bulk-update.models';

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
    private channelMangerForm: BarPriceService,
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
    // this.channelMangerForm.loadRoomTypes(this.entityId);
    this.channelMangerForm.roomDetails.subscribe((rooms: RoomTypes[]) => {
      this.roomTypes = rooms;
      this.isAllSelected && this.defaultSelect();
    });
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
