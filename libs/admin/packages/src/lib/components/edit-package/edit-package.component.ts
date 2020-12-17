import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PackageService } from '../../services/package.service';
import { ActivatedRoute, Router } from '@angular/router';
import { PackageDetail } from '../../data-models/packageConfig.model'
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Regex } from 'libs/shared/constants/regex';
import { Category } from '../../data-models/categoryConfig.model';

@Component({
  selector: 'hospitality-bot-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {

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
  
  hotelPackage: PackageDetail;
  selectedCategory: string;
  categories : Category[];
  packageId: string;
  globalQueries = [];
  uploadStatus;
  hotelId;
  
  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _globalFilterService: GlobalFilterService,
    private _packageService: PackageService,
  ) {
    this.initAddPackageForm();
   }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initAddPackageForm(){
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
      status: [false],
      autoAccept:[false],
      category: ['',[Validators.required]],
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
      this.getCategoriesList(this.hotelId);
      this.getPackageId();
    });
  }

  getHotelId(globalQueries){
    globalQueries.forEach(element => {
      if(element.hasOwnProperty('hotelId')){
        this.hotelId = element.hotelId;
      }
    });
  }

  getPackageId(){
    this._activatedRoute.params.subscribe(params =>{
      if(params['id']){
        this.packageId = params['id'];
        this.getPackageDetails(this.packageId);
      }
    })
  }

  getPackageDetails(packageId){
    this._packageService.getPackageDetails(this.hotelId, packageId)
    .subscribe(response =>{
      this.hotelPackage = new PackageDetail().deserialize(response);
      this.amenityForm.patchValue(this.hotelPackage.amenityPackage);
      this.disableForm(this.amenityForm.getRawValue());
    })
  }

  getCategoriesList(hotelId){
    this._packageService.getHotelPackageCategories(hotelId)
    .subscribe(response =>{
      this.categories = response.records;
      this.selectedCategory = response.records[0].id;
    })
  }

  saveDetails(){
    if(this.packageId){
      this.updatePackage();
    }else{
      this.addPackage();
    }
  }

  addPackage(){
    const status = this._packageService.validatePackageDetailForm(
      this.amenityForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    let data = this._packageService.mapPackageData(this.amenityForm.getRawValue(), this.hotelId);
    this._packageService.addPackage(this.hotelId, data)
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
    this._packageService.uploadImage(this.hotelId, formData)
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

  updatePackage(){
    const status = this._packageService.validatePackageDetailForm(
      this.amenityForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }
    
    const data = this._packageService.mapPackageData(this.amenityForm.getRawValue(),this.hotelId, this.hotelPackage.amenityPackage.id);
    this._packageService.updatePackage(this.hotelId, this.hotelPackage.amenityPackage.id, data).subscribe(response =>{
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

  get packageImageUrl(){
    return this.amenityForm.get('imageUrl').value;
  }

}
