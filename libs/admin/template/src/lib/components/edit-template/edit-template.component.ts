import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { TemplateService } from '../../services/template.service';
import { Location } from '@angular/common';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Template } from '../../data-models/templateConfig.model';
import { MatStepper } from '@angular/material/stepper';
import { templateConfig } from '../../constants/template';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'hospitality-bot-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnInit, OnDestroy {
  id: string;
  templateForm: FormGroup;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  isSaving = false;
  templateId: string;
  template: Template;
  imgTemplate;
  contentNotEditable: boolean;
  createNewHtml = false;
  typeOfTemplate;
  @ViewChild('stepper') stepper: MatStepper;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private templateService: TemplateService,
    private location: Location,
    private _router: Router,
    private activatedRoute: ActivatedRoute,
    protected translateService: TranslateService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.templateForm = this._fb.group({
      name: ['', [Validators.required]],
      topicId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [true],
      templateType: [''],
      htmlTemplate: ['', [Validators.required]],
      isShared: [''],
    });
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId(this.globalQueries);
        this.getTemplateId();
      })
    );
  }

  /**
   * @function getHotelId To set the hotel id after extracting from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  /**
   * @function getAssetId to get template Id from routes query param.
   */
  getTemplateId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.templateId = params['id'];
          this.getTemplateDetails(this.templateId);
        } else if (this.id) {
          this.templateId = this.id;
          this.getTemplateDetails(this.templateId);
        }
      })
    );
  }

  /**
   * @function getTemplateDetails to get the topic details.
   * @param topicId The topic id for which edit action will be done.
   */
  getTemplateDetails(topicId: string): void {
    this.$subscription.add(
      this.templateService
        .getTemplateDetails(this.hotelId, topicId)
        .subscribe((response) => {
          this.template = new Template().deserialize(response);
          this.templateForm.patchValue(this.template);
          this.imgTemplate = response.htmlTemplate;
        })
    );
  }

  /**
   * @function handleSubmit validating and handling form submission.
   */
  handleSubmit(event) {
    if (this.templateForm.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    const data = this.templateForm.getRawValue();
    this.isSaving = true;
    if (this.templateId) {
      this.$subscription.add(
        this.updateTemplate(data).subscribe(
          (response) => {
            this._snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.success.updateTemplate',
                  priorityMessage: 'Template updated successfully',
                },
                '',
                {
                  panelClass: 'success',
                }
              )
              .subscribe();
            this.templateForm.patchValue(response);
            if (!event.data) this._router.navigate(['/pages/library/template']);
            if (event.data.redirectToForm) this.stepper.selectedIndex = 0;
            if (event.data.preview) this.contentNotEditable = true;
          },
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
          },
          () => (this.isSaving = false)
        )
      );
    } else {
      this.$subscription.add(
        this.createTemplate(data).subscribe(
          (response) => {
            this.template = new Template().deserialize(response);
            this._snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'messages.success.createTemplate',
                  priorityMessage: 'Template Created successfully',
                },
                '',
                {
                  panelClass: 'success',
                }
              )
              .subscribe();
            this._router.navigate(['/pages/library/template']);
          },
          ({ error }) => {
            this._snackbarService
              .openSnackBarWithTranslate({
                translateKey: 'messages.error.createTemplate',
                priorityMessage: error.message,
              })
              .subscribe();
          },
          () => (this.isSaving = false)
        )
      );
    }
  }

  /**
   * @function updateTemplate updating template records.
   */
  updateTemplate(templateFormData) {
    const data = this.templateService.mapTemplateData(
      templateFormData,
      this.hotelId,
      this.template.id
    );
    return this.templateService.updateTemplate(
      this.hotelId,
      this.template.id,
      data
    );
  }

  /**
   * @function createTemplate function to create new template.
   * @param templateFormData contains template form data.
   * @returns create template api.
   */
  createTemplate(templateFormData) {
    let data = this.templateService.mapTemplateData(
      templateFormData,
      this.hotelId
    );
    return this.templateService.createTemplate(this.hotelId, data);
  }

  /**
   * @function move function to move to particular index.
   * @param index particular page index.
   */
  move(index: number) {
    this.stepper.selectedIndex = index;
  }

  /**
   * @function moveToEditor function to move to editor.
   * @param disabled content not editable.
   */
  moveToEditor(disabled) {
    this.contentNotEditable = disabled;
    this.stepper.selectedIndex = this.htmlTemplate.value ? 2 : 1;
  }

  /**
   * @function handleBackFromEditor function to move back from editor.
   */
  handleBackFromEditor() {
    this.stepper.selectedIndex = 0;
    this.createNewHtml = false;
    this.contentNotEditable = false;
  }

  /**
   * @function deleteTemplate function to delete template.
   */
  deleteTemplate() {
    if (this.templateId)
      this.$subscription.add(
        this.templateService
          .deleteTemplateContent(this.hotelId, this.templateId)
          .subscribe(
            (response) => {
              this.templateForm.patchValue({ htmlTemplate: '' });
              this._snackbarService
                .openSnackBarWithTranslate(
                  {
                    translateKey: 'messages.success.deleteTemplate',
                    priorityMessage: 'Template Deleted successfully',
                  },
                  '',
                  {
                    panelClass: 'success',
                  }
                )
                .subscribe();
            },
            ({ error }) => {
              this._snackbarService
                .openSnackBarWithTranslate({
                  translateKey: 'messages.success.deleteTemplate',
                  priorityMessage: error.message,
                })
                .subscribe();
            }
          )
      );
    else this.templateForm.patchValue({ htmlTemplate: '' });
  }

  /**
   * @function openCreateContent function to move to create content page.
   * @param newContent to create new template.
   * @param type type of template.
   */
  openCreateContent(newContent: boolean, type?: string) {
    this.typeOfTemplate = type;
    this.createNewHtml = newContent;
    this.stepper.selectedIndex = newContent ? 2 : 1;
  }

  /**
   * @function handleTemplateListChange function to handle template list change.
   */
  handleTemplateListChange(event) {
    if (event.status) {
      this.templateForm.patchValue({ htmlTemplate: event.data });
      this.move(2);
      return;
    }
    this.move(0);
  }

  /**
   * @function goBack function to move back to previous page.
   */
  goBack() {
    this.location.back();
  }

  /**
   * @function htmlTemplate function to get html template.
   */
  get htmlTemplate() {
    return this.templateForm.get('htmlTemplate');
  }

  /**
   *@function templateConfiguration function to get template configuration.
   */
  get templateConfiguration() {
    return templateConfig;
  }

  /**
   * @function ngOnDestroy unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
