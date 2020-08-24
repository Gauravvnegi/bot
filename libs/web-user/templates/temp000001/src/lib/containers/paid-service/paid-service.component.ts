import { Component, OnInit, ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  OnDestroy,
  Input,
  OnChanges} from '@angular/core';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { AirportPickupComponent } from '../airport-pickup/airport-pickup.component';
import { BreakfastComponent } from '../breakfast/breakfast.component';
import { SpaComponent } from '../spa/spa.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';

const componentMapping = {
  'AIRPORT P/UP': AirportPickupComponent,
  'BF': BreakfastComponent,
  'SPA': SpaComponent
};

@Component({
  selector: 'hospitality-bot-paid-service',
  templateUrl: './paid-service.component.html',
  styleUrls: ['./paid-service.component.scss']
})
export class PaidServiceComponent implements OnInit, OnDestroy, OnChanges {
 
  @ViewChild("serviceMetadata", { read: ViewContainerRef }) serviceContainer;

  @Input() parentForm: FormGroup;
 
  slides;
  componentRef;
  ameni

  paidAmenitiesForm: FormGroup;

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
  };

  constructor(
    private _fb: FormBuilder,
    private _paidService: PaidService,
    private _reservationService: ReservationService,
    private _resolver: ComponentFactoryResolver
  ) { 
    this.initPaidAmenitiesForm();
  }

  ngOnInit(): void {
    this.slides = this.hotelComplimentaryAmenities;
    this.addAmenityToForm();
    this.listenForComponentRender();
  }

  ngOnChanges(){
      this.amenitiesForm.addControl('paidAmenities',this.paidAmenitiesForm);
  }

  initPaidAmenitiesForm() {
    this.paidAmenitiesForm = this._fb.group({});
  }

  addAmenityToForm(){
    this.slides.forEach(slide => {
      this.paidAmenitiesForm.addControl(slide.packageCode, this.getAmenitiesFG());
    });
  }

  getAmenitiesFG(){
    return this._fb.group({
      id: [''],
      isSelected: [''],
    })
  }

  servicePackage(slideData){
    let component = componentMapping[slideData.packageCode];
    this.createComponent(component, slideData.id, slideData.packageCode);
  }

  createComponent(component, amenityId, packageCode) {
    this.clearContainer(); 
    const factory = this._resolver.resolveComponentFactory(component);
    this.componentRef = this.serviceContainer.createComponent(factory);
    this.listenForServiceAddition();
    //this.listenForServiceRemoval();
    this.addPropsToComponentInstance(amenityId, packageCode);
  }

  addPropsToComponentInstance(amenityId, packageCode){
    this.componentRef.instance.paidAmenitiesForm = this.paidAmenityForm.get(packageCode) as FormGroup;
    this.componentRef.instance.packageCode = packageCode;
    this.componentRef.instance.amenityData = this.getAminityData(packageCode);
  }

  getAminityData(packageCode){
    let aminityData; 
    this.slides.forEach(amenity => {
        if(amenity.packageCode === packageCode){
          aminityData = amenity.metaData; 
        }
      });
    return aminityData;
  }

  clearContainer(){
    this.serviceContainer.clear();  
  }

  listenForComponentRender(){
    this._paidService.isComponentRendered$.subscribe(()=>{
      this.getAminityForm(this._paidService.packageCode).addControl('metaData', this._paidService.amenityForm);
    })
  }

  listenForServiceAddition(){
    this.componentRef && this.componentRef.instance.addEvent.subscribe(packageCode => {
      this.getAminityForm(packageCode).get('metaData').patchValue(this._paidService.amenityData.metaData);
      const index = this.slides.findIndex(amenity => amenity.packageCode === packageCode);
      this.slides[index].selected = true;
      this.clearContainer();
    })
  }

  addAmenity(packageCode){
    let data;
    this._paidService.addAmenity(this._reservationService.reservationId,data)
    .subscribe(response =>{
     
    })
  }

  listenForServiceRemoval(){
    this.componentRef.instance.removeEvent.subscribe(packageCode => {
      //this.removeAmenity(amenityName);
    });
  }

  // removeAmenity(amenityName){
  //   const amenities = this.paidAmenityForm;
  //   amenities.removeControl(amenityName);
  // }

  getAminityForm(packageCode){
    return this.paidAmenitiesForm.get(packageCode) as FormGroup;
  }

  ngOnDestroy() {
    this.componentRef.destroy(); 
   }

  get hotelComplimentaryAmenities(){
    return this._paidService.paidAmenities && 
    this._paidService.paidAmenities.paidService;
  }

  get amenitiesForm(){
    return this.parentForm.get('amenities') as FormGroup; 
  }

  get paidAmenityForm(){
    return this.amenitiesForm.get('paidAmenities') as FormGroup;
  }
}
