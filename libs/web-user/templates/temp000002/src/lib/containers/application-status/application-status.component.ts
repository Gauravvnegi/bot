import { Component, OnInit } from '@angular/core';
import { ApplicationStatusComponent as BaseApplicationStatusComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/application-status/application-status.component';
@Component({
  selector: 'hospitality-bot-application-status',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/application-status/application-status.component.html',
  styleUrls: ['./application-status.component.scss'],
})
export class ApplicationStatusComponent extends BaseApplicationStatusComponent {}
