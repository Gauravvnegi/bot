import { Component } from '@angular/core';
import { StatusComponent as BaseStatusComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/status/status.component';

@Component({
  selector: 'hospitality-bot-status',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/status/status.component.html',
  styleUrls: ['./status.component.scss'],
})
export class StatusComponent extends BaseStatusComponent {}
