import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  Option,
  QueryConfig,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { AgentService } from '../../services/agent.service';
import { AgentModel } from '../../models/agent.model';
import { CompanyService } from 'libs/admin/company/src/lib/services/company.service';

@Component({
  selector: 'hospitality-bot-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss'],
})
export class CompanyListComponent implements OnInit {
  @Input() controlName: string;
  @Input() type: string;
  categoryOffSet = 0;
  loadingCompany = false;
  noMoreCompany = false;
  companyList: Option[] = [];
  $subscription = new Subscription();
  entityId: string;
  servicesService: any;
  @Output() createCompany = new EventEmitter();

  constructor(
    private agentService: AgentService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private companyService: CompanyService
  ) {}

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId;
    this.getCompany();
  }
  /**
   * @function getCompany
   * @description get Company from server
   */
  getCompany() {
    this.loadingCompany = true;
    this.loadingCompany = true;
    this.$subscription.add(
      this.agentService
        .getCompanyList(this.getQueryConfig('COMPANY'))
        .subscribe(
          (res) => {
            const data = AgentModel.getCompanyList(res['records']);
            this.companyList = [...data];
            // this.noMoreCompany = data.length < this.companyLimit;
          },
          (error) => {},
          () => {
            this.loadingCompany = false;
          }
        )
    );
  }

  /**
   * @function loadMoreCompany
   * @description load more Company from server
   * @returns void
   * @memberof CategoryComponent
   */
  loadMoreCompany() {
    this.categoryOffSet = this.categoryOffSet + 10;
    this.getCompany();
  }

  /**
   * @function searchCompany
   * @description search Company from server
   * @param {string} text
   */
  searchCompany(text: string) {
    this.loadingCompany = true;
    if (text) {
      this.$subscription.add(
        this.companyService
          .searchCompany({ params: `?key=${text}&type=${this.type}` })
          .subscribe((res) => {
            const data = AgentModel.getCompanyList(res['records']);
            this.companyList = [...this.companyList, ...data];
            this.loadingCompany = false;
          })
      );
    } else {
      this.categoryOffSet = 0;
      this.companyList = [];
      this.getCompany();
    }
  }

  /**
   * @function createCompany
   * @description navigate to create category page
   * @returns void
   */
  createNewCompany(event) {
    this.createCompany.emit();
  }

  getQueryConfig(type = 'AGENT'): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: type,
          // offset: this.categoryOffSet,
        },
      ]),
    };
    return config;
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
