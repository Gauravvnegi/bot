import { Component, HostListener, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Location } from '@angular/common';

import { ActivatedRoute, Router } from '@angular/router';
import {
  HotelDetailService,
  NavRouteOptions,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { cousins } from '../../constants/data';
import { outletBusinessRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';
import { Feature, OutletForm } from '../../types/outlet';
import { OutletBaseComponent } from '../outlet-base.components';
import { OutletFormService } from '../../services/outlet-form.service';
import { Services } from '../../models/services';

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
  cousins = cousins;
  compServices: any[] = [];
  paidServices: any[] = [];

  $subscription = new Subscription();
  loading = false;
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
    router: Router,
    route: ActivatedRoute
  ) {
    super(router, route);
  }

  ngOnInit(): void {
    this.siteId = this.hotelDetailService.siteId;
    this.initOptions();
    this.initForm();
    this.initComponent('outlet');
    this.initOptionConfig();
  }

  initOptions() {
    this.outletService.getOutletConfig().subscribe((res) => {
      this.types = res.type.map((item) => ({
        label: item.name,
        value: item.value,
        subTypes: item.subtype,
        menu: item?.menu,
      }));
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
      cc: [''],
      //this field are not creating form BE
      dayOfOperationStart: ['', [Validators.required]],
      dayOfOperationEnd: ['', [Validators.required]],
      timeDayStart: ['', [Validators.required]],
      timeDayEnd: ['', [Validators.required]],
      rules: [[]],

      address: [{}, [Validators.required]],
      imageUrl: [[], [Validators.required]],

      description: [''],
      serviceIds: [[]],
      menu: [[]],
      socialPlatforms: [[]],
      maximumOccupancy: [''],
      minimumOccupancy: [''],
      area: [''],
      dimension: ['sqft'],
      foodPackages: [[]],
      cuisinesType: [''],
    });
    this.onTypeChange();

    //patch value if there is outlet id
    if (this.outletId) {
      this.outletService.getOutletById(this.outletId).subscribe((res) => {
        const { type, subType, ...rest } = res;

        this.useForm.get('type').setValue(type);

        this.useForm.get('type').disable();
        this.useForm.get('subType').setValue(subType.toUpperCase());

        this.useForm.patchValue(rest);
      });
    }
  }

  onTypeChange() {
    const { type } = this.formControls;
    type.valueChanges.subscribe((type) => {
      const selectedType = this.types.filter((item) => item.value === type);

      this.isTypeSelected = true;
      this.subType = selectedType[0].subTypes.map((item) => ({
        label: item,
        value: item.toUpperCase(),
      }));

      if (selectedType[0].value === 'RESTAURANT') {
        this.outletService.menu.next(selectedType[0].menu);
      }

      //set form validation on type change
      const { maximumOccupancy, minimumOccupancy } = this.formControls;
      switch (type) {
        case 'RESTAURANT':
          this.getServices('COMPLIMENTARY');
          maximumOccupancy.setValidators([Validators.required]);
          minimumOccupancy.clearValidators();
          break;

        case 'VENUE':
          this.getServices('PAID');
          this.getServices('COMPLIMENTARY');
          minimumOccupancy.setValidators([Validators.required]);
          maximumOccupancy.clearAsyncValidators();
          break;

        case 'SPA':
          this.getServices('PAID');
          maximumOccupancy.clearValidators();
          minimumOccupancy.clearValidators();
      }
    });
  }

  /**
   * @function submitForm
   * @description submits the form
   */
  submitForm(features?: Feature): void {
    if (this.outletId && !(features === 'brand' || features === 'hotel')) {
      //save data into service for later use

      this.OutletFormService.initOutletFormData(
        this.useForm.getRawValue(),
        true
      );

      //navigate to respective feature
      if (features === 'service') {
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
            () =>
              this.entityId
                ? this.handleSuccess('hotel')
                : this.handleSuccess('brand'),
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

  initOptionConfig() {
    // this.getServices('PAID');
    // this.getServices('COMPLIMENTARY');
  }

  getServices(serviceType: string) {
    let param = '?type=SERVICE&serviceType=COMPLIMENTARY&pagination=false';

    if (serviceType === 'PAID') {
      param = '?limit=5&type=SERVICE&serviceType=PAID&status=true';
    }
    this.outletService
      .getServices(
        this.outletId,

        {
          params: param,
        }
      )
      .subscribe((res) => {
        if (serviceType === 'PAID') {
          this.paidServices = new Services().deserialize(
            res.paidPackages
          ).services;
        }
        if (serviceType === 'COMPLIMENTARY') {
          this.compServices = new Services().deserialize(
            res.complimentaryPackages
          ).services;

          const data = this.compServices.map((item) => {
            if (item.active) return item.id;
          });

          this.compServices = this.compServices.slice(0, 5);

          const { serviceIds } = this.formControls;
          serviceIds.patchValue(data);
        }
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
    this.snackbarService.openSnackBarAsText(
      this.outletId
        ? 'Outlet updated successfully'
        : 'Outlet added successfully'
    );
    switch (feature) {
      case 'menu':
        this.router.navigate(
          [`${outletId}/${outletBusinessRoutes.menu.route}`],
          {
            relativeTo: this.route,
          }
        );
        break;
      case 'service':
        this.router.navigate([`pages/library/services/create-service`], {
          relativeTo: this.route,
        });
        break;
      case 'import-services':
        this.router.navigate(
          [`${outletId}/${outletBusinessRoutes.importService.route}`],
          {
            relativeTo: this.route,
          }
        );
        break;
      case 'food-package':
        this.router.navigate([outletBusinessRoutes.foodPackage.route], {
          relativeTo: this.route,
        });
        break;

      case 'brand':
        this.router.navigate(
          [`/pages/settings/business-info/brand/${this.brandId}`],
          { relativeTo: this.route }
        );
        break;
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
