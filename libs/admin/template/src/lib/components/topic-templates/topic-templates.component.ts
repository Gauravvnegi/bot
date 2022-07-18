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
import { templateConfig } from '../../constants/template';
import { TemplateService } from '../../services/template.service';

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
    private templateService: TemplateService,
    private _snackbarService: SnackBarService,
    protected translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * @function loadData To load data for the table after any event.
   */
  loadData() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          offset: this.offset + templateConfig.rowsPerPage.limit,
          limit: templateConfig.rowsPerPage.limit,
          entityState: templateConfig.topicConfig.limit,
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
            this._snackbarService
              .openSnackBarWithTranslate({
                translateKey: 'messages.error.loadData',
                priorityMessage: error.message,
              })
              .subscribe();
          }
        )
    );
  }

  /**
   * @function selectTemplate function to select template.
   * @param template data stores in template object.
   */
  selectTemplate(template) {
    this.selectedTemplate.emit({ status: true, data: template });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
