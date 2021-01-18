import { Component, OnInit } from '@angular/core';
import { ComplimentaryAmenitiesComponent as BaseComplimentaryAmenitiesComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/complimentary-amenities/complimentary-amenities.component';

@Component({
  selector: 'hospitality-bot-complimentary-amenities',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/complimentary-amenities/complimentary-amenities.component.html',
  styleUrls: ['./complimentary-amenities.component.scss'],
})
export class ComplimentaryAmenitiesComponent extends BaseComplimentaryAmenitiesComponent {}
