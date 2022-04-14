import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import {
  BaseDatatableComponent,
  sharedConfig,
  TableService,
} from '@hospitality-bot/admin/shared';
import {
  SnackBarService,
  ModalService,
} from '@hospitality-bot/shared/material';
import {
  SelectedEntityState,
  EntityType,
  EntityState,
} from 'libs/admin/dashboard/src/lib/types/dashboard.type';
import { LazyLoadEvent, SortEvent } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { TopicService } from '../../../services/topic.service';
import { Topics } from '../../../data-models/topicConfig.model';
import { topicConfig } from '../../../constants/topic';

@Component({
  selector: 'hospitality-bot-topic-datatable',
  templateUrl: './topic-datatable.component.html',
  styleUrls: [
    '../../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './topic-datatable.component.scss',
  ],
})
export class TopicDatatableComponent extends BaseDatatableComponent
  implements OnInit {
  @Input() tableName = 'Topics';
  @Input() tabFilterItems;
  @Input() tabFilterIdx: number = 0;
  actionButtons = true;
  isQuickFilters = true;
  isTabFilters = true;
  isResizableColumns = true;
  isAutoLayout = false;
  isCustomSort = true;
  triggerInitialData = false;
  rowsPerPageOptions = [5, 10, 25, 50, 200];
  rowsPerPage = 5;
  // cols = topicConfig.datatable.cols;
  globalQueries = [];
  $subscription = new Subscription();
  topicList=[];
  hotelId: any;
  snackbarService: any;

  cols = [
    { field: 'name', header: 'Name', sortType: 'string', isSort: true },
    {
      field: 'description',
      header: 'Description',
      sortType: 'string',
      isSort: true,
    },
    { field: 'status', header: 'Active', isSort: false },
  ];

  constructor(
    public fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    protected tabFilterService: TableService,
    private _router:Router, private route:ActivatedRoute,
    private topicService:TopicService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.tabFilterItems = topicConfig.datatable.tabFilterItems;
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
      // fetch-api for records
      this.loadInitialData([
        ...this.globalQueries,
        {
          order: 'DESC',
        },
      ]);
    });
  }

  getHotelId(globalQueries): void {

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId; 
        // this.hotelId ="0a80105d-0aab-4cf8-8cab-a63ed13f2c38";
      }
    });
  }

  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.values= new Topics().deserialize(data).records;
          // this.values = data.records;
          //set pagination
          this.totalRecords = data.total;
          data.entityTypeCounts &&
          this.updateTabFilterCount(data.entityTypeCounts, this.totalRecords);
        data.entityStateCounts &&
          this.updateQuickReplyFilterCount(data.entityStateCounts);
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  updateTabFilterCount(countObj: EntityType, currentTabCount: number): void {
    if (countObj) {
      this.tabFilterItems.forEach((tab) => {
        tab.total = countObj[tab.value];
      });
    } else {
      this.tabFilterItems[this.tabFilterIdx].total = currentTabCount;
    }
  }

  updateQuickReplyFilterCount(countObj: EntityState): void {
    if (countObj) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        chip.total = countObj[chip.value];
      });
    }
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.topicService.getHotelTopic(config,this.hotelId);
  }


  getTopicList(hotelId){
    this.$subscription.add(
      this.topicService.getTopicList(hotelId).subscribe((response)=>{
        this.topicList= response;
      })
    )
  }

  openCreateTopic(){
    this._router.navigate(['create'],{relativeTo :this.route});
  }

  openTopicDetails(amenity): void {
    this._router.navigate([`create/${amenity.id}`], { relativeTo: this.route });
  }

  getSelectedQuickReplyFilters(): SelectedEntityState[] {
    return this.tabFilterItems[this.tabFilterIdx].chips
      .filter((item) => item.isSelected == true)
      .map((item) => ({
        entityState: item.value,
      }));
  }

  /**
   * @function loadData To load data for the table after any event.
   * @param event The lazy load event for the table.
   */
  loadData(event: LazyLoadEvent): void {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          ...this.globalQueries,
          {
            order: 'DESC',
          },
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
        }
      ).subscribe(
        (data) => {
          this.values = new Topics().deserialize(data).records;
          // this.values = data.records;
          //set pagination
          this.totalRecords = data.total;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  /**
   * @function updatePaginations To update the pagination variable values.
   * @param event The lazy load event for the table.
   */
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
    // this.tempFirst = this.first;
    // this.tempRowsPerPage = this.rowsPerPage;
  }

  /**
   * @function customSort To sort the rows of the table.
   * @param eventThe The event for sort click action.
   */
  customSort(event: SortEvent): void {
    const col = this.cols.filter((data) => data.field === event.field)[0];
    let field =
      event.field[event.field.length - 1] === ')'
        ? event.field.substring(0, event.field.lastIndexOf('.') || 0)
        : event.field;
    event.data.sort((data1, data2) =>
      this.sortOrder(event, field, data1, data2, col)
    );
  }

  /**
   * @function onSelectedTabFilterChange To handle the tab filter change.
   * @param event The material tab change event.
   */
  onSelectedTabFilterChange(event: MatTabChangeEvent): void {
    this.tabFilterIdx = event.index;
    this.changePage(+this.tabFilterItems[event.index].lastPage);
  }

  /**
   * @function onFilterTypeTextChange To handle the search for each column of the table.
   * @param value The value of the search field.
   * @param field The name of the field across which filter is done.
   * @param matchMode The mode by which filter is to be done.
   */
  onFilterTypeTextChange(
    value: string,
    field: string,
    matchMode = 'startsWith'
  ): void {
    if (!!value && !this.isSearchSet) {
      this.tempFirst = this.first;
      this.tempRowsPerPage = this.rowsPerPage;
      this.isSearchSet = true;
    } else if (!!!value) {
      this.isSearchSet = false;
      this.first = this.tempFirst;
      this.rowsPerPage = this.tempRowsPerPage;
    }

    value = value && value.trim();
    this.table.filter(value, field, matchMode);
  }

  /**
   * @function exportCSV To export CSV report of the table.
   */
  exportCSV(): void {
    this.loading = true;

    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        ...this.globalQueries,
        {
          order: sharedConfig.defaultOrder,
          entityType: this.tabFilterItems[this.tabFilterIdx].value,
        },
        ...this.getSelectedQuickReplyFilters(),
        ...this.selectedRows.map((item) => ({ ids: item.booking.bookingId })),
      ]),
    };
    this.$subscription.add();
  }

  /**
   * @function toggleQuickReplyFilter To handle the chip click for a tab.
   * @param quickReplyTypeIdx The chip index.
   * @param quickReplyType The chip type.
   */
  toggleQuickReplyFilter(quickReplyTypeIdx: number, quickReplyType): void {
    //toggle isSelected
    if (quickReplyTypeIdx == 0) {
      this.tabFilterItems[this.tabFilterIdx].chips.forEach((chip) => {
        if (chip.value !== 'ALL') {
          chip.isSelected = false;
        }
      });
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    } else {
      this.tabFilterItems[this.tabFilterIdx].chips[0].isSelected = false;
      this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected = !this.tabFilterItems[this.tabFilterIdx].chips[
        quickReplyTypeIdx
      ].isSelected;
    }

    this.changePage(0);
  }

  get topicConfiguration() {
    return topicConfig;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
