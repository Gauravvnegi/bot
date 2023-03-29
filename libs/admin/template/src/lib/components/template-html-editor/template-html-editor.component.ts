import { Component, EventEmitter, HostListener } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { templateConfig } from '../../constants/template';
import { TranslateService } from '@ngx-translate/core';
import { AdminUtilityService, NavRouteOptions } from 'libs/admin/shared/src';
import { EditTemplateComponent } from '../edit-template/edit-template.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { TemplateService } from '../../services/template.service';
import { trim } from 'lodash';

@Component({
  selector: 'hospitality-bot-template-html-editor',
  templateUrl: './template-html-editor.component.html',
  styleUrls: ['./template-html-editor.component.scss'],
})
export class TemplateHtmlEditorComponent extends EditTemplateComponent {
  goBack = new EventEmitter();
  saveTemplate = new EventEmitter();

  enableAssetImport = false;

  navRoutes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Template', link: '/pages/library/template' },
    { label: 'Create Template', link: '/pages/library/template/create' },
    { label: 'HTML Template', link: './' },
  ];

  constructor(
    protected _fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected templateService: TemplateService,
    protected _router: Router,
    protected activatedRoute: ActivatedRoute,
    protected translateService: TranslateService,
    protected adminUtilityService: AdminUtilityService
  ) {
    super(
      _fb,
      globalFilterService,
      snackbarService,
      templateService,
      _router,
      activatedRoute,
      translateService,
      adminUtilityService
    );
  }

  /**
   * @function getAssetId to get template Id from routes query param.
   */
  getTemplateId(): void {
    if (this._router.url.includes('view')) this.isDisabled = true;
    this.$subscription.add(
      this.activatedRoute.parent.params.subscribe((params) => {
        if (params['id']) {
          this.templateId = params['id'];
          this.pageTitle = 'Edit Template';
          this.navRoutes[2].label = 'Edit Template';
        } else if (this.id) {
          this.templateId = this.id;
        }
      })
    );
    this.listenForFormData();
  }

  listenForFormData(): void {
    this.$subscription.add(
      this.templateService.templateFormData.subscribe((response) => {
        if (response.name) {
          this.templateForm?.patchValue(response);
        } else {
          this._router.navigate(['/pages/library/template/create']);
        }
      })
    );
  }

  /**
   * @function saveAndPreview function to save and preview tempalte.
   */
  saveAndPreview() {
    this.handleSubmit({ data: { redirectToForm: false, preview: true } });
  }

  /**
   * @function save function to save template.
   */
  save() {
    this.handleSubmit({ data: { redirectToForm: false, preview: false } });
  }

  /**
   * @function saveAndNext function to save and move to next page.
   */
  saveAndNext() {
    if (trim(this.templateForm.get('htmlTemplate').value) === '') {
      this.snackbarService
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
    this.handleSubmit({ data: { redirectToForm: true, preview: false } });
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
}
