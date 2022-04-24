import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { forkJoin, Subscription } from 'rxjs';
import { Asset } from '../../data-models/assetConfig.model';
import { AssetService } from '../../services/asset.service';
@Component({
  selector: 'hospitality-bot-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.scss'],
})
export class EditAssetComponent implements OnInit {
  @Input() id: string;
  fileUploadData = {
    fileSize: 3145728,
    fileType: ['png', 'jpg', 'jpeg', 'gif', 'eps'],
  };

  assetForm: FormGroup;
  isSavingasset = false;

  private $subscription: Subscription = new Subscription();
  hotelasset: Asset;
  hotelId: any;
  globalQueries = [];
  assetId: string;

  constructor(
    private router: Router,
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
      name: ['', Validators.required],
      type: ['', [Validators.required]],
      description: ['', [Validators.required]],
      url: ['', [Validators.required]],
      status: [true, [Validators.required]],
      thumbnailUrl: [''],
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
    if (this.assetId) {
      this.updateAsset();
    } else {
      this.addAsset();
    }
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
          this.hotelasset = new Asset().deserialize(response);
          this.assetForm.patchValue(this.hotelasset);
          this.updateFileType(this.hotelasset.type);
        })
    );
  }

  /**
   *adding new record in asset datatable
   */
  addAsset(): void {
    this.isSavingasset = true;
    let data = this.assetService.mapAssetData(
      this.assetForm.getRawValue(),
      this.hotelId
    );
    this.$subscription.add(
      this.assetService.addasset(this.hotelId, data).subscribe(
        (response) => {
          this.hotelasset = new Asset().deserialize(response);
          this.assetForm.patchValue(this.hotelasset);
          this._snakbarService.openSnackBarAsText(
            'asset added successfully',
            '',
            { panelClass: 'success' }
          );
          this.router.navigate(['/pages/library/assets']);

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
   * @function uploadFile upload File for asset.
   */
  uploadFile(event): void {
    let formData = new FormData();
    formData.append('files', event.file);
    if (this.assetType === 'Video') {
      let thumbnailData = new FormData();
      thumbnailData.append('files', event.file);
      this.$subscription.add(
        forkJoin({
          videoFile: this.assetService.uploadImage(this.hotelId, formData),
          thumbnail: this.assetService.uploadImage(this.hotelId, thumbnailData),
        }).subscribe(
          (response) => {
            this._snakbarService.openSnackBarAsText(
              'Asset image uploaded successfully',
              '',

              { panelClass: 'success' }
            );
            this.assetForm.patchValue({
              url: response.videoFile.fileDownloadUri,
              thumbnailUrl: response.thumbnail.fileDownloadUri,
            });
          },
          ({ error }) => this._snakbarService.openSnackBarAsText(error.message)
        )
      );
    } else {
      this.$subscription.add(
        this.assetService.uploadImage(this.hotelId, formData).subscribe(
          (response) => {
            this.assetForm.get('url').patchValue(response.fileDownloadUri);
            this._snakbarService.openSnackBarAsText(
              'Asset image uploaded successfully',
              '',

              { panelClass: 'success' }
            );

            this.isSavingasset = false;
          },
          ({ error }) => {
            this._snakbarService.openSnackBarAsText(error.message);
          }
        )
      );
    }
  }

  /**
   * @function updateAsset Editing the existing records.
   */
  updateAsset(): void {
    this.isSavingasset = true;
    const data = this.assetService.mapAssetData(
      this.assetForm.getRawValue(),
      this.hotelId,
      this.hotelasset.id
    );
    this.$subscription.add(
      this.assetService
        .updateAsset(this.hotelId, data, this.hotelasset.id)
        .subscribe(
          (response) => {
            this._snakbarService.openSnackBarAsText(
              'Asset updated successfully',
              '',
              { panelClass: 'success' }
            );
            this.router.navigate(['/pages/library/assets']);

            this.isSavingasset = false;
          },
          ({ error }) => {
            this._snakbarService.openSnackBarAsText(error.message);
            this.isSavingasset = false;
          }
        )
    );
  }

  handleAssetTypeChanged(event) {
    this.updateFileType(event.value);
  }

  updateFileType(type: string): void {
    this.fileUploadData.fileType =
      type === 'Image'
        ? ['png', 'jpg', 'jpeg', 'gif', 'eps']
        : ['mp4', 'MPEG', 'MOV', 'AVI', 'MKV'];
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  /**
   * getter for image url
   */
  get assetImageUrl(): string {
    return this.assetForm?.get('url').value || '';
  }

  get thumbnailUrl() {
    return this.assetForm?.get('thumbnailUrl').value || '';
  }

  get assetType() {
    return this.assetForm?.get('type').value || 'Image';
  }
}
