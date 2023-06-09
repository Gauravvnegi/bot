import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Chip,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { chips, cols, title } from '../../constant/data-table';
import { AgentService } from '../../services/agent.service';
import { Router } from '@angular/router';
import { agentRoutes } from '../../constant/routes';
import { AgentResponse } from '../../types/response';
import * as FileSaver from 'file-saver';
import { AgentList } from '../../models/agent.model';
import { QueryConfig } from '../../types/agent';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-agent-data-table',
  templateUrl: './agent-data-table.component.html',
  styleUrls: [
    './agent-data-table.component.scss',
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
  ],
})
export class AgentDataTableComponent extends BaseDatatableComponent
  implements OnInit, OnDestroy {
  readonly routes = agentRoutes;

  hotelId: string;

  tableName = title;
  cols = cols;
  filterChips = chips;
  iQuickFilters = true;

  subscription$ = new Subscription();

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private globalFilterService: GlobalFilterService,
    private agentService: AgentService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initTableValue();
  }

  initTableValue() {
    this.loading = true;
    this.subscription$.add(
      this.agentService.getAgentList(this.hotelId).subscribe(
        (res) => {
          this.values = new AgentList().deserialize(res).agents;
          this.updateQuickReplyFilterCount(res.entityStateCounts);
          this.updateTotalRecords();
        },
        ({ error }) => {
          this.values = [];
        },
        this.handleFinal
      )
    );
  }

  handleStatus(status: boolean, rowData) {
    rowData.status = status;
    this.loading = true;
    this.subscription$.add(
      this.agentService.updateAgentStatus(this.hotelId, rowData).subscribe(
        (res) => {
          this.values.forEach((item) => {
            if (item.id === rowData.id) item = rowData;
          });
          this.snackbarService.openSnackBarAsText(
            'Status changes successfully',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {
          this.values = [];
        },
        this.handleFinal
      )
    );
  }

  toggleQuickReplyFilter({ chips }: { chips: Chip<string>[] }) {
    const clickedChips = {
      ALL: false,
      ACTIVE: false,
      INACTIVE: false,
    };
    chips.forEach((item: Chip<string>) => {
      clickedChips[item.value] = item.isSelected;
    });
    this.initTableValue();
  }

  /**
   * @function editAgent To edit the agent.
   * @params rowData
   */
  editAgent(rowData: AgentResponse) {
    this.router.navigate([
      `/pages/members/agent/${this.routes.editAgent.route}/${rowData.id}`,
    ]);
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;
    const config: QueryConfig = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.selectedRows.map((item) => ({ ids: item.id })),
        { type: 'Agent' },
      ]),
    };
    this.subscription$.add(
      this.agentService.exportCSV(this.hotelId, config).subscribe((res) => {
        FileSaver.saveAs(
          res,
          `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
        );
        this.loading = false;
      }, this.handleFinal)
    );
  }

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.subscription$.unsubscribe();
  }
}
