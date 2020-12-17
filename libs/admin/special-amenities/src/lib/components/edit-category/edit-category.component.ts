import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { CategoryDetail } from '../../data-models/categoryConfig.model';
import { CategoriesService } from '../../services/category.service';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'hospitality-bot-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss']
})
export class EditCategoryComponent implements OnInit {

  file: File;
  categoryForm: FormGroup;
  fileUploadData = {
    fileSize : 3145728,
    fileType : ['png', 'jpg']
  }

  hotelCategory: CategoryDetail;
  categoryId: string;
  selectedPackage: string;
  globalQueries = [];
  subPackages = [];
  uploadStatus;
  hotelId;

  constructor(
    private _fb: FormBuilder,
    private _router: Router,
    private _activatedRoute: ActivatedRoute,
    private _snackbarService: SnackBarService,
    private _globalFilterService: GlobalFilterService,
    private _categoriesService: CategoriesService,
    private _packageService: PackageService
  ) { 
    this.initAddCategoryForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initAddCategoryForm(){
    this.categoryForm = this._fb.group({
      id:[''],
      name: ['',[Validators.required]],
      description: ['',[Validators.required]],
      imageUrl:['',[Validators.required]],
      packages:[''],
      active: ['']
    })
  }

  listenForGlobalFilters() {
    this._globalFilterService.globalFilter$.subscribe((data) => {
      //set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
     
      this.getHotelId(this.globalQueries);
      this.getCategoryId();
    });
  }

  getHotelId(globalQueries){
    globalQueries.forEach(element => {
      if(element.hasOwnProperty('hotelId')){
        this.hotelId = element.hotelId;
      }
    });
  }

  getCategoryId(){
    this._activatedRoute.params.subscribe(params =>{
      if(params['id']){
        this.categoryId = params['id'];
        this.getCategoryDetails(this.categoryId);
      }
    })
  }

  getCategoryDetails(categoryId){
    this._categoriesService.getCategoryDetails(this.hotelId, categoryId)
    .subscribe(response =>{
      this.hotelCategory = new CategoryDetail().deserialize(response);
      this.categoryForm.patchValue(this.hotelCategory.category);
      this.subPackages = this.hotelCategory.category.subpackages;
      this.selectedPackage = this.subPackages && this.subPackages.length >0 && this.subPackages[0].id;
    })
  }

  saveDetails(){
    if(this.categoryId){
     this.updateCategory();
    }else{
      this.addCategory();
    }
  }

  addCategory(){
    const status = this._categoriesService.validateCategoryDetailForm(
      this.categoryForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    let data = this._categoriesService.mapCategoryData(this.categoryForm.getRawValue());
    this._categoriesService.addCategory(this.hotelId, data)
    .subscribe(response =>{
      this.hotelCategory = new CategoryDetail().deserialize(response);
      this.categoryForm.patchValue(this.hotelCategory);
      this._snackbarService.openSnackBarAsText( 'Category added successfully',
      '',
      { panelClass: 'success' }
    );
      this._router.navigate(['/pages/package/category', this.hotelCategory.category.id]);
    },({error})=>{
      this._snackbarService.openSnackBarAsText(error.message);
    })
  }

  updateCategory(){
    const status = this._categoriesService.validateCategoryDetailForm(
      this.categoryForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }
    
    const data = this._categoriesService.mapCategoryData(this.categoryForm.getRawValue(), this.hotelCategory.category.id);
    this._categoriesService.updateCategory(this.hotelId, this.hotelCategory.category.id, data).subscribe(response =>{
      this._snackbarService.openSnackBarAsText( 'Category updated successfully',
        '',
        { panelClass: 'success' }
      );
      this._router.navigate(['/pages/package/category', this.hotelCategory.category.id]);
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
      this.categoryForm.get('imageUrl').patchValue(response.fileDownloadUri);
      this._snackbarService.openSnackBarAsText( 'Category image uploaded successfully',
        '',
        { panelClass: 'success' }
      );
      this.uploadStatus =   false;
    },({error})=>{
      this.uploadStatus =   false;
      this._snackbarService.openSnackBarAsText(error.message);
    })
  }

  private performActionIfNotValid(status: any[]) {
    this._snackbarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  get categoryImageUrl(){
    return this.categoryForm.get('imageUrl').value;
  }

}
