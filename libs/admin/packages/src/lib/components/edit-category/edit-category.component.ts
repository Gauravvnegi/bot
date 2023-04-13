import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FileUploadType } from 'libs/admin/shared/src/lib/models/file-upload-type.model';

@Component({
  selector: 'hospitality-bot-edit-category',
  templateUrl: './edit-category.component.html',
  styleUrls: ['./edit-category.component.scss'],
})
export class EditCategoryComponent implements OnInit, OnDestroy {
  private $subscription: Subscription = new Subscription();
  categoryForm: FormGroup;
  hotelCategory: CategoryDetail;
  categoryId: string;
  hotelId: string;
  isSavingCategory = false;
  subPackages: IPackage[];
  globalQueries = [];

  fileUploadType = FileUploadType;
  pathToUploadFile = 'static-content/packages';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private categoriesService: CategoriesService
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];

        this.hotelId = this.globalFilterService.hotelId;
        this.getCategoryId();
      })
    );
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
    const data = this.categoriesService.mapCategoryData(
      this.categoryForm.getRawValue()
    );
    this.$subscription.add(
      this.categoriesService.addCategory(this.hotelId, data).subscribe(
        (response) => {
          this.hotelCategory = new CategoryDetail().deserialize(response);
          this.categoryForm.patchValue(this.hotelCategory);
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.CATEGORY_ADDED',
                priorityMessage: 'Category added successfully.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
          this.router.navigate([
            '/pages/library/packages/category',
            this.hotelCategory.category.id,
          ]);
          this.isSavingCategory = false;
        },
        ({ error }) => { 
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
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.SUCCESS.CATEGORY_UPDATED',
                  priorityMessage: 'Category updated successfully.',
                },
                '',
                { panelClass: 'success' }
              )
              .subscribe();
            this.router.navigate([
              '/pages/library/packages/category',
              this.hotelCategory.category.id,
            ]);
            this.isSavingCategory = false;
          },
          ({ error }) => { 
            this.isSavingCategory = false;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  redirectToCategories() {
    this.router.navigate(['/pages/library/packages/']);
  }

  private performActionIfNotValid(status: any[]): any[] {
    this.snackbarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  get categoryImageUrl(): string {
    return this.categoryForm.get('imageUrl').value;
  }
}
