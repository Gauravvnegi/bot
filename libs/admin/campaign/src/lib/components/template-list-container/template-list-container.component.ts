import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AdminUtilityService,
  ModuleNames,
  Option,
} from '@hospitality-bot/admin/shared';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { CampaignService } from '../../services/campaign.service';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import {
  CampaignForm,
  CampaignType,
  TemplateType,
} from '../../types/campaign.type';
import { TopicTemplatesData } from '../../types/template.type';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { ActivatedRoute } from '@angular/router';

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
  templateTopicList: TopicTemplatesData[];

  selectedTopic: string;
  campaignForm: CampaignForm;

  loading = false;

  campaignType: CampaignType;
  constructor(
    private fb: FormBuilder,
    private adminUtilityService: AdminUtilityService,
    private campaignService: CampaignService,
    protected _translateService: TranslateService,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private routesConfigService: RoutesConfigService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.initDetails();
    this.listenForRouteData();
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

  listenForRouteData() {
    this.$subscription.add(
      this.activatedRoute.queryParams.subscribe((res) => {
        if (res.campaignType) {
          this.campaignType = res.campaignType;
        }
        if (res.formData) {
          const formData = JSON.parse(atob(res.formData));
          this.campaignForm = formData as CampaignForm;
          if (this.campaignType === 'EMAIL')
            this.inputControls?.template.patchValue(
              this.campaignForm?.template
            );
          this.inputControls?.topic.patchValue(this.campaignForm.topic, {
            emitEvent: false,
          });
          this.getTemplateByTopicId(this.campaignForm.topic);
        }
        this.getTemplateForAllTopics();
      })
    );
  }

  listenChanges() {
    this.listenForTopicChanges();
    this.listenForTemplateChanges();
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

  selectedTemplate(template: { templateId: string; htmlTemplate: string }) {
    this.campaignForm = {
      ...this.campaignForm,
      message: template.htmlTemplate,
      templateId: template.templateId,
    };
    const queryParams = {
      campaignType: this.campaignType,
      formData: btoa(JSON.stringify(this.campaignForm)),
    };

    this.routesConfigService.navigate({
      subModuleName: ModuleNames.CAMPAIGN,
      additionalPath: 'create-campaign',
      queryParams,
    });
  }

  /**
   * @function getTemplateForAllTopics function to get template across respective topic.
   */
  getTemplateForAllTopics() {
    this.loading = true;
    this.$subscription.add(
      this.campaignService
        .getTemplateByContentType(this.entityId, this.getConfig())
        .subscribe(
          (response) => {
            if (response) {
              this.templateTopicList = response;
            }
          },
          (error) => (this.loading = false),
          () => (this.loading = false)
        )
    );
  }

  /**
   * @function getTemplateByTopicId function to get template across a particular topic id.
   * @param topic topic data.
   */
  getTemplateByTopicId(topicId: string) {
    if (topicId?.length) {
      this.loading = true;
      this.$subscription.add(
        this.campaignService
          .getTemplateListByTopicId(this.entityId, topicId, this.getConfig())
          .subscribe(
            (response) => {
              this.templateTopicList = [
                {
                  templates: response.records,
                  topicId: response.topicId,
                  topicName: response.topicName,
                  totalTemplate: response.total,
                },
              ];
            },
            (error) => (this.loading = false),
            () => (this.loading = false)
          )
      );
    }
  }

  getConfig() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: campaignConfig.topicConfig.active,
          limit: campaignConfig.templateCard.limit,
          templateType:
            this.campaignType === 'EMAIL'
              ? this.inputControls.template.value
              : undefined,
          entityType: this.campaignType === 'WHATSAPP' ? 'WHATSAPP' : undefined,
        },
      ]),
    };
    return config;
  }

  /**
   * @function templateTypeSelection function to select template type.
   * @param value template type value.
   */
  templateTypeSelection(value: TemplateType) {
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
