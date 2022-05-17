import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { templateConfig } from '../../constants/template';
import { Topics } from '../../data-models/templateConfig.model';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent implements OnInit {
  private $subscription = new Subscription();
  @Input() hotelId: string;
  @Input() templateForm: FormGroup;
  @Input() templateType: string;
  @Output() change = new EventEmitter();
  selectedTopic = templateConfig.selectedTopic.all;
  topicList = [];
  templateTopicList = [];

  constructor(
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getTopicList();
    this.getTemplateForAllTopics();
  }

  ngOnChanges() {}

  /**
   * @function getTopicList function to get topic list.
   */
  getTopicList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          limit: templateConfig.topicConfig.limit,
          entityState: templateConfig.topicConfig.active,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTopicList(this.hotelId, config).subscribe(
        (response) => {
          this.topicList = new Topics().deserialize(response).records;
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  /**
   * @function getTemplateForAllTopics function to get template for all topics.
   */
  getTemplateForAllTopics() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.rowsPerPage.limit,
          templateType: this.templateType,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTemplateListByTopic(this.hotelId, config)
        .subscribe((response) => {
          this.templateTopicList = response;
        })
    );
  }

  /**
   * @function getTemplateByTopicId function to get template by topic id.
   * @param topic topic data.
   */
  getTemplateByTopicId(topic) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.rowsPerPage.limit,
          templateType: this.templateType,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTemplateListByTopicId(this.hotelId, topic.id, config)
        .subscribe((response) => {
          this.templateTopicList = [
            {
              templates: response.records,
              topicId: topic.id,
              topicName: topic.name,
              totalTemplate: response.total,
            },
          ];
        })
    );
  }

  /**
   * @function setTemplate function to set template.
   */
  setTemplate(event) {
    this.change.emit(event);
  }

  /**
   * @function goBack function to go back to previous page.
   */
  goBack() {
    this.change.emit({ status: false });
  }
}
