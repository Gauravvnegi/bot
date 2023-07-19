import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import {
  HotelDetailService,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { QrCodeModalComponent } from 'libs/admin/shared/src/lib/components/qr-code-modal/qr-code-modal.component';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { cuisinesType } from '../../constants/data';
import { outletBusinessRoutes } from '../../constants/routes';
import { MenuList } from '../../models/outlet.model';
import { Services } from '../../models/services';
import { OutletFormService } from '../../services/outlet-form.service';
import { OutletService } from '../../services/outlet.service';
import { Feature, OutletForm, OutletType } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';

@Component({
  selector: 'hospitality-bot-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss'],
})
export class AddOutletComponent extends OutletBaseComponent implements OnInit {
  useForm: FormGroup;
  types: Option[] = [];
  subType: Option[] = [];
  isTypeSelected = false;
  cuisines = cuisinesType;
  compServices: any[] = [];
  paidServices: any[] = [];
  menuList: any[] = [];

  $subscription = new Subscription();
  loading = false;
  isPaidLoading = false;
  isCompLoading = false;
  siteId: string;

  @HostListener('window:beforeunload', ['$event'])
  handleBeforeUnload(event: BeforeUnloadEvent) {
    event.preventDefault();
    event.returnValue = false;
    return 'Are you sure you want to leave? Your unsaved changes will be lost.';
  }

  constructor(
    private fb: FormBuilder,
    private outletService: OutletService,
    private snackbarService: SnackBarService,
    private hotelDetailService: HotelDetailService,
    private OutletFormService: OutletFormService,
    private location: Location,
    private modalService: ModalService,

    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.siteId = this.hotelDetailService.siteId;
    this.initOptions();
    this.initForm();
    this.initRoutes('outlet');
  }

  initOptions() {
    this.outletService.getOutletConfig().subscribe((res) => {
      this.types = res.type.map((item) => ({
        label: item.name,
        value: item.value,
        subTypes: item.subtype,
        menu: item?.menu,
      }));
      this.onTypeChange();
      this.getOutletData();
    });
  }

  initForm(): void {
    this.useForm = this.fb.group({
      name: ['', [Validators.required]],
      type: [[], [Validators.required]],
      subType: [[], [Validators.required]],
      emailId: [
        '',
        [Validators.pattern(Regex.EMAIL_REGEX), Validators.required],
      ],
      contact: this.fb.group({
        countryCode: ['+91'],
        number: [''],
      }),
      dayOfOperationStart: ['', [Validators.required]],
      dayOfOperationEnd: ['', [Validators.required]],
      timeDayStart: ['', [Validators.required]],
      timeDayEnd: ['', [Validators.required]],
      address: [{}, [Validators.required]],
      imageUrl: [[], [Validators.required]],
      description: [''],
      serviceIds: [[]],
      paidServiceIds: [[]],
      menuIds: [[]],
      foodPackageIds: [[]],

      socialPlatforms: [[]],
      maximumOccupancy: [''],
      minimumOccupancy: [''],
      area: [''],
      dimension: ['sqft'],
      cuisinesType: [[]],

      //not working filed
      rules: [[]],
    });
  }

  getOutletData() {
    if (this.outletId) {
      if (this.OutletFormService.outletFormState) {
        const { type } = this.OutletFormService.OutletFormData;
        this.initOptionConfig(type);

        this.useForm.patchValue(this.OutletFormService.OutletFormData);
        this.useForm.get('type').disable();
      } else {
        this.loading = true;
        this.outletService.getOutletById(this.outletId).subscribe(
          (res) => {
            const { type, subType, ...rest } = res;

            this.initOptionConfig(type);

            this.useForm.get('type').setValue(type);

            this.useForm.get('type').disable();
            this.useForm.get('subType').setValue(subType.toUpperCase());

            this.useForm.patchValue(rest);
          },
          this.handleError,
          () => (this.loading = false)
        );
      }
    }
  }

  initOptionConfig(type) {
    switch (type) {
      case 'RESTAURANT':
        this.getMenuList();
        this.getServices('COMPLIMENTARY');
        break;
      case 'VENUE':
        this.getServices('PAID');
        this.getServices('COMPLIMENTARY');
        break;
      case 'SPA':
        this.getServices('PAID');
    }
  }

  onTypeChange() {
    const { type } = this.formControls;
    type.valueChanges.subscribe((type: OutletType) => {
      const selectedType = this.types.filter((item) => item.value === type);

      this.isTypeSelected = true;
      this.subType = selectedType[0].subTypes.map((item) => ({
        label: item,
        value: item.toUpperCase(),
      }));

      //set form validation on type change
      const { maximumOccupancy, minimumOccupancy } = this.formControls;
      switch (type) {
        case 'RESTAURANT':
          maximumOccupancy.setValidators([Validators.required]);
          minimumOccupancy.clearValidators();
          break;

        case 'VENUE':
          minimumOccupancy.setValidators([Validators.required]);
          maximumOccupancy.setValidators([Validators.required]);
          break;

        case 'SPA':
          maximumOccupancy.clearValidators();
          minimumOccupancy.clearValidators();
      }
    });
  }

  getMenuList() {
    this.$subscription.add(
      this.outletService.getMenuList(this.outletId).subscribe((res) => {
        this.menuList = new MenuList().deserialize(res).records;
      })
    );
  }

  /**
   * @function submitForm
   * @description submits the form
   */
  submitForm(features?: Feature): void {
    if (this.outletId && !(features === 'brand' || features === 'hotel')) {
      //save data into service for later use

      this.OutletFormService.initOutletFormData(
        {
          ...this.useForm.getRawValue(),
          complimentaryAmenities: this.compServices,
          paidAmenities: this.paidServices,
          MenuList: this.menuList,
        },
        true
      );

      //navigate to respective feature
      if (features === 'save') {
        return;
      } else if (features === 'service') {
        //navigate to create service
        this.router.navigate([`/pages/library/services/create-service`], {
          relativeTo: this.route,
        });
      } else {
        //navigate to respective feature
        this.router.navigate([features], {
          relativeTo: this.route,
        });
      }

      return;
    }

    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please fill all the required fields'
      );
      return;
    }

    let data = this.useForm.getRawValue() as OutletForm;

    //api call to add/update outlet
    if (this.outletId) {
      this.$subscription.add(
        this.outletService
          .updateOutlet(this.outletId, data)
          .subscribe(
            () => this.handleSuccess(features, this.outletId),
            this.handleError
          )
      );
    } else {
      this.$subscription.add(
        this.outletService
          .addOutlet({
            entity: { ...data },
            siteId: this.siteId,
            parentId: this.entityId ? this.entityId : this.brandId,
          })
          .subscribe((res) => {
            if (res?.id) this.handleSuccess(features, res.id);
          }, this.handleError)
      );
    }
  }

  //get form controls
  get formControls() {
    return this.useForm.controls as Record<keyof OutletForm, AbstractControl>;
  }

  getServices(serviceType: string) {
    this.loading = true;
    this.isCompLoading = true;
    this.isPaidLoading = true;
    this.outletService
      .getServices(
        this.outletId,

        {
          params: `?type=SERVICE&serviceType=${serviceType}&pagination=false`,
        }
      )
      .subscribe(
        (res) => {
          this.loading = false;
          if (serviceType === 'PAID') {
            this.paidServices = new Services().deserialize(
              res.paidPackages
            ).services;

            //extracting id of paid services
            const data = this.paidServices.map((item) => {
              if (item.active) return item.id;
            });

            this.compServices = this.compServices.slice(0, 5);

            if (!this.OutletFormService.outletFormState) {
              const { paidServiceIds } = this.formControls;
              paidServiceIds.patchValue(data);
            }
          }
          if (serviceType === 'COMPLIMENTARY') {
            this.compServices = new Services().deserialize(
              res.complimentaryPackages
            ).services;

            const data = this.compServices.map((item) => {
              if (item.active) return item.id;
            });

            this.compServices = this.compServices.slice(0, 5);
            if (!this.OutletFormService.outletFormState) {
              const { serviceIds } = this.formControls;
              serviceIds.patchValue(data);
            }
          }
        },
        (err) => {},
        () => {
          this.loading = false;
          if (serviceType === 'COMPLIMENTARY') {
            this.isCompLoading = false;
          }
          if (serviceType === 'PAID') {
            this.isPaidLoading = false;
          }
        }
      );
  }

  /**
   * @function onPrintQrCode
   * @description opens the qr code modal
   * @returns void
   */
  onPrintQrCode() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '46vw';
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      QrCodeModalComponent,
      dialogConfig
    );

    const { imageUrl } = this.formControls;

    togglePopupCompRef.componentInstance.content = {
      backgroundURl: imageUrl.value[0].url,

      descriptionHeading: 'HOW TO ORDER',
      descriptionsPoints: [
        'Scan the QR code to access the menu',
        'Browse the menu and place your order',
        'Place your orders',
      ],
      route: 'https://Leela.botshot.ai',
    };
    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  /**
   * @function resetForm
   * @description resets the form
   *
   */
  resetForm(): void {
    this.useForm.reset();
  }

  /**
   * @function handleSuccess
   * @description handles success
   */
  handleSuccess = (feature?: Feature, outletId?: string) => {
    this.loading = false;
    this.OutletFormService.resetOutletFormData();

    this.snackbarService.openSnackBarAsText(
      this.outletId
        ? 'Outlet updated successfully'
        : 'Outlet added successfully',
      '',
      { panelClass: 'success' }
    );
    switch (feature) {
      //to navigate back to create menu page
      case 'menu':
        this.router.navigate(
          [`${outletId}/${outletBusinessRoutes.menu.route}`],
          {
            relativeTo: this.route,
          }
        );
        break;
      //to navigate to create service page
      case 'service':
        this.router.navigate([`pages/library/services/create-service`], {
          relativeTo: this.route,
        });
        break;
      //to navigate  to create import service page
      case 'import-services':
        this.router.navigate(
          [`${outletId}/${outletBusinessRoutes.importService.route}`],
          {
            relativeTo: this.route,
          }
        );
        break;
      //to navigate to create food package page
      case 'food-package':
        this.router.navigate([outletBusinessRoutes.foodPackage.route], {
          relativeTo: this.route,
        });
        break;
      //to navigate back to edit brand page
      case 'brand':
        this.router.navigate(
          [`/pages/settings/business-info/brand/${this.brandId}`],
          { relativeTo: this.route }
        );
        break;
      //to navigate back to edit hotel page
      case 'hotel':
        this.router.navigate(
          [
            `/pages/settings/business-info/brand/${this.brandId}/hotel/${this.entityId}`,
          ],
          {
            relativeTo: this.route,
          }
        );
        break;
      default:
        this.router.navigate([`${outletId}`], {
          relativeTo: this.route,
        });
    }
  };

  /**
   * @function handleError
   * @description handles error
   */
  handleError = (err) => {
    this.loading = false;
  };

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
