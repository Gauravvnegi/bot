import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminUtilityService, Option } from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { CampaignService } from '../../services/campaign.service';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { TemplateType } from '../../types/campaign.type';
import { TopicTemplatesData } from '../../types/template.type';
import { map, tap } from 'rxjs/operators';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent implements OnInit, OnDestroy {
  private $subscription = new Subscription();
  templateForm: FormGroup;
  entityId: string;
  templateTypes = campaignConfig.datatable.templateTypes;

  topicList: Observable<Option[]>;
  templateTopicList: Observable<TopicTemplatesData[]>;
  selectedTopic: string;

  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private campaignService: CampaignService,
    protected _translateService: TranslateService,
    private globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    this.getTemplateForAllTopics();
  }

  initForm() {
    this.templateForm = this.fb.group({
      template: [''],
      topic: [''],
    });
  }

  initDetails() {
    this.entityId = this.globalFilterService.entityId;
    this.topicList = this.campaignService.mapTopicList(this.entityId);
    this.listenChanges();
  }

  listenChanges() {
    this.listenForTopicChanges();
    this.listenForTemplateChanges();
    this.listenForTemplateType();
  }

  listenForTemplateType() {
    this.campaignService.templateData.subscribe((res) => {
      if (res) this.inputControls.template.patchValue(res);
    });
  }

  listenForTopicChanges() {
    this.inputControls.topic.valueChanges.subscribe((res) =>
      this.getTemplateByTopicId(res)
    );
  }

  listenForTemplateChanges() {
    this.inputControls.template.valueChanges.subscribe((res) =>
      this.templateTypeSelection(res)
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
          templateType: this.inputControls.template.value,
        },
      ]),
    };

    this.templateTopicList = this.campaignService
      .getTemplateByContentType(this.entityId, config)
      .pipe(map((response) => response));
  }

  /**
   * @function getTemplateByTopicId function to get template across a particular topic id.
   * @param topic topic data.
   */
  getTemplateByTopicId(topicId: string) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: campaignConfig.topicConfig.active,
          limit: campaignConfig.templateCard.limit,
          templateType: this.inputControls.template.value,
        },
      ]),
    };
    this.templateTopicList = this.campaignService
      .getTemplateListByTopicId(this.entityId, topicId, config)
      .pipe(
        map((response) => [
          {
            templates: response.records,
            topicId: response.topicId,
            topicName: response.topicName,
            totalTemplate: response.total,
          },
        ])
      );
  }

  /**
   * @function templateTypeSelection function to select template type.
   * @param value template type value.
   */
  templateTypeSelection(value: TemplateType) {
    this.inputControls.template.patchValue(value);
    this.selectedTopic = campaignConfig.chipValue.all;
    this.getTemplateForAllTopics();
  }



  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get inputControls() {
    return this.templateForm.controls as Record<
      keyof { topic: string; template: string },
      AbstractControl
    >;
  }
}
