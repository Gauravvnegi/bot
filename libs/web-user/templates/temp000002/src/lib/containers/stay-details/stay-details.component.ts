import { Component, OnInit } from '@angular/core';
import { StayDetailsComponent as BaseStayDetailsComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/stay-details/stay-details.component';
@Component({
  selector: 'hospitality-bot-stay-details',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/stay-details/stay-details.component.html',
  styleUrls: ['./stay-details.component.scss'],
})
export class StayDetailsComponent extends BaseStayDetailsComponent {}
