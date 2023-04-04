import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { TemplateService } from '../../services/template.service';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Template, Topics } from '../../data-models/templateConfig.model';
import { templateConfig } from '../../constants/template';
import { TranslateService } from '@ngx-translate/core';
import {
  AdminUtilityService,
  NavRouteOptions,
  Option,
} from 'libs/admin/shared/src';

@Component({
  selector: 'hospitality-bot-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss'],
})
export class EditTemplateComponent implements OnInit, OnDestroy {
  templateForm: FormGroup;
  template: Template;
  id: string;
  templateId: string;
  hotelId: string;
  isDisabled = false;
  globalQueries = [];
  topicList: Option[] = [];
  isSaving = false;

  imgTemplate;
  typeOfTemplate;
  draftDate: number | string;

  pageTitle = 'Create Template';
  navRoutes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Template', link: '/pages/library/template' },
    { label: 'Create Template', link: './' },
  ];

  protected $subscription = new Subscription();
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
        this.hotelId = this.globalFilterService.hotelId;
        this.getTemplateId();
        this.getTopicList(this.hotelId);
      })
    );
  }

  /**
   * @function getTopicList To get topic record list.
   * @param hotelId The hotel id for which getTopicList will be done.
   */
  getTopicList(hotelId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.topicConfig.limit,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTopicList(hotelId, config).subscribe(
        (response) => {
          const data = new Topics()
            .deserialize(response)
            .records.map((item) => ({ label: item.name, value: item.id }));
          this.topicList = [...this.topicList, ...data];
        },
        ({ error }) => {
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'message.error.topicList_fail',
                priorityMessage: error.message,
              },
              ''
            )
            .subscribe();
        }
      )
    );
  }

  /**
   * @function getTemplateId to get template Id from routes query param.
   */
  getTemplateId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.templateId = params['id'];
          this.pageTitle = 'Edit Template';
          this.navRoutes[2].label = 'Edit Template';
          this.getTemplateDetails(this.templateId);
        } else if (this.id) {
          this.templateId = this.id;
          this.getTemplateDetails(this.templateId);
        }
      })
    );
    this.listenForFormData();
  }

  listenForFormData(): void {
    this.$subscription.add(
      this.templateService.templateFormData.subscribe((response) => {
        if (response) {
          this.templateForm?.patchValue(response);
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
          this.draftDate = this.template.updatedAt ?? this.template.createdAt;
          this.templateForm?.patchValue(this.template);
          this.templateService?.templateFormData.next(
            this.templateForm.getRawValue()
          );
          this.imgTemplate = response.htmlTemplate;
        })
    );
  }

  /**
   * @function handleSubmit validating and handling form submission.
   */
  handleSubmit(event) {
    if (this.templateForm.invalid) {
      this.snackbarService
        .openSnackBarWithTranslate(
          {
            translateKey: `message.validation.INVALID_FORM`,
            priorityMessage: 'Invalid Form.',
          },
          ''
        )
        .subscribe();
      return;
    }
    const data = this.templateForm.getRawValue();
    this.isSaving = true;
    if (this.templateId) {
      this.$subscription.add(
        this.updateTemplate(data).subscribe(
          (response) => {
            this.snackbarService
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
            if (event.data.preview) this.isDisabled = true;
          },
          ({ error }) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: `messages.error.${error?.type}`,
                  priorityMessage: error?.message,
                },
                ''
              )
              .subscribe();
          },
          () => (this.isSaving = false)
        )
      );
    } else {
      this.$subscription.add(
        this.createTemplate(data).subscribe(
          (response) => {
            this.template = new Template().deserialize(response);
            this.snackbarService
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
            this.snackbarService
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
    const data = this.templateService.mapTemplateData(
      templateFormData,
      this.hotelId
    );
    return this.templateService.createTemplate(this.hotelId, data);
  }

  /**
   * @function moveToEditor function to move to editor.
   * @param disabled content not editable.
   */
  moveToEditor(disabled) {
    this.templateService?.templateFormData.next(
      this.templateForm?.getRawValue()
    );
    if (disabled) {
      this._router.navigate(['view/html-editor'], {
        relativeTo: this.activatedRoute,
      });
    } else {
      this._router.navigate(['edit/html-editor'], {
        relativeTo: this.activatedRoute,
      });
    }
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
            (_) => {
              this.templateForm.patchValue({ htmlTemplate: '' });
              this.snackbarService
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
              this.snackbarService
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
    this.templateService?.templateFormData.next(
      this.templateForm?.getRawValue()
    );
    if (newContent) {
      this._router.navigate(['html-editor'], {
        relativeTo: this.activatedRoute,
      });
    }
    if (!newContent && type === 'SAVEDTEMPLATE') {
      this._router.navigate(['saved'], { relativeTo: this.activatedRoute });
    } else if (!newContent)
      this._router.navigate(['pre-designed'], {
        relativeTo: this.activatedRoute,
      });
  }

  // /**
  //  * @function handleTemplateListChange function to handle template list change.
  //  */
  // handleTemplateListChange(event) {
  //   if (event.status) {
  //     this.templateForm.patchValue({ htmlTemplate: event.data });
  //     this.move(2);
  //     return;
  //   }
  //   this.move(0);
  // }

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
