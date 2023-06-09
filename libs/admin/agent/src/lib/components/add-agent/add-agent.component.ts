import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { AgentService } from '../../services/agent.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { agentRoutes, navRoute } from '../../constant/routes';
import CustomValidators from 'libs/admin/shared/src/lib/utils/validators';
import { Agent } from '../../models/agent.model';
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

  commissionTypes: Option[] = [{ label: '%OFF', value: 'PERCENTAGE' }];

  constructor(
    private fb: FormBuilder,
    private agentService: AgentService,
    private globalService: GlobalFilterService,
    private snackbarService: SnackBarService,
    private route: ActivatedRoute,
    private router: Router
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
  }

  initAgentForm() {
    this.agentForm = this.fb.group({
      active: [true],
      firstName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      cc: ['+91'],
      phoneNo: [null, [Validators.required]],
      iataNo: [
        null,
        [
          Validators.required,
          Validators.maxLength(14),
          CustomValidators.requiredLength(14),
        ],
      ],
      companyName: ['', [Validators.required]],
      address: ['', [Validators.required]],
      commissionType: ['PERCENTAGE'],
      commission: [
        null,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],
    });

    if (this.agentId) this.getAgentById();
  }

  /**
   * @function getAgentById load edit view
   */
  getAgentById() {
    this.loading = true;
    this.subscription$.add(
      this.agentService
        .getAgentById(this.hotelId, { AgentId: this.agentId })
        .subscribe((response) => {
          this.agentForm.patchValue({
            firstName: response.name,
            email: response.email,
            phoneNo: response.phoneNo,
            iataNo: response.iataNo,
            companyName: response.company,
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

    if (!!this.agentId) {
      this.subscription$.add(
        this.agentService
          .updateAgent(
            this.hotelId,
            {
              ...this.agentForm.getRawValue(),
              type: 'AGENT',
              source: 1,
            },
            {
              params: '?type=AGENT',
            }
          )
          .subscribe(this.handleSuccess, this.handleFinal)
      );
    } else {
      this.subscription$.add(
        this.agentService
          .addAgent(
            this.hotelId,
            {
              ...this.agentForm.getRawValue(),
              type: 'AGENT',
              source: 1,
            },
            {
              params: '?type=AGENT',
            }
          )
          .subscribe(this.handleSuccess, this.handleFinal)
      );
    }
  }

  reset() {
    this.agentForm.patchValue({
      firstName: '',
      email: '',
      phoneNo: '',
      iataNo: '',
      companyName: '',
      address: '',
      commission: '',
    });
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
    this.router.navigate([`pages/members/${this.routes.agent}`]);
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
