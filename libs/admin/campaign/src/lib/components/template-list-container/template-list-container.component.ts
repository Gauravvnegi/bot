import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Topics } from '../../data-model/email.model';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent implements OnInit {
  private $subscription = new Subscription();
  @Input() hotelId: string;
  @Input() templateType: string;
  @Output() change = new EventEmitter();
  templateTypes = [
    { name: 'Saved Template', type: 'SAVEDTEMPLATE' },
    { name: 'Pre-defined Template', type: 'PREDESIGNTEMPLATE' },
  ];
  selectedTopic = 'ALL';
  topicList = [];
  templateTopicList = [];
  constructor(
    private adminUtilityService: AdminUtilityService,
    private campaignService: CampaignService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.getTopicList();
    this.getTemplateForAllTopics();
  }

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
      this.campaignService.getTopicList(this.hotelId, config).subscribe(
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
      this.campaignService
        .getTemplateByContentType(this.hotelId, config)
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

  templateTypeSelection(value) {
    this.templateType = value;
    this.selectedTopic = 'ALL';
    this.getTemplateForAllTopics();
  }

  setTemplate(event) {
    this.change.emit(event);
  }

  goBack() {
    this.change.emit({ status: false });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
