import { Component, OnInit } from '@angular/core';
import { RegistrationCardComponent as BaseRegistrationCardComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/registration-card/registration-card.component';

@Component({
  selector: 'hospitality-bot-registration-card',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/registration-card/registration-card.component.html',
  styleUrls: ['./registration-card.component.scss'],
})
export class RegistrationCardComponent extends BaseRegistrationCardComponent {}
