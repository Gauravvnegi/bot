import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { camapign } from '../../constant/demo-data';

@Component({
  selector: 'hospitality-bot-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  templateTypes = [
    { name: 'Saved Template', type: 'SAVED' },
    { name: 'Pre-defined Template', type: 'PREDEFINED' },
  ];
  selectedTemplate = 'SAVED';
  templateData = camapign.templateData;
  @Output() templateSelection = new EventEmitter();
  constructor() {}

  ngOnInit(): void {}

  templateTypeSelection(value) {
    this.selectedTemplate = value;
  }

  selectTemplate(template) {
    this.templateSelection.emit(template);
  }
}
