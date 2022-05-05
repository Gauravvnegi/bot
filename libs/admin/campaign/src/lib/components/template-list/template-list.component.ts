import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { camapign } from '../../constant/demo-data';

@Component({
  selector: 'hospitality-bot-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class TemplateListComponent implements OnInit {
  templateTypes = [
    { name: 'Saved Template', type: 'SAVEDTEMPLATE' },
    { name: 'Pre-defined Template', type: 'PREDESIGNTEMPLATE' },
  ];
  @Input() selectedTemplate: string = '';
  templateData = camapign.templateData;
  @Output() templateSelection = new EventEmitter();
  @Output() changeStep = new EventEmitter();
  constructor() {}

  ngOnInit(): void {
    console.log(this.selectedTemplate);
  }

  goBack() {
    this.changeStep.emit({ step: 'previous' });
  }

  templateTypeSelection(value) {
    this.selectedTemplate = value;
  }

  selectTemplate(template) {
    this.templateSelection.emit(template);
  }
}
