import { Component } from '@angular/core';
import {
  AdminUtilityService,
  BaseDatatableComponent,
  Cols,
  TableService,
} from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { LazyLoadEvent } from 'primeng/api';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router } from '@angular/router';
import { QueryConfig } from '@hospitality-bot/admin/library';
import { title, filters, TableValue, chips, cols } from '../../constants/datatable';
import { agentRecords, companyRecords } from '../../constants/response';

@Component({
  selector: 'hospitality-bot-booking-source-data-table',
  templateUrl: './booking-source-data-table.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './booking-source-data-table.component.scss'
  ],
})
export class BookingSourceDataTableComponent extends BaseDatatableComponent {
  entityId: string;
  $subscription = new Subscription();
  cols: Cols[] = cols[TableValue.COMPANY];
  tableName = title;
  tabFilterItems = filters;
  tabFilterIdx = 0;
  selectedTable: TableValue;
  filterChips = chips;
  isQuickFilters = true;

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private router: Router
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.entityId = this.globalFilterService.entityId; 
    this.selectedTable = TableValue.COMPANY;
    this.getDataTableValue(this.selectedTable);
    // this.bookingSourceService.selectedTable.subscribe((value)=>{
    //   this.tabFilterIdx = this.tabFilterItems.findIndex(
    //     (item) => item.value === value  
    //   );
    //   this.selectedTable = value;
    //   this.getDataTableValue(this.selectedTable);
    // }) 
  }

  listenToTableChange(){

  }

  loadData(event: LazyLoadEvent): void{
    this.getDataTableValue(this.selectedTable);
  }

  initTableDetails = () =>{
    console.log(this.selectedTable);
    this.cols = cols[this.selectedTable];
  }

  getQueryConfid(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        ...this.geltSelectedQuickReplyFilters(),
        {
          type: this.selectedTable,
          offset: this.first,
          limit: this.rowsPerPage,
        },
      ]),
    };
    return config;
  }

  geltSelectedQuickReplyFilters(){
    const chips = this.filterChips.filter(
      (item) => item.isSelected && item.value !== 'ALL'
    );
    return [
      chips.length !== 1
        ? {status: null}
        : {status: chips[0].value === 'ACTIVE'},
    ]
  }

  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    // this.roomService.selectedTable.next(
    //   this.tabFilterItems[event.index].value
    // );
    this.tabFilterIdx = event.index;
    console.log(this.tabFilterIdx);
    this.selectedTable = this.tabFilterIdx ? TableValue.AGENT : TableValue.COMPANY;
  }

  editBookingSource(){
    // if(this.selectedTable === TableValue.COMPANY){
    //   this.router.navigate([`/pages/library/services/booking-source`])
    // } 
  }


  getDataTableValue(table: TableValue): void{
    console.log(agentRecords);
    console.log(companyRecords);
    // this.loading = true;
    if(table === TableValue.AGENT){
      this.values = agentRecords;
      this.initTableDetails;
    }
    if(table === TableValue.COMPANY){
      this.values = companyRecords;
      this.initTableDetails;
    }
  }

  handleAgentStatus(status, id: string): void{
    this.loading = true;
    this.$subscription.add(

    )
  }

  handleCompanyStatus(status, id: string): void{
    
  }

    /**
   * @function exportCSV To export CSV report of the table.
   */
    exportCSV(): void {
      this.loading = true;
  
      const config: QueryConfig = {
        params: this.adminUtilityService.makeQueryParams([
          ...this.selectedRows.map((item) => ({ ids: item.id })),
        ]),
      };
      // this.$subscription.add(
      //   this.bookingService
      //     .exportCSV(this.entityId, this.selectedTable, config)
      //     .subscribe((res) => {
      //       FileSaver.saveAs(
      //         res,
      //         `${this.tableName.toLowerCase()}_export_${new Date().getTime()}.csv`
      //       );
      //       this.loading = false;
      //     })
      // );
    }

  /**
   * @function handleError to show the error
   * @param param0 network error
   */
  handleError = ({ error }): void => {
    this.loading = false;
  };

  handleFinal = () => {
    this.loading = false;
  };

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
