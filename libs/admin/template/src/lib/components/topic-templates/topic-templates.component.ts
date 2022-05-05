import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService, sharedConfig } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Observable, Subscription } from 'rxjs';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-topic-templates',
  templateUrl: './topic-templates.component.html',
  styleUrls: ['./topic-templates.component.scss']
})
export class TopicTemplatesComponent implements OnInit {

  @Input() topic:string;
  @Input() type:string;
  hotelId: string;
  globalQueries = [];
  loading: boolean;
  templateList: any;
  first=0;
  rowsPerPage = 1;
  totalRecords;
  showbutton:boolean=true;
  private $subscription = new Subscription();
  
  constructor(
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {}

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
        },
      ]);
    });
  }

 sendTopicParam(){
    let typeOfTemplate:string;
    if(this.type)
    {
      typeOfTemplate='SAVEDTEMPLATE';
    }
    else{
      typeOfTemplate='PREDESIGNTEMPLATE';
    }
    return typeOfTemplate;
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
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  updateRecord(data) {
    data.map((item)=>{
      this.totalRecords=item.totalTemplate;
    });
    this.templateList = data;
  }

  loadData(): void {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(
        {
          limit: this.setLimits(),
          templateType:  this.sendTopicParam(),
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

  setLimits(){
    this.rowsPerPage+=this.rowsPerPage;
    if(this.totalRecords === this.rowsPerPage){
      this.showbutton=false;
    }
    
    return this.rowsPerPage;
  }

  fetchDataFrom(
    queries,
    defaultProps = {limit: this.rowsPerPage ,templateType: this.sendTopicParam()}
  ): Observable<any> {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([defaultProps]),
    };
    return this.templateService.getTemplateListByTopic(config, this.hotelId);
  }

}
