import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  ConfigService,
  ModuleNames,
  NavRouteOptions,
  Option,
  QueryConfig,
  Regex,
  TableService,
} from '@hospitality-bot/admin/shared';
import { AgentService } from '../../services/agent.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { agentRoutes } from '../../constant/routes';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { FormService } from 'libs/admin/members/src/lib/services/form.service';
import { companyRoutes } from 'libs/admin/company/src/lib/constants/route';
import { AgentFormType } from '../../types/form.types';
import { AgentModel } from '../../models/agent.model';
import { AgentTableResponse } from '../../types/response';
import { commissionType } from '../../types/agent';
import {
  billingInstruction,
  businessSource,
  discountTypes,
} from 'libs/admin/company/src/lib/constants/company';
import { Location } from '@angular/common';
@Component({
  selector: 'hospitality-bot-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'],
})
export class AddAgentComponent implements OnInit {
  entityId: string;
  agentId: string;
  pageTitle: string;
  navRoutes: NavRouteOptions;

  agentForm: FormGroup;

  routes = agentRoutes;
  loading = false;
  subscription$ = new Subscription();

  /* roomTypes options variable */
  companyOffset = 0;
  loadingCompany = false;
  noMoreCompany = false;
  companyLimit = 10;

  companyList: Option[] = [];
  commissionTypes: Option[] = [
    { label: '%OFF', value: commissionType.PERCENTAGE },
    { label: 'Flat', value: commissionType.COMMISSION },
  ];
  businessSource = businessSource;
  billingInstruction = billingInstruction;
  marketSegment: Option[] = [];

  constructor(
    public fb: FormBuilder,
    public tabFilter: TableService,
    private agentService: AgentService,
    private globalService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService,
    private configService: ConfigService,
    private routesConfigService: RoutesConfigService,
    private location: Location
  ) {
    this.agentId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = agentRoutes[
      this.agentId ? 'editAgent' : 'addAgent'
    ];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.entityId = this.globalService.entityId;
    this.initAgentForm();
    this.formService.restoreForm(this.agentForm, 'agent');
    this.initNavRoutes();
  }

  initAgentForm() {
    this.agentForm = this.fb.group({
      packageCode: ['# will be auto generated'],
      status: [true],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(Regex.EMAIL_REGEX)]],
      cc: ['+91', [Validators.required]],
      phoneNo: ['', [Validators.required]],
      iataNo: ['', [CustomValidators.requiredLength(14)]],
      company: [''],
      address: ['', [Validators.required]],
      commissionType: [commissionType.PERCENTAGE, [Validators.required]],
      commission: ['', [Validators.required, Validators.min(0)]],
      marketSegment: [''],
      businessSource: [''],
      billingInstruction: [''],
    });
    this.loadMarketSegment();
    this.listenChanges();
    if (this.agentId) this.getAgentById();
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
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
    const commissionControl = this.agentForm.get('commissionType');
    const commissionValueControl = this.agentForm.get('commission');
    const setCommissionValueAndErrors = () => {
      const commission = +(commissionValueControl.value ?? 0);
      const type = commissionControl.value;

      const validationRules = {
        [commissionType.PERCENTAGE]:
          commission > 100 ? { moreThan100: true } : null,
      };

      if (commission < 0) {
        return { min: true };
      }

      return validationRules[type];
    };

    const commissionSubscription = () => {
      commissionValueControl.enable({ emitEvent: false });
      commissionValueControl.setErrors(null);
      const errors = setCommissionValueAndErrors();
      errors && commissionValueControl.setErrors(errors);
    };

    commissionValueControl.valueChanges.subscribe(commissionSubscription);
    commissionControl.valueChanges.subscribe(commissionSubscription);

    this.formService.companyId.subscribe((res) => {
      if (res.length) this.agentForm.get('company').patchValue(res);
    });
  }

  /**
   * @function getAgentById load edit view
   */
  getAgentById() {
    this.loading = true;
    this.subscription$.add(
      this.agentService
        .getAgentById(this.agentId, {
          params: `?type=AGENT&entityId=${this.entityId}`,
        })
        .subscribe((response) => {
          AgentModel.updateForm(this.agentForm, response);
          this.loading = false;
        }, this.handleFinal)
    );
  }

  handleSubmit() {
    if (this.agentForm.invalid) {
      this.agentForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix errors'
      );
      return;
    }
    this.loading = true;

    const formData = AgentModel.mapFormData(this.agentForm.getRawValue());
    const queryParams = { params: `?type=AGENT&entityId=${this.entityId}` };
    const request = this.agentId
      ? this.agentService.updateAgent(formData, this.agentId)
      : this.agentService.addAgent(formData, queryParams);
    this.subscription$.add(
      request.subscribe(
        (res) => {
          this.loading = false;
          this.handleSuccess();
        },
        (error) => {
          this.loading = false;
        },
        this.handleFinal
      )
    );
  }

  reset() {
    AgentModel.resetForm(this.agentForm);
  }

  /**
   * @function createNewCompany Add new company
   */
  createNewCompany() {
    this.saveForm();
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.COMPANY,
      additionalPath: companyRoutes.addCompany.route,
    });
  }

  saveForm() {
    this.formService.companyRedirectRoute = '/pages/members/agent';
    this.route.snapshot.url.forEach((segment) => {
      this.formService.companyRedirectRoute += `/${segment.path}`;
    });
    this.formService.setForm(
      this.agentForm.getRawValue() as AgentFormType,
      'agent'
    );
  }

  getQueryConfig(type = 'AGENT'): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        // ...this.getSelectedQuickReplyFilters({ isStatusBoolean: true }),
        {
          type: type,
          // offset: this.first,
          // limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  /**
   * @function handleSuccess to handle network success
   */
  handleSuccess = () => {
    this.loading = false;
    this.snackbarService.openSnackBarAsText(
      `Agent is ${!this.agentId ? 'created' : 'edited'} successfully`,
      '',
      { panelClass: 'success' }
    );
    this.location.back();
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
