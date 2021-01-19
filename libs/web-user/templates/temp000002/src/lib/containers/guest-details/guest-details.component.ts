import { Component, OnInit } from '@angular/core';
import { GuestDetailsComponent as BaseGuestDetailsComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/guest-details/guest-details.component';

@Component({
  selector: 'hospitality-bot-guest-details',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/guest-details/guest-details.component.html',
  styleUrls: ['./guest-details.component.scss'],
})
export class GuestDetailsComponent extends BaseGuestDetailsComponent {}
