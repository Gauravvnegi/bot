import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { trim } from 'lodash';
import { Template } from '../../data-models/templateConfig.model';
import { templateConfig } from '../../constants/template';

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
  constructor(private _snackbarService: SnackBarService) {}

  ngOnInit(): void {}

  saveAndPreview() {
    this.saveTemplate.emit({ data: { redirectToForm: false, preview: true } });
  }

  save() {
    this.saveTemplate.emit({ data: { redirectToForm: false, preview: false } });
  }

  saveAndNext() {
    if (trim(this.templateForm.get('htmlTemplate').value) === '') {
      this._snackbarService
        .openSnackBarWithTranslate({
          translateKey: 'messages.success.noContent',
          priorityMessage: 'No template content',
        })
        .subscribe();
      return;
    }
    if (this.templateForm.invalid) {
      this.goBack.emit();
      return;
    }
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

  get templateConfiguration() {
    return templateConfig;
  }

  back() {
    this.goBack.emit();
  }
}
