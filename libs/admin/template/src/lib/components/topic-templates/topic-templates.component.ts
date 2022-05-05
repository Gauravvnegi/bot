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
  hotelId: string;
  globalQueries = [];
  loading: boolean;
  templateList: any;
  first=0;
  rowsPerPage = 1;
  rowsPerPageOptions = [1, 2, 9, 18];

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
    if (this.topic) {
      data.map((item) => {
        if (this.topic === item.topicName) {
          this.templateList = [item];
        }
        else{
          this.templateList = data;
        }
      });
    }
    //  else {
    //   this.templateList = data;
    // }
  }

  loadData(): void {
    this.loading = true;
    this.$subscription.add(
      this.fetchDataFrom(
        [
          {
            order: sharedConfig.defaultOrder,
          },
        ],
        {
          offset: this.first,
          limit: this.rowsPerPage,
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

}
