import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Observable, Subscription } from 'rxjs';
import { AdminUtilityService, sharedConfig } from '@hospitality-bot/admin/shared';
import { TemplateService } from '../../services/template.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import {  FormGroup, } from '@angular/forms';
import { LazyLoadEvent} from 'primeng/api';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss']
})
export class TemplateListContainerComponent implements OnInit {

  hotelId: string;
  private $subscription = new Subscription();
  templateList:any;
  @Input() templateForm: FormGroup;
  templateData = '';
  template = '';
  globalQueries = [];
  loading: boolean;
  values: any;
  totalRecords: any;
  first: any;
  rowsPerPage = 3;
  rowsPerPageOptions = [3, 6, 9, 18];
  startPage: Number;
  paginationLimit: Number;
  @Output() change = new EventEmitter();
  selectedTopic;

  constructor(
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private _snackbarService: SnackBarService,
  ) {
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {  }

  listenForGlobalFilters(): void {
    this.globalFilterService.globalFilter$.subscribe((data) => {
      // set-global query everytime global filter changes
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getHotelId(this.globalQueries);
      this.loadInitialData([
        {
          order: sharedConfig.defaultOrder,
        },
      ]);
    });
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.updateRecord(data);
          //set pagination
          this.totalRecords = data.totalTemplate;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  handleTopicChange(event){
    this.selectedTopic=event.value;
    this.loadInitialData();
  }

  updateRecord(data){
    if(this.selectedTopic)
    {
      data.map((item)=>{
        if(this.selectedTopic === item.topicName){
          console.log(item.topicName);
          this.templateList=[item];
        }
      })
    }
    else{
      this.templateList=data;
    }

  }

  loadData(event?: LazyLoadEvent): void {
    this.loading = true;
    this.updatePaginations(event);
    this.$subscription.add(
      this.fetchDataFrom(
        [
          {
            order: sharedConfig.defaultOrder,
          },
        ],
        {
          offset: this?.first,
          limit: this?.rowsPerPage,
        }
      ).subscribe(
        (data) => {
          this.updateRecord(data);
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }
  updatePaginations(event): void {
    this.first = event.first;
    this.rowsPerPage = event.rows;
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.templateService.getTemplateListByTopic(config, this.hotelId);
  }

  goBack() {
    this.change.emit()
  }
}

