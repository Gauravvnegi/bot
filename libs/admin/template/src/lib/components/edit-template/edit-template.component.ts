import { Component, OnDestroy, ViewChild } from '@angular/core';
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
@Component({
  selector: 'hospitality-bot-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnDestroy {
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
    private activatedRoute: ActivatedRoute
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
      description: [''],
      status: [true],
      templateType: [''],
      htmlTemplate: ['', [Validators.required]],
      shared: [''],
    });
  }

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

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

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
            this._snackbarService.openSnackBarAsText(
              'Template Updated Successfully',
              '',
              { panelClass: 'success' }
            );
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
            this._snackbarService.openSnackBarAsText(
              'Template Created Successfully',
              '',
              { panelClass: 'success' }
            );
            this._router.navigate(['/pages/library/template']);
          },
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
          },
          () => (this.isSaving = false)
        )
      );
    }
  }

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

  createTemplate(templateFormData) {
    let data = this.templateService.mapTemplateData(
      templateFormData,
      this.hotelId
    );
    return this.templateService.createTemplate(this.hotelId, data);
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
  }

  moveToEditor(disabled) {
    this.contentNotEditable = disabled;
    this.stepper.selectedIndex = this.htmlTemplate.value ? 2 : 1;
  }

  handleBackFromEditor() {
    this.stepper.selectedIndex = 0;
    this.createNewHtml = false;
    this.contentNotEditable = false;
  }

  deleteTemplate() {
    if (this.templateId)
      this.$subscription.add(
        this.templateService
          .deleteTemplateContent(this.hotelId, this.templateId)
          .subscribe(
            (resposne) => {
              this.templateForm.patchValue({ htmlTemplate: '' });
            },
            ({ error }) =>
              this._snackbarService.openSnackBarAsText(error.message)
          )
      );
    else this.templateForm.patchValue({ htmlTemplate: '' });
  }

  openCreateContent(newContent: boolean, type?: string) {
    this.typeOfTemplate = type;
    this.createNewHtml = newContent;
    this.stepper.selectedIndex = newContent ? 2 : 1;
  }

  handleTemplateListChange(event) {
    if (event.status) {
      this.templateForm.patchValue({ htmlTemplate: event.data });
      this.move(2);
      return;
    }
    this.move(0);
  }

  goBack() {
    this.location.back();
  }

  get htmlTemplate() {
    return this.templateForm.get('htmlTemplate');
  }

  get templateConfiguration() {
    return templateConfig;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
