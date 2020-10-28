import { Component } from '@angular/core';
import { environment } from '@hospitality-bot/admin/environment';

@Component({
  selector: 'admin-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  constructor() {
    console.log('====================>', environment['name']);
  }
}
