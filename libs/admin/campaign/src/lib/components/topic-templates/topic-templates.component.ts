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

@Component({
  selector: 'hospitality-bot-topic-templates',
  templateUrl: './topic-templates.component.html',
  styleUrls: ['./topic-templates.component.scss'],
})
export class TopicTemplatesComponent implements OnInit, OnDestroy {
  @Input() template;
  @Input() hotelId: string;
  @Input() templateType: string;
  @Output() selectedTemplate = new EventEmitter();
  loading: boolean;
  offset = 0;
  private $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private templateService: CampaignService,
    private _snackbarService: SnackBarService,
    protected _translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * @function loadData To load data for the table after any event.
   */
  loadData() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          offset: this.offset + campaignConfig.templateCard.limit,
          limit: campaignConfig.templateCard.limit,
          entityState: campaignConfig.topicConfig.active,
          templateType: this.templateType,
        },
      ]),
    };

    this.$subscription.add(
      this.templateService
        .getTemplateListByTopicId(this.hotelId, this.template.topicId, config)
        .subscribe(
          (response) => {
            this.template.templates = [
              ...this.template.templates,
              ...response.records,
            ];
          },
          ({ error }) => {
            this.loading = false;
            this._snackbarService
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
  selectTemplate(template) {
    this.selectedTemplate.emit({ status: true, data: template });
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
