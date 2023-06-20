import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { CompanyService } from '../../services/company.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { companyRoutes, navRoute } from '../../constants/route';
import { FormService } from '../../../../../members/src/lib/services/form.service';
import { CompanyModel } from '../../models/company.model';
import { CompanyResponseType } from '../../types/response';
@Component({
  selector: 'hospitality-bot-add-company',
  templateUrl: './add-company.component.html',
  styleUrls: ['./add-company.component.scss'],
})
export class AddCompanyComponent implements OnInit {
  hotelId: string;
  companyId: string;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';

  companyForm: FormGroup;

  routes = companyRoutes;
  loading = false;
  subscription$ = new Subscription();

  discountType: Option[] = [{ label: '%OFF', value: 'PERCENTAGE' }];

  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService
  ) {
    this.companyId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = companyRoutes[
      this.companyId ? 'editCompany' : 'addCompany'
    ];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.initCompanyForm();
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
      salePersonNo: [null],
      discountType: ['PERCENTAGE'],
      discount: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    if (this.companyId) this.getCompanyById();
  }

  /**
   * @function getCompanyById load edit view
   */
  getCompanyById() {
    this.loading = true;
    this.subscription$.add(
      this.companyService
        .getCompanyById(this.companyId)
        .subscribe((response: CompanyResponseType) => {
          this.companyForm.patchValue({
            name: response.firstName,
            email: response.contactDetails.emailId,
            cc: response.contactDetails.cc,
            phoneNo: response.contactDetails.contactNumber,
            address: response.address,
            salePersonName: response.salesPersonName,
            salePersonNo: response.salesPersonPhone,
            discountType: response.pricaModifierType,
            discount: response.priceModifierValue,
          });
        }, this.handleFinal)
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

    const formData = CompanyModel.mapFormData(this.companyForm.getRawValue());
    const queryParms = { params: '?type=COMPANY' };
    const request = !!this.companyId
      ? this.companyService.updateCompany(formData, this.companyId)
      : this.companyService.addCompany(formData, queryParms);

    this.subscription$.add(
      request.subscribe(this.handleSuccess, this.handleFinal)
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
   * @function handleSuccess to handle network success
   */
  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Company is ${!this.companyId ? 'created' : 'edited'} successfully`,
      '',
      { panelClass: 'success' }
    );
    const targetedRoute = !this.formService.companyRedirectRoute.length
      ? `pages/members/company/${this.routes.company.route}`
      : this.formService.companyRedirectRoute;
    this.router.navigate([targetedRoute]);
  };

  /**
   * @function handleFinal
   */
  handleFinal = () => {
    this.loading = false;
    // To-do, handle success method will be remove after integration with api
    this.handleSuccess();
  };

  /**
   * Unsubscribe when component is getting removed
   */
  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
