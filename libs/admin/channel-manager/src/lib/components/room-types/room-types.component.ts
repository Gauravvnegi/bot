import { Component } from '@angular/core';
import { Option } from '@hospitality-bot/admin/shared';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { ControlContainer } from '@angular/forms';
import { ChannelManagerFormService } from '../../services/channel-manager-form.service';

@Component({
  selector: 'hospitality-bot-room-types',
  templateUrl: './room-types.component.html',
  styleUrls: ['./room-types.component.scss'],
})
export class RoomTypesComponent extends FormComponent {
  roomTypes: Option[] = [];
  // reviewPoint: there is no input to change the controlName

  constructor(
    public controlContainer: ControlContainer,
    private channelMangerForm: ChannelManagerFormService
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initOptions();
    this.listenChanges();
  }

  initOptions() {
    this.roomTypes = this.channelMangerForm.getRoomsData;
  }

  listenChanges() {}
}
