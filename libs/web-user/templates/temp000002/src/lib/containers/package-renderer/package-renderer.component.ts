import { Component, OnInit } from '@angular/core';
import { PackageRendererComponent as BasePackageRendererComponent } from 'libs/web-user/templates/temp000001/src/lib/containers/package-renderer/package-renderer.component';
import { AirportFacilitiesComponent } from '../packages/airport-facilities/airport-facilities.component';
import { DefaultAmenityComponent } from '../packages/default-amenity/default-amenity.component';

const componentMapping = {
  'AIRPORT P/UP': AirportFacilitiesComponent,
  'AIRPORT DROP': AirportFacilitiesComponent,
};
@Component({
  selector: 'hospitality-bot-package-renderer',
  templateUrl: './package-renderer.component.html',
  styleUrls: ['./package-renderer.component.scss'],
})
export class PackageRendererComponent extends BasePackageRendererComponent {
  protected packageComponent = componentMapping;
  protected packageDefaultComponent = DefaultAmenityComponent;
}
