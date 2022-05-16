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
import { TranslateService } from '@ngx-translate/core';

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
  constructor(
    private _snackbarService: SnackBarService,
    protected translateService: TranslateService
  ) {}

  ngOnInit(): void {}

  /**
   * @function saveAndPreview function to save and preview tempalte.
   */
  saveAndPreview() {
    this.saveTemplate.emit({ data: { redirectToForm: false, preview: true } });
  }

  /**
   * @function save function to save template.
   */
  save() {
    this.saveTemplate.emit({ data: { redirectToForm: false, preview: false } });
  }

  /**
   * @function saveAndNext function to save and move to next page.
   */
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

  /**
   * @function assetImportEnable function to enable import asset.
   * @param event event object to stop propagation.
   */
  assetImportEnable(event) {
    event.stopPropagation();
    this.enableAssetImport = true;
  }

  /**
   * @function templateConfiguration function to get template configuration.
   */
  get templateConfiguration() {
    return templateConfig;
  }

  /**
   * @function back function to move back.
   */
  back() {
    this.goBack.emit();
  }
}
