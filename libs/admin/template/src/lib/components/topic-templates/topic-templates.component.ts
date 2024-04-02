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
  @Input() entityId: string;
  @Input() templateType: string;
  @Output() selectedTemplate = new EventEmitter();
  loading: boolean;
  offset = 0;
  private $subscription = new Subscription();
  isTemplateLoaded: boolean = false;

  constructor(
    private adminUtilityService: AdminUtilityService,
    private templateService: TemplateService,
    private snackbarService: SnackBarService,
    protected translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.onTemplateLoad();
  }

  /**
   * @function loadData To load data for the table after any event.
   */
  loadData() {
    this.isTemplateLoaded = false;
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          offset: this.offset + templateConfig.rowsPerPage.limit,
          limit: templateConfig.rowsPerPage.limit,
          entityState: 'ACTIVE',
          entityType: 'EMAIL',
          templateType: this.templateType,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTemplateList(this.entityId, config)
        .subscribe((response) => {
          this.template.templates = [
            ...this.template.templates,
            ...response.records,
          ];
          this.onTemplateLoad();
        })
    );
  }

  onTemplateLoad() {
    setTimeout(() => {
      this.isTemplateLoaded = true;
    }, 1000);
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
