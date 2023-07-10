import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { forkJoin, Subscription } from 'rxjs';
import { NavRouteOptions, Option } from 'libs/admin/shared/src';
import { Asset } from '../../data-models/assetConfig.model';
import { AssetService } from '../../services/asset.service';
import { TranslateService } from '@ngx-translate/core';
import { assetConfig } from '../../constants/asset';
import { FileUploadType } from 'libs/admin/shared/src/lib/models/file-upload-type.model';

@Component({
  selector: 'hospitality-bot-edit-asset',
  templateUrl: './edit-asset.component.html',
  styleUrls: ['./edit-asset.component.scss'],
})
export class EditAssetComponent implements OnInit, OnDestroy {
  @Input() id: string;
  fileUploadData = assetConfig.fileUploadData;
  entityId: string;
  assetForm: FormGroup;
  isSavingasset = false;
  private $subscription: Subscription = new Subscription();
  hotelasset: Asset;

  globalQueries = [];
  assetId: string;
  fileUploadType = FileUploadType;
  pathToUploadFile = 'static-content/assets';
  pageTitle = 'Create Asset';

  navRoutes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Assets', link: '/pages/library/assets' },
    { label: 'Create Asset', link: './' },
  ];

  fileType: Option[] = [
    { label: 'Image', value: 'Image' },
    { label: 'Video', value: 'Video' },
  ];

  constructor(
    private router: Router,
    private _location: Location,
    private _fb: FormBuilder,
    private snackbarService: SnackBarService,
    private assetService: AssetService,
    protected _translateService: TranslateService,
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
   * @function handleSubmit validating and handling form submission.
   */
  handleSubmit() {
    if (this.assetForm.invalid) {
      this.snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.validation.INVALID_FORM',
          priorityMessage: 'Invalid Form.',
        })
        .subscribe();
      return;
    }
    const data = this.assetForm.getRawValue();
    if (this.assetId) {
      this.updateAsset();
    } else {
      this.addAsset();
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

        this.getAssetId();
      })
    );
  }

  /**
   * @function getAssetId to get asset Id from routes query param.
   */
  getAssetId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.assetId = params['id'];
          this.getAssetDetails(this.assetId);
          this.pageTitle = 'Edit Asset';
          this.navRoutes[2].label = 'Edit Asset';
        } else if (this.id) {
          this.assetId = this.id;
          this.getAssetDetails(this.assetId);
        }
      })
    );
  }

  /**
   * @function getAssetDetails to get the asset details.
   *  @param assetId The asset id for which edit action will be done.
   */

  getAssetDetails(assetId: string): void {
    this.$subscription.add(
      this.assetService
        .getAssetDetails(this.entityId, assetId)
        .subscribe((response) => {
          this.hotelasset = new Asset().deserialize(response);
          this.assetForm.patchValue(this.hotelasset);
          this.updateFileType(this.hotelasset.type);
        })
    );
  }

  /**
   *  @function addAsset adding new record in asset datatable.
   */
  addAsset(): void {
    this.isSavingasset = true;
    const data = this.assetService.mapAssetData(
      this.assetForm.getRawValue(),
      this.entityId
    );
    this.$subscription.add(
      this.assetService.addasset(this.entityId, data).subscribe(
        (response) => {
          this.hotelasset = new Asset().deserialize(response);
          this.assetForm.patchValue(this.hotelasset);
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'message.success.asset_created',
                priorityMessage: 'Asset Created Successfully.',
              },
              '',
              {
                panelClass: 'success',
              }
            )
            .subscribe();
          this.router.navigate(['/pages/library/assets']);

          this.isSavingasset = false;
        },
        ({ error }) => { 
          this.isSavingasset = false;
        }
      )
    );
  }

  /**
   * @function redirectToAssets redirecting to asset datatable from create asset.
   */
  redirectToAssets() {
    this._location.back();
  }

  /**
   * @function updateAsset updating asset records.
   */
  updateAsset(): void {
    this.isSavingasset = true;
    const data = this.assetService.mapAssetData(
      this.assetForm.getRawValue(),
      this.entityId,
      this.hotelasset.id
    );
    this.$subscription.add(
      this.assetService
        .updateAsset(this.entityId, data, this.hotelasset.id)
        .subscribe(
          (response) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'message.success.asset_update',
                  priorityMessage: 'Asset Updated Successfully.',
                },
                '',
                {
                  panelClass: 'success',
                }
              )
              .subscribe();
            this.router.navigate(['/pages/library/assets']);

            this.isSavingasset = false;
          },
          ({ error }) => { 
            this.isSavingasset = false;
          }
        )
    );
  }

  /**
   * @function handleAssetTypeChanged handling uploaded file type change.
   * @param event file type.
   */
  handleAssetTypeChanged(event) {
    this.updateFileType(event.value);
  }

  /**
   * @function updateFileType formatting file.
   * @param type image or video file type.
   */
  updateFileType(type: string): void {
    this.fileUploadData.fileType =
      type === 'Image' ? assetConfig.size.image : assetConfig.size.video;
  }

  /**
   * @function assetImageUrl getter for image url.
   */
  get assetImageUrl(): string {
    return this.assetForm?.get('url').value || '';
  }

  get thumbnailUrl() {
    return this.assetForm?.get('thumbnailUrl').value || '';
  }

  /**
   * @function assetType returns file type.
   * @return type.
   */
  get assetType() {
    return this.assetForm?.get('type').value || assetConfig.type.image;
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
