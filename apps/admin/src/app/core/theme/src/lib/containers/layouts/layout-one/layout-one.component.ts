import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public backgroundColor: string;
  public background_image: string;

  constructor(public settingService: SettingsService) {}

  ngOnInit() {
    this.initLayoutConfigs();
  }

  initLayoutConfigs() {
    this.backgroundColor = 'blue';
  }
}
