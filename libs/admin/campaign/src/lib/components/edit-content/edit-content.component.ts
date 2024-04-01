import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { campaignConfig } from '../../constant/campaign';
import { CampaignType, TemplateMode } from '../../types/campaign.type';

@Component({
  selector: 'hospitality-bot-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
})
export class EditContentComponent implements OnInit {
  campaignFG: FormGroup;
  @Input() controlName: string;
  @Input() viewMode = false;
  @Input() campaignType: CampaignType;
  modes = campaignConfig.modes;
  currentMode: TemplateMode = 'backdrop';

  @Output() selectedMode = new EventEmitter();
  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.campaignFG = this.controlContainer.control as FormGroup;
  }

  /**
   * @function changeMode function to change mode.
   * @param mode param to store current mode.
   */
  changeMode(mode: TemplateMode) {
    this.currentMode = mode;
    this.selectedMode.emit(mode);
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
