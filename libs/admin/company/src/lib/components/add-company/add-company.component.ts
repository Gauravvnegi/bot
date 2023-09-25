import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  ConfigService,
  NavRouteOptions,
  Option,
  Regex,
} from '@hospitality-bot/admin/shared';
import { CompanyService } from '../../services/company.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { companyRoutes } from '../../constants/route';
import { CompanyModel } from '../../models/company.model';
import { CompanyResponseType } from '../../types/response';
import {
  billingInstruction,
  businessSource,
  companyDiscount,
  discountTypes,
} from '../../constants/company';
import { Location } from '@angular/common';
import { FormService } from 'libs/admin/members/src/lib/services/form.service';
@Component({
  selector: 'hospitality-bot-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  readonly discountType = discountTypes;
  businessSource = businessSource;
  billingInstruction = billingInstruction;
  marketSegment: Option[] = [];

  entityId: string;
  companyId: string;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  companyForm: FormGroup;
  routes = companyRoutes;
  loading = false;

  subscription$ = new Subscription();

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private location: Location,
    private formService: FormService,
    private configService: ConfigService
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
      packageCode: ['# will be auto generated'],
      status: [true],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      cc: ['+91', [Validators.required]],
      phoneNo: [null, [Validators.required]],
      address: ['', [Validators.required]],
      salePersonName: [''],
      salePersonCC: ['+91'],
      salePersonNo: [''],
      discountType: [companyDiscount.PERCENTAGE, [Validators.required]],
      discount: ['', [Validators.required, Validators.min(0)]],
      taxId: [''],
      creditLimit: [''],
      marketSegment: [''],
      businessSource: [''],
      billingInstruction: [''],
    });
    this.loadMarketSegment();
    if (this.companyId) this.getCompanyById();
  }

  loadMarketSegment() {
    this.subscription$.add(
      this.configService
        .getColorAndIconConfig(this.entityId)
        .subscribe((response) => {
          this.marketSegment =
            response.bookingConfig.marketSegment.map((item) => ({
              label: item,
              value: item,
            })) ?? [];
        })
    );
  }

  listenChanges() {
    const discountControl = this.companyForm.get('discountType');
    const discountValueControl = this.companyForm.get('discount');
    const setDiscountValueAndErrors = () => {
      const discount = +(discountValueControl.value ?? 0);
      const type = discountControl.value;

      const validationRules = {
        [companyDiscount.PERCENTAGE]:
          discount > 100 ? { moreThan100: true } : null,
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
        (response) => {
          CompanyModel.updateForm(this.companyForm, response);
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
          this.formService.companyId.next(res?.id);
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
