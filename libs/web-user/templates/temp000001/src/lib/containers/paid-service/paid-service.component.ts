import { Component, OnInit, ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  ComponentFactory,
  OnDestroy,} from '@angular/core';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { AirportPickupComponent } from '../airport-pickup/airport-pickup.component';
import { BreakfastComponent } from '../breakfast/breakfast.component';

const componentMapping = {
  'AIRPORT P/UP': AirportPickupComponent,
  'BF': BreakfastComponent,
};

@Component({
  selector: 'hospitality-bot-paid-service',
  templateUrl: './paid-service.component.html',
  styleUrls: ['./paid-service.component.scss']
})
export class PaidServiceComponent implements OnInit {
 
  @ViewChild("serviceMetadata", { read: ViewContainerRef }) serviceContainer;
 
  slides;
  componentRef;

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
  };

  constructor(
    private _paidService: PaidService,
    private _resolver: ComponentFactoryResolver,
    private _container: ViewContainerRef,
  ) { }

  ngOnInit(): void {
    this.slides = this.hotelComplimentaryAmenities;
  }

  servicePackage(packageCode){
    let component = componentMapping[packageCode];
    this.createComponent(component);
  }

  createComponent(component) {
    this.serviceContainer.clear(); 
    const factory = this._resolver.resolveComponentFactory(component);
    this.componentRef = this.serviceContainer.createComponent(factory);
  }

  ngOnDestroy() {
    this.componentRef.destroy(); 
   }

  get hotelComplimentaryAmenities(){
    return this._paidService.paidAmenities && 
    this._paidService.paidAmenities.paidService;
  }

}
