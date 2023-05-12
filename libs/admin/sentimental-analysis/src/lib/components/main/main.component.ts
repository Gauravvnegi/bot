import { Component } from '@angular/core';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent {
  routes: NavRouteOptions = [
    { label: 'Heda', link: '/pages/heda' },
    { label: 'Sentimental Analysis', link: './' },
  ];
}
