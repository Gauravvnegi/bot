import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { campaignConfig } from '../../constant/campaign';
import { Campaign } from '../../data-model/campaign.model';

@Component({
  selector: 'hospitality-bot-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
})
export class EditContentComponent implements OnInit {
  @Input() campaignFG: FormGroup;
  @Input() campaignDetails: Campaign;
  @Input() viewMode = false;
  @Output() addContent = new EventEmitter();
  modes = campaignConfig.modes;
  currentMode = campaignConfig.currentMode;
  constructor() {}

  ngOnInit(): void {}

  /**
   * @function openAddContent function to add open-content.
   */
  openAddContent() {
    this.addContent.emit();
  }

  /**
   * @function changeMode function to change mode.
   * @param mode param to store current mode.
   */
  changeMode(mode) {
    this.currentMode = mode;
  }

  /**
   * @function campaignConfiguration function to configure campaign.
   */
  get campaignConfiguration() {
    return campaignConfig;
  }

  /**
   * @function deleteContent function to delete content.
   */
  deleteContent() {
    this.campaignFG.patchValue({ message: '' });
  }
}
