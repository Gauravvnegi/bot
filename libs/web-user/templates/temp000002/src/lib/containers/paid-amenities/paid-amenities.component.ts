import { Component, OnInit } from '@angular/core';
import { PaidAmenitiesComponent as BasePaidAmenitiesComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/paid-amenities/paid-amenities.component';
import { PackageRendererComponent } from '../package-renderer/package-renderer.component';

@Component({
  selector: 'hospitality-bot-paid-amenities',
  templateUrl:
    '../../../../../temp000001/src/lib/containers/paid-amenities/paid-amenities.component.html',
  styleUrls: ['./paid-amenities.component.scss'],
})
export class PaidAmenitiesComponent extends BasePaidAmenitiesComponent {
  protected packageRenderComponent = PackageRendererComponent;
}
