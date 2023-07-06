import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OutletBaseComponent } from '../outlet-base.components';

@Component({
  selector: 'hospitality-bot-import-service',
  templateUrl: './import-service.component.html',
  styleUrls: ['./import-service.component.scss'],
})
export class ImportServiceComponent extends OutletBaseComponent
  implements OnInit {
  constructor(router: Router, route: ActivatedRoute) {
    super(router, route);
  }

  ngOnInit(): void {
    this.initComponent('importService');
  }

  saveForm(serviceIds: string[]) {}
}
