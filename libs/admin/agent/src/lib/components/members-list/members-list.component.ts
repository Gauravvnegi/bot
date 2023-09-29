import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { AgentModel, AgentResponseModel } from '../../models/agent.model';
import { CompanyService } from 'libs/admin/company/src/lib/services/company.service';

@Component({
  selector: 'hospitality-bot-members-list',
  templateUrl: './members-list.component.html',
  styleUrls: ['./members-list.component.scss'],
})
export class MembersListComponent implements OnInit {
  @Input() controlName: string;
  @Input() type: 'COMPANY' | 'AGENT';
  @Input() label: string;

  createPrompt: string;
  placeholder: string;

  membersOffSet = 0;
  loadingMembers = false;
  noMoreMembers = false;
  membersList: Option[] = [];
  $subscription = new Subscription();
  entityId: string;
  servicesService: any;
  @Output() createMembers = new EventEmitter();

  constructor(
    private agentService: AgentService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getMembers();
    const isAgency = this.label.toLocaleLowerCase().includes('agency');
    this.placeholder =
      this.type === 'COMPANY'
        ? `Select ${isAgency ? 'Agency' : 'Company'}`
        : 'Select Agent';
    this.createPrompt =
      this.type === 'COMPANY'
        ? `+ Add New  ${isAgency ? 'Agency' : 'Company'}`
        : '';
  }

  /**
   * @function getMembers
   * @description get Members from server
   */
  getMembers() {
    this.loadingMembers = true;
    if (this.type === 'COMPANY')
      this.$subscription.add(
        this.agentService
          .getCompanyList(this.getQueryConfig(this.type))
          .subscribe(
            (res) => {
              const data = AgentModel.getCompanyList(res['records']);
              this.membersList = data;
              this.noMoreMembers = data.length < 1;
            },
            (error) => {},
            () => {
              this.loadingMembers = false;
            }
          )
      );
    else
      this.$subscription.add(
        this.agentService
          .getAgentList(this.getQueryConfig(this.type))
          .subscribe(
            (res) => {
              const data = new AgentResponseModel().deserialize(res);
              this.membersList = data.records.map((item) => ({
                label: item.name,
                value: item.id,
              }));
              this.noMoreMembers = this.membersList.length < 1;
            },
            (error) => {},
            () => {
              this.loadingMembers = false;
            }
          )
      );
  }

  /**
   * @function loadMoreMembers
   * @description load more Members from server
   * @returns void
   */
  loadMoreMembers() {
    this.membersOffSet = this.membersOffSet + 10;
    this.getMembers();
  }

  /**
   * @function searchMembers
   * @description search Members from server
   * @param {string} text
   */
  searchMembers(text: string) {
    this.loadingMembers = true;
    if (text.length) {
      if (this.type === 'COMPANY')
        this.$subscription.add(
          this.companyService
            .searchCompany({ params: `?key=${text}&type=${this.type}` })
            .subscribe((res) => {
              const data = AgentModel.getCompanyList(res);
              this.membersList = data;
              this.loadingMembers = false;
            })
        );
      else {
        this.$subscription.add(
          this.agentService
            .searchAgent({ params: `?key=${text}&type=${this.type}` })
            .subscribe((res) => {
              const data =
                res.map((item) => new AgentModel().deserialize(item)) ?? [];
              this.membersList = data.map((item) => ({
                label: item.name,
                value: item.id,
              }));
              this.loadingMembers = false;
            })
        );
      }
    } else {
      this.membersOffSet = 0;
      this.membersList = [];
      this.getMembers();
    }
  }

  /**
   * @function createNewMember
   * @description navigate to create category page
   * @returns void
   */
  createNewMember(event) {
    this.createMembers.emit();
  }

  getQueryConfig(type = 'AGENT'): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: type,
        },
      ]),
    };
    return config;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
