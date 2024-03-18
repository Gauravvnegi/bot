import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { campaignConfig } from '../../constant/campaign';
import { CampaignService } from '../../services/campaign.service';
import { TemplateData, TopicTemplatesData } from '../../types/template.type';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { CampaignForm } from '../../types/campaign.type';

@Component({
  selector: 'hospitality-bot-topic-templates',
  templateUrl: './topic-templates.component.html',
  styleUrls: ['./topic-templates.component.scss'],
})
export class TopicTemplatesComponent implements OnInit, OnDestroy {
  readonly campaignConfiguration = campaignConfig;

  @Input() template: TopicTemplatesData;
  @Input() entityId: string;
  parentFG: FormGroup;
  loading: boolean;
  offset = 0;
  private $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private templateService: CampaignService,
    private snackbarService: SnackBarService,
    protected _translateService: TranslateService,
    private controlContainer: ControlContainer
  ) {}

  ngOnInit(): void {
    this.parentFG = this.controlContainer.control as FormGroup;
  }

  /**
   * @function loadData To load data for the table after any event.
   */
  loadData() {
    this.offset = this.offset + campaignConfig.templateCard.limit;
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          offset: this.offset,
          limit: campaignConfig.templateCard.limit,
          entityState: campaignConfig.topicConfig.active,
          templateType: this.inputControls.template.value,
        },
      ]),
    };

    this.$subscription.add(
      this.templateService
        .getTemplateListByTopicId(this.entityId, this.template.topicId, config)
        .subscribe(
          (response) => {
            this.template.templates = [
              ...this.template.templates,
              ...response.records,
            ];
          },
          ({ error }) => {
            this.loading = false;
            this.snackbarService
              .openSnackBarWithTranslate({
                translateKey: 'Cannot load Data',
                priorityMessage: error.message,
              })
              .subscribe();
          }
        )
    );
  }

  /**
   * @function selectTemplate function to select template.
   * @param template template data.
   */
  selectTemplate(template: TemplateData) {
    this.inputControls.message.patchValue(template.htmlTemplate);
  }

  get inputControls() {
    return this.parentFG.controls as Record<
      keyof CampaignForm,
      AbstractControl
    >;
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
