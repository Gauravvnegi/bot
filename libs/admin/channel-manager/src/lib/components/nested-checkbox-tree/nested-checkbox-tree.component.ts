import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';

@Component({
  selector: 'hospitality-bot-nested-checkbox-tree',
  templateUrl: './nested-checkbox-tree.component.html',
  styleUrls: ['./nested-checkbox-tree.component.scss'],
})
export class NestedCheckboxTreeComponent extends FormComponent {
  isPanelCollapsed: boolean = true;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}

  togglePanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }
}
