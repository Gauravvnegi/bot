import { Component, OnInit } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';

@Component({
  selector: 'hospitality-bot-nested-panel',
  templateUrl: './nested-panel.component.html',
  styleUrls: ['./nested-panel.component.scss'],
})
export class NestedPanelComponent extends FormComponent {
  isPanelCollapsed: boolean = true;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}

  togglePanel(): void {
    this.isPanelCollapsed = !this.isPanelCollapsed;
  }
}
