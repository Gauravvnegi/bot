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
import { CampaignService } from '../../services/campaign.service';
import { TemplateData, TopicTemplatesData } from '../../types/template.type';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';
import { CampaignForm, CampaignType } from '../../types/campaign.type';

@Component({
  selector: 'hospitality-bot-topic-templates',
  templateUrl: './topic-templates.component.html',
  styleUrls: ['./topic-templates.component.scss'],
})
export class TopicTemplatesComponent implements OnInit, OnDestroy {
  parentFG: FormGroup;
  readonly campaignConfiguration = campaignConfig;

  @Input() template: TopicTemplatesData;
  @Input() entityId: string;
  @Input() campaignType: CampaignType;

  @Output() selectedTemplate = new EventEmitter();

  offset = 0;
  loading: boolean;

  private $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private campaignService: CampaignService,
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
    this.loading = true;
    this.campaignType === 'WHATSAPP'
      ? this.loadWhatsappTemplates()
      : this.loadTemplates();
  }

  loadWhatsappTemplates() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: 'ACTIVE',
          offset: this.offset,
          limit: 10,
          entityType: 'WHATSAPP',
        },
      ]),
    };
    this.$subscription.add(
      this.campaignService.getHotelTemplate(config, this.entityId).subscribe(
        (res) => {
          this.template.templates = [
            ...this.template.templates,
            ...res.records,
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

  loadTemplates() {
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
      this.campaignService
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
    this.selectedTemplate.emit({
      templateId: template.id,
      htmlTemplate: template.htmlTemplate,
    });
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
