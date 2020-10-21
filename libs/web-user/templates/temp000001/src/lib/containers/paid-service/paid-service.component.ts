import {
  Component,
  OnInit,
  ComponentFactoryResolver,
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
import { MatDialogConfig, MatDialog } from '@angular/material/dialog';
import { ConfirmationPopupComponent } from 'libs/web-user/shared/src/lib/presentational/confirmation-popup/confirmation-popup.component';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { DefaultAmenityComponent } from '../default-amenity/default-amenity.component';

const componentMapping = {
  'AIRPORT P/UP': AirportPickupComponent,
  'BF': BreakfastComponent,
  'DNI': BreakfastComponent,
  'SPA': SpaComponent,
};

@Component({
  selector: 'hospitality-bot-paid-service',
  templateUrl: './paid-service.component.html',
  styleUrls: ['./paid-service.component.scss'],
})
export class PaidServiceComponent implements OnInit, OnDestroy, OnChanges {
 
  @ViewChild("serviceMetadata", { read: ViewContainerRef }) serviceContainer;

  @Input() parentForm: FormGroup;
 
  slides;
  componentRef;
  selectedService = '';
  dialogRef;

  paidAmenitiesForm: FormGroup;

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

  constructor(
    public dialog: MatDialog,
    private _fb: FormBuilder,
    private _paidService: PaidService,
    private _reservationService: ReservationService,
    private _snackbarService: SnackBarService,
    private _resolver: ComponentFactoryResolver,
    private _buttonService: ButtonService
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
      this.getAminityForm(slide.packageCode).patchValue(slide);
    });
  }

  getAmenitiesFG(){
    return this._fb.group({
      id: [''],
      rate:[''],
      currencyCode:[''],
      packageCode:[''],
      imgUrl: [''],
      label: [''],
      quantity: [''],
      isSelected: [''],
    })
  }

  servicePackage(slideData){
    this.selectedService = slideData.packageCode;
    let component = componentMapping[slideData.packageCode];
    if(component === undefined){
      component = DefaultAmenityComponent;
    }
    this.createComponent(component, slideData);
  }

  createComponent(component, slideData) {
    this.clearContainer(); 
    const factory = this._resolver.resolveComponentFactory(component);
    this.componentRef = this.serviceContainer.createComponent(factory);
    this.listenForServiceAddition();
    this.listenForServiceRemoval();
    this.addPropsToComponentInstance(slideData);
  }

  addPropsToComponentInstance(slideData){
    this.componentRef.instance.paidAmenitiesForm = this.paidAmenityForm.get(slideData.packageCode) as FormGroup;
    this.componentRef.instance.uniqueData = {code:slideData.packageCode, id:slideData.id};
    this.componentRef.instance.amenityData = this.getAminityData(slideData.packageCode);
    this.componentRef.instance.quantity = slideData.quantity;
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

  clearContainer() {
    this.serviceContainer.clear();
  }

  listenForComponentRender(){
    this._paidService.isComponentRendered$.subscribe(()=>{
      this.getAminityForm(this._paidService.uniqueData.code).addControl('metaData', this._paidService.amenityForm);
    })
  }

  listenForServiceAddition(){
    this.componentRef && 
    this.componentRef.instance.addEvent &&
    this.componentRef.instance.addEvent.subscribe(packageCode => {
      // if(this.paidAmenitiesForm.get(packageCode).get('metaData')){
      //   this.getAminityForm(packageCode).get('metaData').patchValue(this._paidService.amenityData);
      // }
      this.addAmenity(packageCode);
    })
  }

  addAmenity(packageCode){
    let amenityId = this.getAminityForm(packageCode).get('id').value;
    let data = this._paidService.mapDataForAminity(this._paidService.amenityData, amenityId);
    this._paidService.addAmenity(this._reservationService.reservationId, data)
    .subscribe(response =>{
      this._paidService.updateAmenitiesDS(response);
      this.clearContainer();
      this.selectedService ='';
      this._snackbarService.openSnackBarAsText('Amenity added successfully', '', {
        panelClass: 'success',
      });
      this._buttonService.buttonLoading$.next(this.componentRef.instance.saveButton);
    },
    (error) => {
      this._snackbarService.openSnackBarAsText('Some error occured');
      this._buttonService.buttonLoading$.next(this.componentRef.instance.saveButton);
    })
  }

  openDialog(aminityId, packageCode) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialogRef = this.dialog.open(ConfirmationPopupComponent, dialogConfig);

    this.dialogRef.componentInstance.onSubmitEvent.subscribe(() =>{
      this.removeAmenity(aminityId, packageCode);
    })
  }

  listenForServiceRemoval(){
    this.componentRef.instance.removeEvent.subscribe((uniqueData) => {
      this.openDialog(uniqueData.amenityId, uniqueData.packageCode);
    });
  }

  removeAmenity(aminityId, packageCode){
    this._paidService.removeAmenity(this._reservationService.reservationId, aminityId)
    .subscribe(response =>{
      this._paidService.updateAmenitiesDS(response);
      this.clearContainer();
      this.selectedService ='';
      this._snackbarService.openSnackBarAsText('Amenity removed successfully', '', {
        panelClass: 'success',
      });
      this.dialogRef.close()
      this.getAminityForm(packageCode).removeControl('metaData');
    },
    (error) => {
      this._snackbarService.openSnackBarAsText('Some error occured');
      this.dialogRef.close()
    })
  }

  getAminityForm(packageCode){
    return this.paidAmenitiesForm.get(packageCode) as FormGroup;
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

  get amenitiesForm(){
    return this.parentForm.get('amenities') as FormGroup; 
  }

  get paidAmenityForm(){
    return this.amenitiesForm.get('paidAmenities') as FormGroup;
  }
}
