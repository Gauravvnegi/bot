import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SpecialAmenitiesService } from '../../services/special-amenities.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageDetail } from '../../data-models/packageCnfig.model'
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'hospitality-bot-edit-special-amenities',
  templateUrl: './edit-special-amenities.component.html',
  styleUrls: ['./edit-special-amenities.component.scss']
})
export class EditSpecialAmenitiesComponent implements OnInit {

  file: File;
  amenityForm: FormGroup;
  fileSize: number = 3145728;
  fileType = ['png', 'jpg'];
  hotelPackage:PackageDetail;
  hotelId: string = 'ca60640a-9620-4f60-9195-70cc18304edd';
  amenityId: string;
  uploadStatus;
  
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _amenitiesService: SpecialAmenitiesService
  ) {
    this.initAddAmenityForm();
   }

  ngOnInit(): void {
    this.getAmenityId();
    this.disableForm();
  }

  initAddAmenityForm(){
    this.amenityForm = this._fb.group({
      name: [''],
      description: [''],
      packageCode: [''],
      type: [''],
      rate: [''],
      imageUrl:['',[Validators.required]],
      status: [false]
    })
  }

  disableForm(){
    this.amenityForm.disable();
    this.amenityForm.get('status').enable();
  }

  getAmenityId(){
    this._activatedRoute.params.subscribe(params =>{
      this.amenityId = params['id'];
      this.getPackageDetails(this.amenityId);
    })
  }

  getPackageDetails(amenityId){
    this._amenitiesService.getPackageDetails(this.hotelId, amenityId)
    .subscribe(response =>{
      this.hotelPackage = new PackageDetail().deserialize(response);
      this.amenityForm.patchValue(this.hotelPackage.amenityPackage);
    })
  }

  uploadFile(event){
    let formData = new FormData();
    this.uploadStatus =   true;
    formData.append('file', event.file);
    this._amenitiesService.uploadAmenityImage(this.hotelId, this.hotelPackage.amenityPackage.packageCode, formData)
    .subscribe(response =>{
      this.amenityForm.get('imageUrl').patchValue(response.fileDownloadUri);
      this.uploadStatus =   false;
    },(error)=>{
      this.uploadStatus =   false;
    })
  }

  updateAmenity(){
    if(!this.amenityForm.valid){
      this._snackbarService.openSnackBarAsText('Please upload package Image');
      return;
    }
    const data = this._amenitiesService.mapAmenityData(this.amenityForm.getRawValue(),this.hotelId, this.hotelPackage.amenityPackage.id);
    this._amenitiesService.updateAmenity(this.hotelId, data).subscribe(response =>{
      this._snackbarService.openSnackBarAsText( 'Amenity uploaded successfully',
        '',
        { panelClass: 'success' }
      );
      this._router.navigate(['/pages/package'])
    },(error)=>{
      this._snackbarService.openSnackBarAsText('some error occured');
    })
  }

  get amenityImageUrl(){
    return this.amenityForm.get('imageUrl').value
  }

}
