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
  ModuleNames,
  NavRouteOptions,
  Option,
} from 'libs/admin/shared/src';
import { templateRoutes } from '../../constants/routes';
import { Location } from '@angular/common';
import { Data } from 'libs/admin/feedback/src/lib/data-models/statistics.model';

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
  draftDate: number | string = new Date().toDateString();

  pageTitle = 'Create Template';
  navRoutes: NavRouteOptions = [];

  protected $subscription = new Subscription();
  constructor(
    protected _fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected templateService: TemplateService,
    protected _router: Router,
    protected route: ActivatedRoute,
    protected translateService: TranslateService,
    protected adminUtilityService: AdminUtilityService,
    protected routesConfigService: RoutesConfigService,
    protected location: Location
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
      topicId: [''],
      description: [''],
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
          this.templateForm.get('topicId').patchValue(this.topicList[0].value);
        })
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  modifyNavRoutes(navRoutes: NavRouteOptions, templateId?: string) {
    let path = '';
    this.routesConfigService.activeRouteConfigSubscription.subscribe(
      (activeRouteConfig) => {
        path = activeRouteConfig.submodule.fullPath;
      }
    );
    return navRoutes.map((navRoute) => {
      if (navRoute.link.includes(':templateId'))
        navRoute.link = navRoute.link.replace(':templateId', templateId);

      if (!navRoute.link.includes(path))
        navRoute.link = path + '/' + navRoute.link;

      return navRoute;
    });
  }

  /**
   * @function getTemplateId to get template Id from routes query param.
   */
  getTemplateId(): void {
    this.$subscription.add(
      this.route.params.subscribe((params) => {
        if (params['templateId']) {
          this.templateId = params['templateId'];
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

            if (!event) {
              this.routesConfigService.navigate({
                subModuleName: ModuleNames.TEMPLATE,
              });
            }

            if (event.data.redirectToForm) {
              this.routesConfigService.navigate({
                subModuleName: ModuleNames.TEMPLATE,
                additionalPath: templateRoutes.editTemplate.route.replace(
                  ':templateId',
                  response?.id
                ),
              });
            }
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
            this.routesConfigService.navigate({
              subModuleName: ModuleNames.TEMPLATE,
              additionalPath: templateRoutes.editTemplate.route.replace(
                ':templateId',
                response?.id
              ),
            });
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
      this.template?.id
    );
    return this.templateService.updateTemplate(
      this.entityId,
      this.templateId,
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
      this._router.navigate(['view/html-editor'], {
        relativeTo: this.route,
      });
    } else {
      this._router.navigate(['edit/html-editor'], {
        relativeTo: this.route,
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

    const data = this.templateForm.getRawValue();

    if (!data.name) {
      this.snackbarService.openSnackBarAsText('Please enter template name', '');
      return;
    }
    this.templateService?.templateFormData.next(data);

    if (newContent) {
      this._router.navigate([templateRoutes.htmlEditorTemplate.route], {
        relativeTo: this.route,
      });
    }
    if (!newContent && type === 'SAVEDTEMPLATE') {
      this._router.navigate([templateRoutes.savedTemplate.route], {
        relativeTo: this.route,
      });
    } else if (!newContent)
      this._router.navigate([templateRoutes.preDesignedTemplate.route], {
        relativeTo: this.route,
      });
  }

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
