import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
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
import { templateRoutes } from '../../constants/routes';

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
  entityId: string;
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
    protected adminUtilityService: AdminUtilityService,
    protected routesConfigService: RoutesConfigService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();

    const { navRoutes, title } = templateRoutes[
      this.templateId ? 'editTemplate' : 'createTemplate'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.initNavRoutes();
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
        this.entityId = this.globalFilterService.entityId;
        this.getTemplateId();
        this.getTopicList(this.entityId);
      })
    );
  }

  /**
   * @function getTopicList To get topic record list.
   * @param entityId The hotel id for which getTopicList will be done.
   */
  getTopicList(entityId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.topicConfig.limit,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTopicList(entityId, config)
        .subscribe((response) => {
          const data = new Topics()
            .deserialize(response)
            .records.map((item) => ({ label: item.name, value: item.id }));
          this.topicList = [...this.topicList, ...data];
        })
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  /**
   * @function getTemplateId to get template Id from routes query param.
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
        .getTemplateDetails(this.entityId, topicId)
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
      this.templateForm.markAllAsTouched();
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
            if (!event.data) this.routesConfigService.goBack();
            if (event.data.preview) this.isDisabled = true;
          },
          ({ error }) => {},
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
            this.routesConfigService.goBack();
          },
          ({ error }) => {},
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
      this.entityId,
      this.template.id
    );
    return this.templateService.updateTemplate(
      this.entityId,
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
      this.entityId
    );
    return this.templateService.createTemplate(this.entityId, data);
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
      this.routesConfigService.navigate({ additionalPath: 'view/html-editor' });
    } else {
      this.routesConfigService.navigate({ additionalPath: 'edit/html-editor' });
    }
  }

  /**
   * @function deleteTemplate function to delete template.
   */
  deleteTemplate() {
    if (this.templateId)
      this.$subscription.add(
        this.templateService
          .deleteTemplateContent(this.entityId, this.templateId)
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
      this.routesConfigService.navigate({ additionalPath: 'html-editor' });
    }
    if (!newContent && type === 'SAVEDTEMPLATE') {
      this.routesConfigService.navigate({ additionalPath: 'saved' });
    } else if (!newContent)
      this.routesConfigService.navigate({ additionalPath: 'pre-designed' });
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

  resetForm() {
    this.templateForm.reset();
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
