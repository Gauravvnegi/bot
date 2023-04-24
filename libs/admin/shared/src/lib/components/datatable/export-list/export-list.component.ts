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
  @Input() isDisable: boolean = false;
  @Input() documentActionTypes: {
    label: string;
    value: string;
    type: string;
    defaultLabel: string;
  }[];

  @Input() additionalActionItems: {
    icon: string;
    value: string;
  }[] = [];

  @Output() onActionsClick = new EventEmitter();

  /**
   * documentActions is used for Data table control
   */
  controlGroupName = 'documentActions';
  documentActionTypeName = 'documentActionType';
  documentTypesName = 'documentType';

  /**
   * To change the setting of control names
   */
  @Input() set formControlName(value: FormControlName) {
    Object.entries(value).forEach(([key, name]) => {
      this[key] = name;
    });
  }

  constructor(public controlContainer: ControlContainer) {}

  handleSubmission() {
    this.onDocumentActions.emit();
  }

  handleActionEmission(value: string) {
    this.onActionsClick.emit(value);
  }
}

type FormControlName = {
  controlGroupName: string;
  documentActionTypeName: string;
  documentTypesName: string;
};
