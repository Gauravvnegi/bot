import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-template-editor',
  templateUrl: './template-editor.component.html',
  styleUrls: ['./template-editor.component.scss'],
})
export class TemplateEditorComponent implements OnInit {
  parentFG: FormGroup;
  @Input() controlName: string;
  @Input() template = '';
  @Input() disabled = false;
  @Input() hybrid = true;
  @Input() height: number = 250;
  @Input() isSimpleEditor = false;
  @ViewChild('plainTextControl') plainTextControl;
  richText = true;
  ckeConfig = {
    allowedContent: true,
    extraAllowedContent: '*(*);*{*};div(*);a(*)',
    readOnly: false,
    height: this.height,
    disallowedContent: 'img[src]',
  };

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.parentFG = this.controlContainer.control as FormGroup;
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
    if (!value) this.template = this.parentFG.get(this.controlName).value + '\n';
  }

  onTemplateChange(value) {
    this.parentFG.get(this.controlName).setValue(value);
  }
}
