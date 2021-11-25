import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import {
  CategoryDetail,
  IPackage,
} from '../../data-models/categoryConfig.model';
import { Package } from '../../data-models/packageConfig.model';
import { CategoriesService } from '../../services/category.service';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'hospitality-bot-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit {
  private $subscription: Subscription = new Subscription();

  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };

  categoryForm: FormGroup;
  hotelCategory: CategoryDetail;
  categoryId: string;
  hotelId: string;
  isSavingCategory = false;
  subPackages: IPackage[];
  globalQueries = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private categoriesService: CategoriesService,
    private packageService: PackageService
  ) {
    this.initAddCategoryForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initAddCategoryForm(): void {
    this.categoryForm = this.fb.group({
      id: [''],
      packageCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imageUrl: ['', [Validators.required]],
      imageName: [''],
      packages: [''],
      active: [''],
    });
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];

        this.getHotelId(this.globalQueries);
        this.getCategoryId();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getCategoryId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.categoryId = params['id'];
          this.getCategoryDetails(this.categoryId);
        }
      })
    );
  }

  getCategoryDetails(categoryId): void {
    this.$subscription.add(
      this.categoriesService
        .getCategoryDetails(this.hotelId, categoryId)
        .subscribe((response) => {
          this.hotelCategory = new CategoryDetail().deserialize(response);
          this.categoryForm.patchValue(this.hotelCategory.category);
          this.subPackages = this.hotelCategory.category.subpackages;
          this.categoryForm
            .get('packages')
            .patchValue(
              this.subPackages &&
                this.subPackages.length > 0 &&
                this.subPackages[0].id
            );
        })
    );
  }

  saveDetails(): void {
    if (this.categoryId) {
      this.updateCategory();
    } else {
      this.addCategory();
    }
  }

  addCategory(): void {
    const status = this.categoriesService.validateCategoryDetailForm(
      this.categoryForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }
    this.isSavingCategory = true;
    let data = this.categoriesService.mapCategoryData(
      this.categoryForm.getRawValue()
    );
    this.$subscription.add(
      this.categoriesService.addCategory(this.hotelId, data).subscribe(
        (response) => {
          this.hotelCategory = new CategoryDetail().deserialize(response);
          this.categoryForm.patchValue(this.hotelCategory);
          this.snackbarService.openSnackBarAsText(
            'Category added successfully',
            '',
            { panelClass: 'success' }
          );
          this.router.navigate([
            '/pages/package/category',
            this.hotelCategory.category.id,
          ]);
          this.isSavingCategory = false;
        },
        ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
          this.isSavingCategory = false;
        }
      )
    );
  }

  updateCategory(): void {
    const status = this.categoriesService.validateCategoryDetailForm(
      this.categoryForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    this.isSavingCategory = true;
    const data = this.categoriesService.mapCategoryData(
      this.categoryForm.getRawValue(),
      this.hotelCategory.category.id
    );
    this.$subscription.add(
      this.categoriesService
        .updateCategory(this.hotelId, this.hotelCategory.category.id, data)
        .subscribe(
          (response) => {
            this.snackbarService.openSnackBarAsText(
              'Category updated successfully',
              '',
              { panelClass: 'success' }
            );
            this.router.navigate([
              '/pages/package/category',
              this.hotelCategory.category.id,
            ]);
            this.isSavingCategory = false;
          },
          ({ error }) => {
            this.snackbarService.openSnackBarAsText(error.message);
            this.isSavingCategory = false;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  uploadFile(event): void {
    let formData = new FormData();
    formData.append('files', event.file);
    this.$subscription.add(
      this.packageService.uploadImage(this.hotelId, formData).subscribe(
        (response) => {
          this.categoryForm
            .get('imageUrl')
            .patchValue(response.fileDownloadUri);
          this.categoryForm.get('imageName').patchValue(response.fileName);
          this.snackbarService.openSnackBarAsText(
            'Category image uploaded successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  redirectToCategories() {
    this.router.navigate(['/pages/package/']);
  }

  private performActionIfNotValid(status: any[]): any[] {
    this.snackbarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  get categoryImageUrl(): string {
    return this.categoryForm.get('imageUrl').value;
  }
}
