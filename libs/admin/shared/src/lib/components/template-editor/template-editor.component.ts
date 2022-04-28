import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Input() name: string;
  @ViewChild('plainTextControl') plainTextControl;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  richText = true;
  @Input() template = '';
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges() {}

  changeField(value: boolean) {
    this.richText = value;
  }

  onTemplateChange(value) {
    this.parentFG.get(this.name).setValue(value);
  }
}
