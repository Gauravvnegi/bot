import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Regex } from '@hospitality-bot/admin/shared';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { Category } from '../../data-models/categoryConfig.model';
import {
  IpackageOptions,
  PackageDetail,
  PackageSource,
} from '../../data-models/packageConfig.model';
import { PackageService } from '../../services/package.service';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { FileUploadType } from 'libs/admin/shared/src/lib/models/file-upload-type.model';

@Component({
  selector: 'hospitality-bot-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss'],
})
export class EditPackageComponent implements OnInit, OnDestroy {
  @Input() id: string;

  private $subscription: Subscription = new Subscription();
  currency: IpackageOptions[];
  fileUploadType = FileUploadType;
  pathToUploadFile = 'static-content/packages';

  packageType: IpackageOptions[] = [
    { key: 'Complimentary', value: 'Complimentary' },
    { key: 'Paid', value: 'Paid' },
  ];

  unit: IpackageOptions[] = [
    { key: 'Km', value: 'Km' },
    { key: 'PERSON', value: 'PERSON' },
    { key: 'TRIP', value: 'TRIP' },
  ];

  packageForm: FormGroup;
  hotelPackage: PackageDetail;
  categories: Category[];
  packageId: string;
  entityId: string;
  isSavingPackage = false;
  globalQueries = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private packageService: PackageService,
    private _location: Location,
    private configService: ConfigService
  ) {
    this.initAddPackageForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initAddPackageForm(): void {
    this.packageForm = this.fb.group({
      id: [''],
      packageCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      type: ['', [Validators.required]],
      rate: [
        '',
        [Validators.required, Validators.pattern(Regex.DECIMAL_REGEX)],
      ],
      currency: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      packageSource: [''],
      imageUrl: ['', [Validators.required]],
      imageName: [''],
      status: [false],
      autoAccept: [false],
      category: ['', [Validators.required]],
    });

    this.packageForm.controls['type'].valueChanges.subscribe((res) => {
      this.removeValidations(res);
    });
  }

  disableForm(packageData): void {
    if (packageData.packageSource === PackageSource.Pms) {
      this.packageForm.disable();
      this.packageForm.get('description').enable();
      this.packageForm.get('name').enable();
    } else {
      this.packageForm.get('packageCode').disable();
    }
  }

  enableEditableFields(): void {
    this.packageForm.get('status').enable();
    this.packageForm.get('rate').enable();
  }

  removeValidations(packageType: string) {
    const currencyControl = this.packageForm.controls['currency'];
    const rateControl = this.packageForm.controls['rate'];
    if (packageType == 'Complimentary') {
      currencyControl.clearValidators();
      currencyControl.updateValueAndValidity();
      rateControl.clearValidators();
      rateControl.updateValueAndValidity();
    } else {
      currencyControl.setValidators([Validators.required]);
      currencyControl.updateValueAndValidity();
      rateControl.setValidators([
        Validators.required,
        Validators.pattern(Regex.DECIMAL_REGEX),
      ]);
      rateControl.updateValueAndValidity();
    }
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

        this.entityId = this.globalFilterService.entityId;
        this.getConfig();
        this.getCategoriesList(this.entityId);
        this.getPackageId();
      })
    );
  }

  getPackageId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.packageId = params['id'];
          this.getPackageDetails(this.packageId);
        } else if (this.id) {
          this.packageId = this.id;
          this.getPackageDetails(this.packageId);
        }
      })
    );
  }

  getPackageDetails(packageId: string): void {
    this.$subscription.add(
      this.packageService
        .getPackageDetails(this.entityId, packageId)
        .subscribe((response) => {
          this.hotelPackage = new PackageDetail().deserialize(response);
          this.packageForm.patchValue(this.hotelPackage.amenityPackage);
          this.disableForm(this.packageForm.getRawValue());
        })
    );
  }

  getCategoriesList(entityId: string): void {
    this.$subscription.add(
      this.packageService
        .getHotelPackageCategories(entityId)
        .subscribe((response) => {
          this.categories = response.records;
          this.packageForm
            .get('category')
            .patchValue(
              (this.hotelPackage &&
                this.hotelPackage.amenityPackage.category) ||
                response.records[0].id
            );
        })
    );
  }

  getConfig() {
    this.configService.$config.subscribe((response) => {
      if (response) this.setCurrencyOptions(response.currencyConfiguration);
      else this.getConfigByentityId();
    });
  }

  getConfigByentityId() {
    this.configService
      .getColorAndIconConfig(this.entityId)
      .subscribe((response) => {
        this.setCurrencyOptions(response.currencyConfiguration);
      });
  }

  setCurrencyOptions(data) {
    this.currency = new Array<IpackageOptions>();
    data.forEach((d) => this.currency.push({ key: d.key, value: d.value }));
  }

  saveDetails(): void {
    if (this.packageId) {
      this.updatePackage();
    } else {
      this.addPackage();
    }
  }

  addPackage(): void {
    const status = this.packageService.validatePackageDetailForm(
      this.packageForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    this.isSavingPackage = true;
    const data = this.packageService.mapPackageData(
      this.packageForm.getRawValue(),
      this.entityId
    );
    this.$subscription.add(
      this.packageService.addPackage(this.entityId, data).subscribe(
        (response) => {
          this.hotelPackage = new PackageDetail().deserialize(response);
          this.packageForm.patchValue(this.hotelPackage.amenityPackage);
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'messages.SUCCESS.PACKAGE_ADDED',
                priorityMessage: 'Package added successfully.',
              },
              '',
              { panelClass: 'success' }
            )
            .subscribe();
          this.router.navigate([
            '/pages/library/packages/edit',
            this.hotelPackage.amenityPackage.id,
          ]);
          this.isSavingPackage = false;
        },
        ({ error }) => { 
          this.isSavingPackage = false;
        }
      )
    );
  }

  redirectToPackages() {
    this.router.navigate(['/pages/library/packages']);
  }

  updatePackage(): void {
    const status = this.packageService.validatePackageDetailForm(
      this.packageForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }
    this.isSavingPackage = true;
    const data = this.packageService.mapPackageData(
      this.packageForm.getRawValue(),
      this.entityId,
      this.hotelPackage.amenityPackage.id
    );
    this.$subscription.add(
      this.packageService
        .updatePackage(this.entityId, this.hotelPackage.amenityPackage.id, data)
        .subscribe(
          (response) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.SUCCESS.PACKAGE_UPDATED',
                  priorityMessage: 'Package updated successfully.',
                },
                '',
                { panelClass: 'success' }
              )
              .subscribe();
            this.router.navigate([
              '/pages/library/packages/edit',
              this.hotelPackage.amenityPackage.id,
            ]);
            this.isSavingPackage = false;
          },
          ({ error }) => { 
            this.isSavingPackage = false;
          }
        )
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  private performActionIfNotValid(status: any[]): any[] {
    this.snackbarService.openSnackBarAsText(status[0]['msg']);
    return;
  }

  get packageImageUrl(): string {
    return this.packageForm.get('imageUrl').value;
  }
}
