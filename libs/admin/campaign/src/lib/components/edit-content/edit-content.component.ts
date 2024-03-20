import { Component, Input, OnInit } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';
import { campaignConfig } from '../../constant/campaign';

@Component({
  selector: 'hospitality-bot-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
})
export class EditContentComponent implements OnInit {
  campaignFG: FormGroup;
  @Input() controlName: string;
  @Input() viewMode = false;
  modes = campaignConfig.modes;
  currentMode = campaignConfig.currentMode;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.campaignFG = this.controlContainer.control as FormGroup;
  }

  /**
   * @function changeMode function to change mode.
   * @param mode param to store current mode.
   */
  changeMode(mode: string) {
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
