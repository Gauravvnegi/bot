import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { Subscription } from 'rxjs';
import { camapign } from '../../constant/demo-data';
import { CampaignService } from '../../services/campaign.service';

@Component({
  selector: 'hospitality-bot-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  templateTypes = [
    { name: 'Saved Template', type: 'SAVEDTEMPLATE' },
    { name: 'Pre-defined Template', type: 'PREDESIGNTEMPLATE' },
  ];
  @Input() hotelId: string;
  @Input() selectedTemplate: string = '';
  templateData = [];
  @Output() templateSelection = new EventEmitter();
  @Output() changeStep = new EventEmitter();
  $subscription = new Subscription();
  constructor(
    private _campaignService: CampaignService,
    private _adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.getTemplateList();
  }

  getTemplateList() {
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams([
        {
          limit: 1,
          templateType: this.selectedTemplate,
        },
      ]),
    };
    this.$subscription.add(
      this._campaignService
        .getTemplateByContentType(this.hotelId, config)
        .subscribe((response) => {
          this.templateData = response;
        })
    );
  }

  goBack() {
    this.changeStep.emit({ step: 'previous' });
  }

  templateTypeSelection(value) {
    this.selectedTemplate = value;
    this.getTemplateList();
  }

  selectTemplate(template, topicId) {
    this.templateSelection.emit({ ...template, topicId });
  }
}
