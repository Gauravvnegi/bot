import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Campaign } from '../../data-model/campaign.model';

@Component({
  selector: 'hospitality-bot-edit-content',
  templateUrl: './edit-content.component.html',
  styleUrls: ['./edit-content.component.scss'],
})
export class EditContentComponent implements OnInit {
  @Input() campaignFG: FormGroup;
  @Input() campaignDetails: Campaign;
  @Output() addContent = new EventEmitter();
  modes = ['backdrop', 'edit', 'view'];
  currentMode = 'backdrop';
  constructor() {}

  ngOnInit(): void {
    console.log(this.campaignDetails);
  }

  openAddContent() {
    this.addContent.emit();
  }

  changeMode(mode) {
    this.currentMode = mode;
  }

  deleteContent() {
    this.campaignFG.patchValue({ message: '' });
  }
}
