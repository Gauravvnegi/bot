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
  @Input() height: number = 400;
  @ViewChild('plainTextControl') plainTextControl;
  richText = true;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
    readOnly: false,
    height: this.height,
  };

  constructor() {}

  ngOnInit(): void {
    this.ckeConfig['readOnly'] = this.disabled;
  }

  ngOnChanges() {
    this.ckeConfig['readOnly'] = this.disabled;
    this.ckeConfig['height'] = this.height;
  }

  changeField(value: boolean) {
    this.richText = value;
    if (!value) this.template = this.parentFG.get(this.name).value + '\n';
  }

  onTemplateChange(value) {
    this.parentFG.get(this.name).setValue(value);
  }
}
