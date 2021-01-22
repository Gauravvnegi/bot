import { Component, OnInit } from '@angular/core';
import { AmenitiesComponent as BaseAmenitiesComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/amenities/amenities.component';
@Component({
  selector: 'hospitality-bot-amenities',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/amenities/amenities.component.html',
  styleUrls: ['./amenities.component.scss'],
})
export class AmenitiesComponent extends BaseAmenitiesComponent {}
