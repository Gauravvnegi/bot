import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Observable, Subscription } from 'rxjs';
import {
  AdminUtilityService,
  sharedConfig,
} from '@hospitality-bot/admin/shared';
import { TemplateService } from '../../services/template.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FormGroup } from '@angular/forms';
import { Topics } from '../../data-models/templateConfig.model';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent implements OnInit {
  hotelId: string;
  private $subscription = new Subscription();
  templateData = '';
  template = '';
  globalQueries = [];
  topicList = [];
  topic = 'All';
  loading: boolean;
  rowsPerPage = 1;
  templateList: any;
  topicTemplate;

  @Input() templateForm: FormGroup;
  @Input() templateType = false;
  @Output() change = new EventEmitter();

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
      this.getTopicList(this.hotelId);
      this.loadInitialData([
        {
          order: sharedConfig.defaultOrder,
          // entityType: this.tabFilterItems[this.tabFilterIdx]?.value,
        },
        // ...this.getSelectedQuickReplyFilters(),
      ]);
    });
  }

  loadInitialData(queries = [], loading = true): void {
    this.loading = loading && true;
    this.$subscription.add(
      this.fetchDataFrom(queries).subscribe(
        (data) => {
          this.templateList = data;
          this.loading = false;
        },
        ({ error }) => {
          this.loading = false;
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
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
    return this.templateService.getTemplateListByTopic(config, this.hotelId);
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getTopicList(hotelId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: 'ACTIVE', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTopicList(hotelId, config).subscribe(
        (response) =>
          (this.topicList = new Topics().deserialize(response).records),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  openTopicTemplates(topicId?: string) {
    if (topicId) {
      this.topic = topicId;
      this.templateList.map((item) => {
        if (this.topic === item.topicId) {
          this.topicTemplate = {
            id: item.topicId,
            name: item.topicName,
            totalRecords: item.totalTemplate,
          };
        }
      });
    } else {
      this.topic = 'All';
    }
  }
  sendTopicParam() {
    let typeOfTemplate: string;
    if (this.templateType) {
      typeOfTemplate = 'SAVEDTEMPLATE';
    } else {
      typeOfTemplate = 'PREDESIGNTEMPLATE';
    }
    return typeOfTemplate;
  }

  goBack() {
    this.change.emit();
  }
}
