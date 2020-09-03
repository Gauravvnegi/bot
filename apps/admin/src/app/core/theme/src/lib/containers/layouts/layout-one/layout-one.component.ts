import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../../../services/settings.service';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public backgroundColor: string;
  public background_image: string;

  Profile: MenuItem[];

  selectedOption: {};


  constructor(public settingService: SettingsService) {}

  ngOnInit() {
    this.initLayoutConfigs();
    this.Profile = [
      { label: 'Profile', icon: 'person' },
      { label: 'Logout', icon: 'person_remove' },
    ];
  }

  initLayoutConfigs() {
    this.backgroundColor = '#0483f4';
  }
}
