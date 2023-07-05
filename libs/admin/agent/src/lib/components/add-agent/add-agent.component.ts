import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
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
import { AgentResponseType } from '../../types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
@Component({
  selector: 'hospitality-bot-add-agent',
  templateUrl: './add-agent.component.html',
  styleUrls: ['./add-agent.component.scss'],
})
export class AddAgentComponent implements OnInit {
  hotelId: string;
  agentId: string;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  packageCode: string = '# will be auto generated';

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
  commissionTypes: Option[] = [{ label: '%OFF', value: 'PERCENTAGE' }];

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router,
    private formService: FormService
  ) {
    this.agentId = this.route.snapshot.paramMap.get('id');
    const { navRoutes, title } = agentRoutes[
      this.agentId ? 'editAgent' : 'addAgent'
    ];
    this.navRoutes = navRoutes;
    this.pageTitle = title;
  }

  ngOnInit(): void {
    this.hotelId = this.globalService.hotelId;
    this.initAgentForm();
    this.initDefaultForm();
  }

  initAgentForm() {
    this.agentForm = this.fb.group({
      active: [true],
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cc: ['+91'],
      phoneNo: [null, [Validators.required]],
      iataNo: ['', [CustomValidators.requiredLength(14)]],
      companyId: ['', [Validators.required]],
      address: ['', [Validators.required]],
      commissionType: ['PERCENTAGE'],
      commission: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    if (this.agentId) this.getAgentById();
  }

  initDefaultForm() {
    this.formService.agentForm &&
      this.formService.restoreForm(this.agentForm, 'agent');
    this.formService.reset();
  }

  /**
   * @function getAgentById load edit view
   */
  getAgentById() {
    this.loading = true;
    this.subscription$.add(
      this.agentService
        .getAgentById(this.agentId, { params: '?type=AGENT' })
        .subscribe((response: AgentResponseType) => {
          this.agentForm.patchValue({
            name: response.firstName,
            email: response.contactDetails.emailId,
            phoneNo: response.contactDetails.contactNumber,
            iataNo: response.iataNumber,
            companyId: response.companyId,
            address: response.address,
            commission: response.commission,
          });
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

    const formData = AgentModel.mapFormData(this.agentForm.getRawValue());
    const queryParams = { params: '?type=AGENT' };
    const request = !!this.agentId
      ? this.agentService.updateAgent(formData, this.agentId)
      : this.agentService.addAgent(formData, queryParams);
    this.subscription$.add(
      request.subscribe(this.handleSuccess, this.handleFinal)
    );
  }

  reset() {
    this.agentForm.patchValue({
      name: '',
      email: '',
      phoneNo: '',
      iataNo: '',
      companyId: '',
      address: '',
      commission: '',
    });
  }

  /**
   * @function addRoomType Add room type
   */
  createCompany() {
    this.saveForm();
    this.router.navigate([
      `/pages/members/company/${companyRoutes.addCompany.route}`,
    ]);
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

  /**
   * @function loadMoreCompany load more categories options
   */
  loadMoreCompany() {
    this.companyOffset = this.companyOffset + 10;
    this.getCompany();
  }

  /**
   * @function getCompany to get company list options
   */
  getCompany(): void {
    this.loadingCompany = true;
    this.subscription$.add(
      this.agentService
        .getCompanyList({
          params: `?type=AGENT&companyList=true&offset=${this.companyOffset}&limit=${this.companyLimit}`,
        })
        .subscribe(
          (res: CompanyResponseType[]) => {
            const data = AgentModel.getCompanyList(res);
            this.companyList = [...data];
            this.noMoreCompany = data.length < this.companyLimit;
          },
          (error) => {},
          () => {
            this.loadingCompany = false;
          }
        )
    );
  }

  /**
   * @function searchCompany To search categories
   * @param text search text
   */
  searchCompany(text: string) {
    if (text) {
      this.loadingCompany = true;
      //   this.libraryService
      //     .searchLibraryItem(this.hotelId, {
      //       params: `?key=${text}&type=${LibrarySearchItem.ROOM_TYPE}`,
      //     })
      //     .subscribe(
      //       (res) => {
      //         const data = res && res[LibrarySearchItem.ROOM_TYPE];
      //         this.roomTypes =
      //           data
      //             ?.filter((item) => item.status)
      //             .map((item) => {
      //               const roomType = new RoomType().deserialize(item);
      //               return {
      //                 label: roomType.name,
      //                 value: roomType.id,
      //                 price: roomType.price,
      //                 currency: roomType.currency,
      //               };
      //             }) ?? [];
      //       },
      //       (error) => {},
      //       () => {
      //         this.loadingCompany = false;
      //       }
      //     );
    } else {
      this.companyOffset = 0;
      this.companyList = [];
      this.getCompany();
    }
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
    this.router.navigate([`pages/members/agent/${this.routes.agent}`]);
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
