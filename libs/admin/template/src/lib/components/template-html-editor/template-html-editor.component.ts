import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Template } from '../../data-models/templateConfig.model';

@Component({
  selector: 'hospitality-bot-template-html-editor',
  templateUrl: './template-html-editor.component.html',
  styleUrls: ['./template-html-editor.component.scss'],
})
export class TemplateHtmlEditorComponent implements OnInit {
  id: string;
  @Input() templateForm: FormGroup;
  @Input() template: Template;
  @Input() isDisabled = false;
  @Input() openEditor = false;
  @Input() templateId: string;
  @Output() goBack = new EventEmitter();
  @Output() saveTemplate = new EventEmitter();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  isSaving = false;
  enableAssetImport = false;
  constructor() {}

  ngOnInit(): void {}

  saveAndPreview() {
    this.saveTemplate.emit({ data: { redirectToForm: false, preview: true } });
  }

  save() {
    this.saveTemplate.emit({ data: { redirectToForm: false, preview: false } });
  }

  saveAndNext() {
    this.saveTemplate.emit({ data: { redirectToForm: true, preview: false } });
  }

  @HostListener('document:click', ['$event'])
  clickout() {
    this.enableAssetImport = false;
  }

  assetImportEnable(event) {
    event.stopPropagation();
    this.enableAssetImport = true;
  }

  back() {
    this.goBack.emit();
  }
}
