import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { campaignConfig } from '../../constant/campaign';
@Component({
  selector: 'hospitality-bot-create-content',
  templateUrl: './create-content.component.html',
  styleUrls: ['./create-content.component.scss'],
})
export class CreateContentComponent implements OnInit {
  @Output() changeStep = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

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
