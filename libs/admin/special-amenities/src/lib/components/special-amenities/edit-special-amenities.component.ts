import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpecialAmenitiesService } from '../../services/special-amenities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageDetail } from '../../data-models/packageConfig.model'
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Regex } from 'libs/shared/constants/regex';

@Component({
  selector: 'hospitality-bot-edit-special-amenities',
  templateUrl: './edit-special-amenities.component.html',
  styleUrls: ['./edit-special-amenities.component.scss']
})
export class EditSpecialAmenitiesComponent implements OnInit {

  file: File;
  amenityForm: FormGroup;
  fileUploadData = {
    fileSize : 3145728,
    fileType : ['png', 'jpg']
  }

  currency =[
    {key:'INR', value:'INR'},
    {key:'USD', value:'USD'}
  ]

  packageType = [
    {key:'Complimentary', value:'Complimentary'},
    {key:'Paid', value:'Paid'}
  ]

  unit = [
    {key:'Km', value:'Km'},
    {key:'PERSON', value:'PERSON'},
    {key:'TRIP', value:'TRIP'}
  ]
  
  hotelPackage:PackageDetail;
  amenityId: string;
  globalQueries = [];
  uploadStatus;
  hotelId;
  
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _globalFilterService: GlobalFilterService,
    private _amenitiesService: SpecialAmenitiesService
  ) {
    this.initAddAmenityForm();
   }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initAddAmenityForm(){
    this.amenityForm = this._fb.group({
      id:[''],
      packageCode: ['',[Validators.required]],
      name: ['',[Validators.required]],
      description: ['',[Validators.required]],
      type: ['',[Validators.required]],
      rate: ['',[Validators.required,Validators.pattern(Regex.DECIMAL_REGEX)]],
      currency: ['',[Validators.required]],
      unit:['',[Validators.required]],
      packageSource:[''],
      imageUrl:['',[Validators.required]],
      status: ['',[Validators.required]],
      autoAccept:['',[Validators.required]]
    })
  }

  disableForm(packageData){
    if(packageData.packageSource === 'PMS'){
      this.amenityForm.disable();
      this.amenityForm.get('description').enable();
      this.amenityForm.get('name').enable();
    }else{
      this.amenityForm.get('packageCode').disable();
    }
  }

  enableEditableFields(){
    this.amenityForm.get('status').enable();
    this.amenityForm.get('rate').enable();
    
  }

  listenForGlobalFilters() {
    this._globalFilterService.globalFilter$.subscribe((data) => {
      //set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
     
      this.getHotelId(this.globalQueries);
      this.getAmenityId();
    });
  }

  getHotelId(globalQueries){
    globalQueries.forEach(element => {
      if(element.hasOwnProperty('hotelId')){
        this.hotelId = element.hotelId;
      }
    });
  }

  getAmenityId(){
    this._activatedRoute.params.subscribe(params =>{
      if(params['id']){
        this.amenityId = params['id'];
        this.getPackageDetails(this.amenityId);
      }
    })
  }

  getPackageDetails(amenityId){
    this._amenitiesService.getPackageDetails(this.hotelId, amenityId)
    .subscribe(response =>{
      this.hotelPackage = new PackageDetail().deserialize(response);
      this.amenityForm.patchValue(this.hotelPackage.amenityPackage);
      this.disableForm(this.amenityForm.getRawValue());
    })
  }

  saveDetails(){
    if(this.amenityId){
      this.updateAmenity();
    }else{
      this.addPackage();
    }
  }

  addPackage(){
    const status = this._amenitiesService.validateGuestDetailForm(
      this.amenityForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    let data = this._amenitiesService.mapAmenityData(this.amenityForm.getRawValue(), this.hotelId);
    this._amenitiesService.addPackage(this.hotelId, data)
    .subscribe(response =>{
      this.hotelPackage = new PackageDetail().deserialize(response);
      this.amenityForm.patchValue(this.hotelPackage.amenityPackage);
      this._snackbarService.openSnackBarAsText( 'Package added successfully',
      '',
      { panelClass: 'success' }
    );
      this._router.navigate(['/pages/package/amenity', this.hotelPackage.amenityPackage.id]);
    },({error})=>{
      this._snackbarService.openSnackBarAsText(error.message);
    })
  }

  uploadFile(event){
    let formData = new FormData();
    this.uploadStatus =   true;
    formData.append('files', event.file);
    this._amenitiesService.uploadAmenityImage(this.hotelId, formData)
    .subscribe(response =>{
      this.amenityForm.get('imageUrl').patchValue(response.fileDownloadUri);
      this._snackbarService.openSnackBarAsText( 'Package image uploaded successfully',
        '',
        { panelClass: 'success' }
      );
      this.uploadStatus =   false;
    },({error})=>{
      this.uploadStatus =   false;
      this._snackbarService.openSnackBarAsText(error.message);
    })
  }

  updateAmenity(){
    const status = this._amenitiesService.validateGuestDetailForm(
      this.amenityForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }
    
    const data = this._amenitiesService.mapAmenityData(this.amenityForm.getRawValue(),this.hotelId, this.hotelPackage.amenityPackage.id);
    this._amenitiesService.updateAmenity(this.hotelId, this.hotelPackage.amenityPackage.id, data).subscribe(response =>{
      this._snackbarService.openSnackBarAsText( 'Package updated successfully',
        '',
        { panelClass: 'success' }
      );
      this._router.navigate(['/pages/package/amenity', this.hotelPackage.amenityPackage.id]);
    },({error})=>{
      this._snackbarService.openSnackBarAsText(error.message);
    })
  }

  private performActionIfNotValid(status: any[]) {
    this._snackbarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  get amenityImageUrl(){
    return this.amenityForm.get('imageUrl').value;
  }

}
