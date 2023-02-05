import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-export-list',
  templateUrl: './export-list.component.html',
  styleUrls: ['./export-list.component.scss'],
})
export class ExportListComponent {
  @Output() onDocumentActions = new EventEmitter();
  @Input() documentTypes: { label: string; value: string }[];
  @Input() documentActionTypes: {
    label: string;
    value: string;
    type: string;
    defaultLabel: string;
  }[];

  /**
   * documentActions is used for Data table control
   */
  @Input() public controlName: string = 'documentActions';

  constructor(public controlContainer: ControlContainer) {}

  handleSubmission() {
    this.onDocumentActions.emit();
  }
}
