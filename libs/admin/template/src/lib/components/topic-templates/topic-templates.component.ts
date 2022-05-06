import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
} from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Observable, Subscription } from 'rxjs';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-topic-templates',
  templateUrl: './topic-templates.component.html',
  styleUrls: ['./topic-templates.component.scss'],
})
export class TopicTemplatesComponent implements OnInit {
  @Input() topic = {};
  @Input() type: boolean;
  hotelId: string;
  globalQueries = [];
  loading: boolean;
  templateList = [];
  rowsPerPage = 1;
  page = 0;
  totalRecords;
  name: string;
  showbutton: boolean = true;
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
          offset: this.page,
        },
      ]);
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

  sendTopicParam() {
    let typeOfTemplate: string;
    if (this.type) {
      typeOfTemplate = 'SAVEDTEMPLATE';
    } else {
      typeOfTemplate = 'PREDESIGNTEMPLATE';
    }
    return typeOfTemplate;
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  updateRecord(data) {
    this.name = this.topic['name'];
    this.templateList = data;
  }

  loadData(): void {
    this.loadInitialData([
      {
        offset: this.page + this.rowsPerPage,
      },
    ]);
    this.page++;
  }

  fetchDataFrom(
    queries,
    defaultProps = {
      limit: this.rowsPerPage,
      templateType: this.sendTopicParam(),
    }
  ): Observable<any> {
    queries.push(defaultProps);
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams(queries),
    };
    return this.templateService.getTemplateListByTopicId(
      config,
      this.hotelId,
      this.topic['id']
    );
  }
}
