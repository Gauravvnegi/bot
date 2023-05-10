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
  @Input() height: number = 250;
  @Input() isSimpleEditor = false;
  @ViewChild('plainTextControl') plainTextControl;
  richText = true;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*}',
    readOnly: false,
    height: this.height,
    disallowedContent: 'img[src]',
  };

  constructor() {}

  ngOnInit(): void {
    if (this.isSimpleEditor) {
      this.ckeConfig['toolbar'] = [
        ['Bold', 'Italic', 'Strike', 'RemoveFormat'],
        ['NumberedList', 'BulletList', 'BlockQuote', 'Indent', 'Outdent'],
        ['Link', 'Unlink', 'Anchor'],
        ['Format', 'Styles', '-', 'Source'],
      ];
    }

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
