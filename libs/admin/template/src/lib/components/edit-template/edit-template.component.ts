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
      htmlTemplate: [''],
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

  handleSubmit() {
    if (this.templateForm.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    const data = this.templateForm.getRawValue();
    console.log(data);
    if (this.templateId) {
      this.updateTemplate();
    } else {
      this.createTemplate();
    }
  }
  updateTemplate(): void {
    this.isSaving = true;
    const data = this.templateService.mapTemplateData(
      this.templateForm.getRawValue(),
      this.hotelId,
      this.template.id
    );
    this.$subscription.add(
      this.templateService
        .updateTemplate(this.hotelId, this.template.id, data)
        .subscribe(
          (response) => {
            this._snackbarService.openSnackBarAsText(
              'Template Updated Successfully',
              '',
              { panelClass: 'success' }
            );
            this._router.navigate(['/pages/library/template']);
            this.isSaving = false;
          },
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
            this.isSaving = false;
          }
        )
    );
  }

  createTemplate() {
    if (this.templateForm.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    this.isSaving = true;
    let data = this.templateService.mapTemplateData(
      this.templateForm.getRawValue(),
      this.hotelId
    );
    this.$subscription.add(
      this.templateService.createTemplate(this.hotelId, data).subscribe(
        (response) => {
          this.template = new Template().deserialize(response);
          this.templateForm.patchValue(this.template);
          this._snackbarService.openSnackBarAsText(
            'Template Created Successfully',
            '',
            { panelClass: 'success' }
          );
          this._router.navigate(['/pages/library/template']);
          this.isSaving = false;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
          this.isSaving = false;
        }
      )
    );
  }

  move(index: number) {
    this.stepper.selectedIndex = index;
  }

  moveToEditor(disabled) {
    this.contentNotEditable = disabled;
    this.stepper.selectedIndex = this.htmlTemplate.value ? 2 : 1;
  }

  handleBackFromEditor() {
    this.stepper.selectedIndex =
      this.htmlTemplate.value || this.createNewHtml ? 0 : 1;
    this.createNewHtml = false;
    this.contentNotEditable = false;
  }

  deleteTemplate() {}

  openCreateContent(newContent: boolean) {
    this.createNewHtml = newContent;
    this.stepper.selectedIndex = newContent ? 2 : 1;
  }

  goBack() {
    this.location.back();
  }

  get htmlTemplate() {
    return this.templateForm.get('htmlTemplate');
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
