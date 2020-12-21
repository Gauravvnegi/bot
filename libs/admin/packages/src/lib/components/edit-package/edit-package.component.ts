import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Regex } from 'libs/shared/constants/regex';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { Category } from '../../data-models/categoryConfig.model';
import { PackageDetail } from '../../data-models/packageConfig.model';
import { PackageService } from '../../services/package.service';

@Component({
  selector: 'hospitality-bot-edit-package',
  templateUrl: './edit-package.component.html',
  styleUrls: ['./edit-package.component.scss']
})
export class EditPackageComponent implements OnInit {

  private $subscription: Subscription = new Subscription();

  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg']
  }

  currency = [
    { key: 'INR', value: 'INR' },
    { key: 'USD', value: 'USD' }
  ]

  packageType = [
    { key: 'Complimentary', value: 'Complimentary' },
    { key: 'Paid', value: 'Paid' }
  ]

  unit = [
    { key: 'Km', value: 'Km' },
    { key: 'PERSON', value: 'PERSON' },
    { key: 'TRIP', value: 'TRIP' }
  ]

  file: File;
  amenityForm: FormGroup;
  hotelPackage: PackageDetail;
  selectedCategory: string;
  categories: Category[];
  packageId: string;
  hotelId: string;
  globalQueries = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService,
    private packageService: PackageService,
  ) {
    this.initAddPackageForm();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initAddPackageForm(): void {
    this.amenityForm = this.fb.group({
      id: [''],
      packageCode: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      type: ['', [Validators.required]],
      rate: ['', [Validators.required, Validators.pattern(Regex.DECIMAL_REGEX)]],
      currency: ['', [Validators.required]],
      unit: ['', [Validators.required]],
      packageSource: [''],
      imageUrl: ['', [Validators.required]],
      status: [false],
      autoAccept: [false],
      category: ['', [Validators.required]],
    })
  }

  disableForm(packageData): void {
    if (packageData.packageSource === 'PMS') {
      this.amenityForm.disable();
      this.amenityForm.get('description').enable();
      this.amenityForm.get('name').enable();
    } else {
      this.amenityForm.get('packageCode').disable();
    }
  }

  enableEditableFields(): void {
    this.amenityForm.get('status').enable();
    this.amenityForm.get('rate').enable();
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
        this.getCategoriesList(this.hotelId);
        this.getPackageId();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach(element => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  getPackageId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe(params => {
        if (params['id']) {
          this.packageId = params['id'];
          this.getPackageDetails(this.packageId);
        }
      })
    );
  }

  getPackageDetails(packageId: string): void {
    this.$subscription.add(
      this.packageService.getPackageDetails(this.hotelId, packageId)
        .subscribe(response => {
          this.hotelPackage = new PackageDetail().deserialize(response);
          this.amenityForm.patchValue(this.hotelPackage.amenityPackage);
          this.disableForm(this.amenityForm.getRawValue());
        })
    );
  }

  getCategoriesList(hotelId: string): void {
    this.$subscription.add(
      this.packageService.getHotelPackageCategories(hotelId)
        .subscribe(response => {
          this.categories = response.records;
          this.selectedCategory = this.hotelPackage.amenityPackage.category || response.records[0].id;
        })
    );
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
      this.amenityForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    let data = this.packageService.mapPackageData(this.amenityForm.getRawValue(), this.hotelId);
    this.$subscription.add(
      this.packageService.addPackage(this.hotelId, data)
        .subscribe(response => {
          this.hotelPackage = new PackageDetail().deserialize(response);
          this.amenityForm.patchValue(this.hotelPackage.amenityPackage);
          this.snackbarService.openSnackBarAsText('Package added successfully',
            '',
            { panelClass: 'success' }
          );
          this.router.navigate(['/pages/package/amenity', this.hotelPackage.amenityPackage.id]);
        }, ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        })
    );
  }

  redirectToPackages(){
    this.router.navigate(['/pages/package']);
  }

  uploadFile(event): void {
    let formData = new FormData();
    formData.append('files', event.file);
    this.$subscription.add(
      this.packageService.uploadImage(this.hotelId, formData)
        .subscribe(response => {
          this.amenityForm.get('imageUrl').patchValue(response.fileDownloadUri);
          this.snackbarService.openSnackBarAsText('Package image uploaded successfully',
            '',
            { panelClass: 'success' }
          );
        }, ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        })
    );
  }

  updatePackage(): void {
    const status = this.packageService.validatePackageDetailForm(
      this.amenityForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      return;
    }

    const data = this.packageService.mapPackageData(this.amenityForm.getRawValue(), this.hotelId, this.hotelPackage.amenityPackage.id);
    this.$subscription.add(
      this.packageService.updatePackage(this.hotelId, this.hotelPackage.amenityPackage.id, data)
        .subscribe(response => {
          this.snackbarService.openSnackBarAsText('Package updated successfully',
            '',
            { panelClass: 'success' }
          );
          this.router.navigate(['/pages/package/amenity', this.hotelPackage.amenityPackage.id]);
        }, ({ error }) => {
          this.snackbarService.openSnackBarAsText(error.message);
        })
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
    return this.amenityForm.get('imageUrl').value;
  }

}
