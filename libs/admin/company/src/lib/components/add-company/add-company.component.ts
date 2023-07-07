import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { CompanyService } from '../../services/company.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { companyRoutes } from '../../constants/route';
import { CompanyModel } from '../../models/company.model';
import { CompanyResponseType } from '../../types/response';
import { companyDiscount } from '../../constants/company';
import { Location } from '@angular/common';
@Component({
  selector: 'hospitality-bot-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  entityId: string;
  companyId: string;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';

  companyForm: FormGroup;

  routes = companyRoutes;
  loading = false;
  subscription$ = new Subscription();

  discountType: Option[] = [
    { label: '%OFF', value: companyDiscount.PERCENTAGE },
    { label: 'Flat', value: companyDiscount.DISCOUNT },
  ];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.companyId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = companyRoutes[
      this.companyId ? 'editCompany' : 'addCompany'
    ];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalService.entityId;
    this.initCompanyForm();
    this.listenChanges();
  }

  initCompanyForm() {
    this.companyForm = this.fb.group({
      active: [true],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cc: ['+91', [Validators.required]],
      phoneNo: [null, [Validators.required]],
      address: ['', [Validators.required]],
      salePersonName: [''],
      salePersonCC: ['+91'],
      salePersonNo: [''],
      discountType: [companyDiscount.PERCENTAGE],
      discount: ['', [Validators.required, Validators.min(0)]],
    });

    if (this.companyId) this.getCompanyById();
  }

  listenChanges() {
    const discountControl = this.companyForm.get('discountType');
    const discountValueControl = this.companyForm.get('discount');
    const setDiscountValueAndErrors = () => {
      const discount = +(discountValueControl.value ?? 0);
      const type = discountControl.value;

      const validationRules = {
        [companyDiscount.PERCENTAGE]:
          discount >= 100 ? { moreThan100: true } : null,
      };

      if (discount < 0) {
        return { min: true };
      }

      return validationRules[type];
    };

    const discountSubscription = () => {
      discountValueControl.enable({ emitEvent: false });
      discountValueControl.setErrors(null);
      const errors = setDiscountValueAndErrors();
      errors && discountValueControl.setErrors(errors);
    };

    discountValueControl.valueChanges.subscribe(discountSubscription);
    discountControl.valueChanges.subscribe(discountSubscription);
  }

  /**
   * @function getCompanyById load edit view
   */
  getCompanyById() {
    this.loading = true;
    this.subscription$.add(
      this.companyService.getCompanyById(this.companyId).subscribe(
        (response: CompanyResponseType) => {
          this.packageCode = '#' + response.code;
          const address = response.address;
          this.companyForm.patchValue({
            name: response.firstName,
            email: response.contactDetails.emailId,
            cc: response.contactDetails.cc,
            phoneNo: response.contactDetails.contactNumber,
            address: {
              formattedAddress: `${address.addressLine1}, ${address.city}, ${address.countryCode}, ${address.postalCode}, ${address.state}`,
              city: address.city,
              state: address.state,
              countryCode: address.countryCode,
              postalCode: address.postalCode,
            },
            salePersonName: response.salesPersonName,
            salePersonNo: response.salesPersonPhone,
            discountType: response.priceModifier,
            discount: response.priceModifierValue,
          });
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  handleSubmit() {
    if (this.companyForm.invalid) {
      this.companyForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }

    this.loading = true;
    const formData = CompanyModel.mapFormData(this.companyForm.getRawValue());
    const queryParams = { params: `?type=COMPANY&entityId=${this.entityId}` };
    const request = this.companyId
      ? this.companyService.updateCompany(formData, this.companyId)
      : this.companyService.addCompany(formData, queryParams);

    this.subscription$.add(
      request.subscribe(
        (res) => {
          this.snackbarService.openSnackBarAsText(
            `Company is ${!this.companyId ? 'created' : 'edited'} successfully`,
            '',
            { panelClass: 'success' }
          );
          this.location.back();
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  reset() {
    this.companyForm.patchValue({
      name: '',
      email: '',
      phoneNo: '',
      address: '',
      salePersonName: '',
      salePersonNo: '',
      discount: '',
    });
  }

  /**
   * @function handleFinal
   */
  handleFinal = () => {
    this.loading = false;
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
