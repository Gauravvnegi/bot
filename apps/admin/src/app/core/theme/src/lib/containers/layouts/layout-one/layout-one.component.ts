import { Component, OnInit, ComponentRef } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public backgroundColor: string;
  public background_image: string;

  profile: MenuItem[];


  constructor() {}

  ngOnInit() {
    this.initLayoutConfigs();
    this.profile = [
      { label: 'Profile', icon: 'person' },
      { label: 'Logout', icon: 'person_remove' },
    ];
  }

  initLayoutConfigs() {
    this.backgroundColor = '#0483f4';
  }
}
