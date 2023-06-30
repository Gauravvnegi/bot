import { Component, HostListener, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import {
  HotelDetailService,
  NavRouteOptions,
  Option,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Subscription } from 'rxjs';
import { cousins } from '../../constants/data';
import { outletRoutes } from '../../constants/routes';
import { OutletService } from '../../services/outlet.service';
import {
  Feature,
  OutletForm,
  RestaurantForm,
  SpaForm,
  VenueForm,
} from '../../types/outlet';

@Component({
  selector: 'hospitality-bot-add-outlet',
  templateUrl: './add-outlet.component.html',
  styleUrls: ['./add-outlet.component.scss'],
})
export class AddOutletComponent implements OnInit {
  pageTitle: string = '';
  navRoutes: NavRouteOptions = [];
  useForm: FormGroup;
  types: Option[] = [];
  subType: Option[] = [];
  isTypeSelected = false;
  outletId: string = '';
  cousins = cousins;
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
    private router: Router,
    private route: ActivatedRoute,
    private hotelDetailService: HotelDetailService
  ) {
    this.router.events.subscribe(
      ({ snapshot }: { snapshot: ActivatedRouteSnapshot }) => {
        const outletId = snapshot?.params['outletId'];
        if (outletId) this.outletId = outletId;
      }
    );

    const { navRoutes, title } = outletRoutes['addOutlet'];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    console.log(this.outletId);
    this.siteId = this.hotelDetailService.siteId;
    this.initOptions();
    this.initForm();
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
      contact: this.fb.group({
        countryCode: ['+91'],
        number: [''],
      }),
      openingDay: [''],
      closingDay: [''],
      openingHour: [''],
      closingHour: [''],
      address: [{}, [Validators.required]],
      imageUrl: [[], [Validators.required]],
      description: [''],
      rules: [[]],
      serviceIds: [[]],
      menu: [[]],
      socialMedia: [[]],
      maximumOccupancy: [''],
      minimumOccupancy: [''],
      area: [''],
      areaUnit: ['sqft'],
      foodPackages: [[]],
      cousins: [[]],
    });

    //patch value if there is outlet id
    if (this.outletId) {
      this.outletService.getOutletById(this.outletId).subscribe((res) => {
        console.log(res, 'response');
        this.useForm.patchValue(res);
      });
    }
  }

  onTypeChange(type: string) {
    const selectedType = this.types.filter((item) => item.value === type);
    this.isTypeSelected = true;
    this.subType = selectedType[0].subTypes.map((item) => ({
      label: item,
      value: item,
    }));
    if (selectedType[0].value === 'RESTAURANT') {
      this.outletService.menu.next(selectedType[0].menu);
    }

    //set form validation on type change
    const { maximumOccupancy, minimumOccupancy } = this.formControls;
    switch (type) {
      case 'RESTAURANT':
        maximumOccupancy.setValidators([Validators.required]);
        minimumOccupancy.clearValidators();
        break;

      case 'VENUE':
        minimumOccupancy.setValidators([Validators.required]);
        maximumOccupancy.clearAsyncValidators();
        break;

      case 'SPA':
        maximumOccupancy.clearValidators();
        minimumOccupancy.clearValidators();
    }
  }

  /**
   * @function submitForm
   * @description submits the form
   */
  submitForm(features?: Feature): void {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Please fill all the required fields'
      );
      return;
    }

    let data = this.useForm.getRawValue() as OutletForm;

    if (this.outletId) {
      this.$subscription.add(
        this.outletService
          .updateOutlet(this.outletId, data)
          .subscribe(this.handleSuccess, this.handleError)
      );
    } else {
      this.$subscription.add(
        this.outletService
          .addOutlet({ entity: { ...data }, siteId: this.siteId })
          .subscribe(
            (res) => this.handleSuccess(features, res.id),
            this.handleError
          )
      );
    }
  }

  //get form controls
  get formControls() {
    return this.useForm.controls as Record<keyof OutletForm, AbstractControl>;
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
    console.log(feature, outletId, 'feature');
    this.snackbarService.openSnackBarAsText(
      this.outletId
        ? 'Outlet updated successfully'
        : 'Outlet added successfully'
    );
    switch (feature) {
      case 'menu':
        console.log('menu');
        break;
      case 'service':
        this.router.navigate([
          `pages/outlet/all-outlets/add-outlet/${outletId}/import-service`,
        ]);
        break;
      case 'food':
        console.log('food');
        break;
      default:
        this.router.navigate([
          `pages/outlet/all-outlets/add-outlet/${outletId}`,
        ]);
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
