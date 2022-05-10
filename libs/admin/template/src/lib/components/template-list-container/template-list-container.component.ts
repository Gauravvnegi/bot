import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
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

  getTopicList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          limit: 50,
          entityState: 'ACTIVE',
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

  getTemplateForAllTopics() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: 'ACTIVE',
          limit: 3,
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

  getTemplateByTopicId(topic) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: 'ACTIVE',
          limit: 3,
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

  setTemplate(event) {
    this.change.emit(event);
  }

  goBack() {
    this.change.emit({ status: false });
  }
}
