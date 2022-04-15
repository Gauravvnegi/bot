import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { Location } from '@angular/common';
import { AssetDetail, AssetSource } from '../../data-models/assetConfig.model';
import { AssetService } from '../assets/services/asset.service';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'hospitality-bot-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss'],
})
export class CreateAssetsComponent implements OnInit {
  @Input() id: string;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };

  assetForm: FormGroup;
  isSavingasset = false;
  // assetService: any;
  // assetForm: any;
  private $subscription: Subscription = new Subscription();
  hotelasset: AssetDetail;
  hotelId: any;
  globalQueries = [];
  assetId: string;
  disableForm: any;

  constructor(
    private _location: Location,
    private _fb: FormBuilder,
    private _snakbarService: SnackBarService,
    private assetService: AssetService,

    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.initFg();
    this.listenForGlobalFilters();
  }

  initFg(): void {
    this.assetForm = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(Regex.NAME)]],
      type: ['', [Validators.required]],
      description: [''],
      url: ['', [Validators.required]],

      active: [false, [Validators.required]],
    });
  }

  /**
   * create topic and checking validaton
   */

  createAsset() {
    if (this.assetForm.invalid) {
      this._snakbarService.openSnackBarAsText('Invalid form.');
      return;
    }
    const data = this.assetForm.getRawValue();
    //api call with data
    console.log(data);
    this.addasset();
  }

  /**
   *
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];

        this.getHotelId(this.globalQueries);
        // this.getConfig();
        // this.getCategoriesList(this.hotelId);
        this.getAssetId();
      })
    );
  }

  /**
   *
   * @param globalQueries
   * @returns get hotel id
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   *adding new record in asset datatable
   */
  addasset(): void {
    this.isSavingasset = true;
    let data = this.assetService.mapAssetData(
      this.assetForm.getRawValue(),
      this.hotelId
    );
    this.$subscription.add(
      this.assetService.addasset(this.hotelId, data).subscribe(
        (response) => {
          this.hotelasset = new AssetDetail().deserialize(response);
          this.assetForm.patchValue(this.hotelasset.amenityasset);
          this._snakbarService.openSnackBarAsText(
            'asset added successfully',
            '',
            { panelClass: 'success' }
          );

          this.isSavingasset = false;
        },
        ({ error }) => {
          this._snakbarService.openSnackBarAsText(error.message);
          this.isSavingasset = false;
        }
      )
    );
  }

  /**
   * redirecting to asset datatable from create asset
   */
  redirectToAssets() {
    this._location.back();
  }

  /**
   *
   * @param event
   * upload image
   */
  uploadAssetFile(event): void {
    debugger;
    let formData = new FormData();
    formData.append('files', event.file);
    this.$subscription.add(
      this.assetService.uploadImage(this.hotelId, formData).subscribe(
        (response) => {
          debugger;
          this.assetForm.get('url').patchValue(response.fileDownloadUri);
          this._snakbarService.openSnackBarAsText(
            'Asset image uploaded successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this._snakbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  /**
   * editing the existing records
   */
  updateAsset(): void {
    // const status = this.assetService.validatePackageDetailForm(
    //   this.assetForm
    // ) as Array<any>;

    // if (status.length) {
    //   this.performActionIfNotValid(status);
    //   return;
    // }
    this.isSavingasset = true;
    const data = this.assetService.mapAssetData(
      this.assetForm.getRawValue(),
      this.hotelId,
      this.hotelasset.amenityasset.id
    );
    this.$subscription.add(
      this.assetService
        .updateAsset(this.hotelId, this.hotelasset.amenityasset.id, data)
        .subscribe(
          (response) => {
            this._snakbarService.openSnackBarAsText(
              'Asset updated successfully',
              '',
              { panelClass: 'success' }
            );
            // this.router.navigate([
            //   '/pages/package/edit',
            //   this.hotelasset.amenityasset.id,
            // ]);
            this.isSavingasset = false;
          },
          ({ error }) => {
            this._snakbarService.openSnackBarAsText(error.message);
            this.isSavingasset = false;
          }
        )
    );
  }

  // disableForm(assetData): void {
  //   if (assetData.assetSource === AssetSource.Pms) {
  //     this.assetForm.disable();
  //     this.assetForm.get('description').enable();
  //     this.assetForm.get('name').enable();
  //   } else {
  //     this.assetForm.get('packageCode').disable();
  //   }
  // }

  /**
   * getting asset id
   */
  getAssetId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.assetId = params['id'];
          this.getAssetDetails(this.assetId);
        } else if (this.id) {
          this.assetId = this.id;
          this.getAssetDetails(this.assetId);
        }
      })
    );
  }

  /**
   *
   * @param packageId
   * getting asset details to patch value
   */
  getAssetDetails(assetId: string): void {
    this.$subscription.add(
      this.assetService
        .getAssetDetails(this.hotelId, assetId)
        .subscribe((response) => {
          this.hotelasset = new AssetDetail().deserialize(response);
          this.assetForm.patchValue(this.hotelasset.amenityasset);
          // this.disableForm(this.assetForm.getRawValue());
        })
    );
  }

  /**
   * getting image url
   */
  get assetImageUrl(): string {
    return this.assetForm.get('imageUrl').value;
  }
}
