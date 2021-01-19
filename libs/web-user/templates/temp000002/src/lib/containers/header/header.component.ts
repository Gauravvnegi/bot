import { Component, OnInit } from '@angular/core';
import { HeaderComponent as BaseHeaderComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/header/header.component';

@Component({
  selector: 'hospitality-bot-header',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/header/header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent extends BaseHeaderComponent {}
