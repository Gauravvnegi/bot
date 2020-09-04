import { Component, OnInit, ComponentRef } from '@angular/core';

@Component({
  selector: 'admin-layout-one',
  templateUrl: './layout-one.component.html',
  styleUrls: ['./layout-one.component.scss'],
})
export class LayoutOneComponent implements OnInit {
  public backgroundColor: string;
  public background_image: string;

  constructor() {}

  ngOnInit() {
    this.initLayoutConfigs();
  }

  initLayoutConfigs() {
    this.backgroundColor = 'blue';
  }
}
