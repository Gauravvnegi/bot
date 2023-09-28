import { Location } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  HotelDetailService,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import { ModalService } from '@hospitality-bot/shared/material';
import { QrCodeModalComponent } from 'libs/admin/shared/src/lib/components/qr-code-modal/qr-code-modal.component';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { DialogService } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { outletBusinessRoutes } from '../../constants/routes';
import { MenuList, OutletFormData } from '../../models/outlet.model';
import { Services } from '../../models/services';
import { OutletFormService } from '../../services/outlet-form.service';
import { OutletService } from '../../services/outlet.service';
import { Feature, OutletForm, OutletType } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';

@Component({
  selector: 'hospitality-bot-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss'],
  providers: [DialogService],
})
export class AddOutletComponent extends OutletBaseComponent implements OnInit {
  useForm: FormGroup;
  types: Option[] = [];
  subType: Option[] = [];
  isTypeSelected = false;
  isSpaSelected = false;
  cuisines: Option[] = [];
  compServices: any[] = [];
  paidServices: any[] = [];
  menuList: any[] = [];
  foodPackages: any[] = [];

  $subscription = new Subscription();
  loading = false;
  isPaidLoading = false;
  isCompLoading = false;
  siteId: string;
  logoUrl: string;
  redirectUrl: string;

  hours: Option[] = [];
  days: Option[] = [];
  dimensions: Option[] = [];

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
    private dialogService: DialogService,

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
        label: item.label,
        value: item.value,
        subTypes: item.subtype,
        menu: item?.menu,
        cuisinesTypes: item?.cuisinesTypes?.map((item) => ({
          label: item,
          value: item,
        })),
      }));
      this.onTypeChange();
      this.getOutletData();
      this.getOutletConfig();
    });
  }

  initForm(): void {
    this.useForm = this.fb.group({
      status: ['ACTIVE'],
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
      startDay: ['', [Validators.required]],
      endDay: ['', [Validators.required]],
      from: ['', [Validators.required]],
      to: ['', [Validators.required]],
      address: ['', [Validators.required]],
      imageUrl: [[], [Validators.required]],
      description: [''],
      serviceIds: [[]],
      paidServiceIds: [[]],
      menuIds: [[]],
      foodPackageIds: [[]],
      shortDescription: [''],

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
            this.loading = false;
            const {
              absoluteRoute,
              type,
              subType,
              logo,
              operationalDays,
              ...rest
            } = res;
            this.logoUrl = logo;
            this.redirectUrl = absoluteRoute;
            this.initOptionConfig(type);
            this.useForm.get('type').setValue(type);
            this.useForm.get('startDay').setValue(operationalDays?.startDay);
            this.useForm.get('endDay').setValue(operationalDays?.endDay);
            this.useForm.get('from').setValue(operationalDays?.from);
            this.useForm.get('to').setValue(operationalDays?.to);

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

  /**
   * @Function filterValues
   * @description filters the values
   * @param control
   * @param values
   * @returns
   */
  filterValues(control, values) {
    const value = control?.value;
    return value !== undefined
      ? values.filter((item) => item.value !== value)
      : values;
  }

  get startDays() {
    return this.filterValues(this.formControls.endDay, this.days);
  }

  get endDays() {
    return this.filterValues(this.formControls.startDay, this.days);
  }

  get fromTime() {
    return this.filterValues(this.formControls.to, this.hours);
  }

  get toTime() {
    return this.filterValues(this.formControls.from, this.hours);
  }

  onTypeChange() {
    const { type } = this.formControls;
    type.valueChanges.subscribe((type: OutletType) => {
      this.isSpaSelected = type === 'SPA';
      const selectedType = this.types.filter((item) => item.value === type);

      this.isTypeSelected = true;
      this.subType = selectedType[0]?.subTypes.map((item) => ({
        label: item,
        value: item.toUpperCase(),
      }));

      //set form validation on type change
      const { maximumOccupancy, minimumOccupancy } = this.formControls;
      switch (type) {
        case 'RESTAURANT':
          maximumOccupancy.setValidators([Validators.required]);
          minimumOccupancy.clearValidators();
          this.cuisines = selectedType[0]?.cuisinesTypes;
          break;

        case 'VENUE':
          minimumOccupancy.setValidators([Validators.required]);
          maximumOccupancy.setValidators([Validators.required]);
          break;

        case 'SPA':
          maximumOccupancy.clearValidators();
          minimumOccupancy.clearValidators();
      }
      minimumOccupancy.updateValueAndValidity();
      maximumOccupancy.updateValueAndValidity();
    });
  }

  getOutletConfig() {
    this.outletService.getOutletConfig().subscribe((res) => {
      this.hours = res?.HOURS;
      this.days = res?.WEEKDAYS;
      this.dimensions = res?.DIMENSIONS;
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
    this.OutletFormService.initOutletFormData(
      {
        ...this.useForm.getRawValue(),
        complimentaryAmenities: this.compServices,
        paidAmenities: this.paidServices,
        MenuList: this.menuList,
      },
      true
    );
    if (this.outletId && !(features === 'brand' || features === 'hotel')) {
      //save data into service for later use

      //navigate to respective feature
      if (features === 'save') {
        return;
      } else if (features === 'service') {
        const dataToSend = {
          entityId: this.outletId,
        };
        const navigationExtras: NavigationExtras = {
          queryParams: dataToSend,
        };
        //navigate to create service
        this.router.navigate(
          [`/pages/library/services/create-service`],

          navigationExtras
        );
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
        'Please review the form and correct the highlighted fields.'
      );
      return;
    }

    let data = new OutletFormData().deserialize(this.useForm.getRawValue());

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
    const dialogConfig: any = {
      header: 'QR Code',
      width: '40vw',
      closable: true,
      // contentStyle: { 'max-height': '500px', overflow: 'auto' },
    };

    const ref = this.dialogService.open(QrCodeModalComponent, dialogConfig);
    const { imageUrl } = this.formControls;

    this.modalService.__config = {
      backgroundURl: imageUrl?.value.filter((item) => item.isFeatured)?.[0]
        ?.url,
      descriptionsHeading: 'HOW TO ORDER',
      descriptionsPoints: [
        'Scan the QR code to access the menu',
        'Browse the menu and place your order',
        'Place your orders',
      ],
      route: this.redirectUrl ?? 'https://www.test.menu.com/',
      logoUrl: this.logoUrl,
    };

    ref.onClose.subscribe(() => {
      // Handle dialog close event
      ref.close();
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
        this.router.navigate([`/pages/library/services/create-service`], {
          relativeTo: this.route,
          queryParams: { entityId: this.outletId },
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
        this.router.navigate(
          [`${outletId}/${outletBusinessRoutes.foodPackage.route}`],
          {
            relativeTo: this.route,
          }
        );
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
