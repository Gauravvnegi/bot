import {
  Component,
  OnInit,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { AirportPickupComponent } from '../airport-pickup/airport-pickup.component';
import { BreakfastComponent } from '../breakfast/breakfast.component';
import { SpaComponent } from '../spa/spa.component';

const componentMapping = {
  'AIRPORT P/UP': AirportPickupComponent,
  BF: BreakfastComponent,
  SPA: SpaComponent,
};

@Component({
  selector: 'hospitality-bot-paid-service',
  templateUrl: './paid-service.component.html',
  styleUrls: ['./paid-service.component.scss'],
})
export class PaidServiceComponent implements OnInit, OnDestroy {
  @ViewChild('serviceMetadata', { read: ViewContainerRef }) serviceContainer;

  slides;
  componentRef;

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
    responsive: [
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  selectedService = '';

  constructor(
    private _paidService: PaidService,
    private _resolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {
    this.slides = this.hotelComplimentaryAmenities;
    this.listenForServiceCompletion();
  }

  servicePackage(packageCode) {
    let component = componentMapping[packageCode];
    this.selectedService = packageCode;
    this.createComponent(component);
  }

  createComponent(component) {
    this.clearContainer();
    const factory = this._resolver.resolveComponentFactory(component);
    this.componentRef = this.serviceContainer.createComponent(factory);
  }

  clearContainer() {
    this.serviceContainer.clear();
  }

  listenForServiceCompletion() {
    this._paidService.isServiceCompleted$.subscribe(() => {
      this.clearContainer();
    });
  }

  ngOnDestroy() {
    this.componentRef.destroy();
  }

  get hotelComplimentaryAmenities() {
    return (
      this._paidService.paidAmenities &&
      this._paidService.paidAmenities.paidService
    );
  }
}
