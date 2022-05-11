import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-topic-templates',
  templateUrl: './topic-templates.component.html',
  styleUrls: ['./topic-templates.component.scss'],
})
export class TopicTemplatesComponent implements OnInit {
  @Input() template;
  @Input() hotelId: string;
  @Input() templateType: string;
  @Output() selectedTemplate = new EventEmitter();
  loading: boolean;
  offset = 0;
  limit = 3;
  private $subscription = new Subscription();

  constructor(
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {}

  loadData() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          offset: this.offset + this.limit,
          limit: this.limit,
          entityState: 'ACTIVE',
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

  selectTemplate(template) {
    this.selectedTemplate.emit({ status: true, data: template });
  }
}
