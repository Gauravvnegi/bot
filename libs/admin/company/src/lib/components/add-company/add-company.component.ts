import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { CompanyService } from '../../services/company.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { companyRoutes, navRoute } from '../../constants/route';
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
    private router: Router
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
      cc: ['+91'],
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
        .getCompanyById(this.hotelId, { companyId: +this.companyId })
        .subscribe((response) => {
          this.companyForm.patchValue({
            name: response.name,
            email: response.email,
            phoneNo: response.phoneNumber,
            address: response.address,
            salePersonName: response.salesPersonName,
            salePersonNo: response.salesPersonNumber,
            discount: response.discount,
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

    if (!!this.companyId) {
      this.subscription$.add(
        this.companyService
          .updateCompany(this.hotelId, {
            ...this.companyForm.getRawValue(),
            type: 'COMPANY',
            source: 1,
          })
          .subscribe(this.handleSuccess, this.handleFinal)
      );
    } else {
      this.subscription$.add(
        this.companyService
          .addCompany(
            this.hotelId,
            {
              ...this.companyForm.getRawValue(),
              type: 'COMPANY',
              source: 1,
            },
            {
              params: '?type=COMPANY',
            }
          )
          .subscribe(this.handleSuccess, this.handleFinal)
      );
    }
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
    this.router.navigate([`pages/members/company/${this.routes.company}`]);
  };

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
