import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { Topics } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent implements OnInit, OnDestroy {
  private $subscription = new Subscription();
  @Input() hotelId: string;
  @Input() templateType: string;
  @Output() change = new EventEmitter();
  templateTypes = campaignConfig.datatable.templateTypes;
  topicList = [];
  templateTopicList = [];
  selectedTopic: string;
  constructor(
    private adminUtilityService: AdminUtilityService,
    private campaignService: CampaignService,
    private snackbarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.getTopicList();
    this.getTemplateForAllTopics();
  }

  /**
   * @function getTopicList function to get topic list.
   */
  getTopicList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          limit: campaignConfig.topicConfig.limit,
          entityState: campaignConfig.topicConfig.active,
        },
      ]),
    };
    this.$subscription.add(
      this.campaignService.getTopicList(this.hotelId, config).subscribe(
        (response) => {
          this.topicList = new Topics().deserialize(response).records;
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  /**
   * @function getTemplateForAllTopics function to get template across respective topic.
   */
  getTemplateForAllTopics() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: campaignConfig.topicConfig.active,
          limit: campaignConfig.templateCard.limit,
          templateType: this.templateType,
        },
      ]),
    };
    this.$subscription.add(
      this.campaignService
        .getTemplateByContentType(this.hotelId, config)
        .subscribe((response) => {
          this.templateTopicList = response;
        })
    );
  }

  /**
   * @function getTemplateByTopicId function to get template across a particular topic id.
   * @param topic topic data.
   */
  getTemplateByTopicId(topic) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: campaignConfig.topicConfig.active,
          limit: campaignConfig.templateCard.limit,
          templateType: this.templateType,
        },
      ]),
    };
    this.$subscription.add(
      this.campaignService
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
   * @function templateTypeSelection function to select template type.
   * @param value template type value.
   */
  templateTypeSelection(value) {
    this.templateType = value;
    this.selectedTopic = campaignConfig.chipValue.all;
    this.getTemplateForAllTopics();
  }

  /**
   * @function setTemplate function to set template.
   * @param event event object of set template.
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

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
