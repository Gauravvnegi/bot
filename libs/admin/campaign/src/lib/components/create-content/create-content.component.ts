import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { campaignConfig } from '../../constant/campaign';
import { NavRouteOptions } from '@hospitality-bot/admin/shared';
import { Campaign } from '../../data-model/campaign.model';
@Component({
  selector: 'hospitality-bot-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  @Input() campaignId: string;
  @Input() campaign: Campaign;

  draftDate: number | string = Date.now();
  pageTitle = 'Create Content';
  navRoutes: NavRouteOptions = [
    { label: 'Marketing', link: './' },
    { label: 'Campaign', link: '/pages/marketing/campaign' },
    { label: 'Create Campaign', link: './' },
    { label: 'Create Content', link: './' },
  ];

  @Output() changeStep = new EventEmitter();

  constructor() {}

  ngOnInit(): void {
    if (this.campaignId) {
      this.pageTitle = 'Edit Content';
      this.navRoutes[2].label = 'Edit Campaign';
      this.navRoutes[3].label = 'Edit Content';
    }
    this.draftDate = this.campaign?.updatedAt ?? this.campaign?.createdAt;
  }

  /**
   * @function goBack function to go back on previous page.
   */
  goBack() {
    this.changeStep.emit({ step: 'previous' });
  }

  /**
   * @function campaignConfiguration campaign config.
   */
  get campaignConfiguration() {
    return campaignConfig;
  }

  /**
   * @function openTemplateList function to open template list.
   */
  openTemplateList(type: string) {
    this.changeStep.emit({ step: 'next', templateType: type });
  }
}
