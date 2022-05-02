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
  @Input() template = '';
  @Input() disabled = false;
  @Input() hybrid = true;

  @ViewChild('plainTextControl') plainTextControl;
  richText = true;
  ckeConfig = {
    readOnly:false,
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
  };
  constructor() {}

  ngOnInit(): void {
    this.ckeConfig['readOnly'] = this.disabled;
  }

  ngOnChanges() {
    this.ckeConfig['readOnly'] = this.disabled;
  }

  changeField(value: boolean) {
    this.richText = value;
  }

  onTemplateChange(value) {
    this.parentFG.get(this.name).setValue(value);
  }
}
