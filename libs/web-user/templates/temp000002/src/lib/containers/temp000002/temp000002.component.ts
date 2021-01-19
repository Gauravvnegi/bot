import { Component } from '@angular/core';
import { TemplateCode } from 'libs/web-user/shared/src/lib/constants/template';
import { Temp000001Component as BaseTemplateComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/temp000001/temp000001.component';

@Component({
  selector: 'hospitality-bot-temp000002',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/temp000001/temp000001.component.html',
  styleUrls: ['./temp000002.component.scss'],
})
export class Temp000002Component extends BaseTemplateComponent {
  templateId = TemplateCode.temp000002;
}
