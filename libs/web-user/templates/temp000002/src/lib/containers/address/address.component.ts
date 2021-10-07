import { Component } from '@angular/core';
import { AddressComponent as BaseAddressComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/address/address.component';

@Component({
  selector: 'hospitality-bot-address',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/address/address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent extends BaseAddressComponent {}
