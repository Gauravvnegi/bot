import { Component, OnInit } from '@angular/core';
import { AddGstComponent as BaseGstComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/add-gst/add-gst.component';

@Component({
  selector: 'hospitality-bot-add-gst',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/add-gst/add-gst.component.html',
  styleUrls: ['./add-gst.component.scss'],
})
export class AddGstComponent extends BaseGstComponent {}
