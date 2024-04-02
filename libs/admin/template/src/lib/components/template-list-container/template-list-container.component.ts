import { Component } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { templateConfig } from '../../constants/template';
import { Topics } from '../../data-models/templateConfig.model';
import { TemplateService } from '../../services/template.service';
import {
  AdminUtilityService,
  ModuleNames,
  NavRouteOptions,
} from 'libs/admin/shared/src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditTemplateComponent } from '../edit-template/edit-template.component';
import { Router, ActivatedRoute } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { templateRoutes } from '../../constants/routes';

@Component({
  selector: 'hospitality-bot-template-list-container',
  templateUrl: './template-list-container.component.html',
  styleUrls: ['./template-list-container.component.scss'],
})
export class TemplateListContainerComponent extends EditTemplateComponent {
  selectedTopic = templateConfig.selectedTopic.all;
  templateLabel: string;
  topicFG: FormGroup;
  templateTopicList = [];
  topicList = [];
  isSavedTemplateType: boolean = false;
  isEditTemplate: boolean = false;
  templateType: string;

  navRoutes: NavRouteOptions = [];

  constructor(
    protected _fb: FormBuilder,
    protected globalFilterService: GlobalFilterService,
    protected snackbarService: SnackBarService,
    protected templateService: TemplateService,
    protected _router: Router,
    protected activatedRoute: ActivatedRoute,
    protected translateService: TranslateService,
    protected adminUtilityService: AdminUtilityService,
    protected routesConfigService: RoutesConfigService,
    protected location: Location
  ) {
    super(
      _fb,
      globalFilterService,
      snackbarService,
      templateService,
      _router,
      activatedRoute,
      translateService,
      adminUtilityService,
      routesConfigService,
      location
    );
  }

  initFG() {
    this.templateForm = this._fb.group({
      name: ['', [Validators.required]],
      topicId: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [true],
      templateType: [''],
      htmlTemplate: ['', [Validators.required]],
      isShared: [''],
    });

    this.topicFG = this._fb.group({
      topicId: 'All',
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
        this.getTemplateList();
        this.listenForFormChanges();
      })
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      const routeName = this.isSavedTemplateType
        ? this.isEditTemplate
          ? 'editTemplateWithSaved'
          : 'savedTemplate'
        : this.isEditTemplate
        ? 'editTemplateWithPreDesigned'
        : 'preDesignedTemplate';

      const templateCloneRoute = JSON.parse(JSON.stringify(templateRoutes));

      const { navRoutes, title } = templateCloneRoute[routeName];

      this.pageTitle = title;
      this.navRoutes = this.modifyNavRoutes(navRoutes, this.templateId);
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }
  /**
   * @function getAssetId to get template Id from routes query param.
   */
  getTemplateId(): void {
    this.isSavedTemplateType = this._router.url.includes('saved');
    this.$subscription.add(
      this.activatedRoute.parent.params.subscribe((params) => {
        if (params['templateId']) {
          this.isEditTemplate = true;
          this.templateId = params['templateId'];
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
          this.routesConfigService.navigate({
            subModuleName: ModuleNames.TEMPLATE,
            additionalPath: templateRoutes.createTemplate.route,
          });
        }
      })
    );
  }

  /**
   * @function getTemplateList function to get template for all topics.
   */
  getTemplateList() {
    this.templateType = this.isSavedTemplateType
      ? 'SAVEDTEMPLATE'
      : 'PREDESIGNTEMPLATE';

    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.rowsPerPage.limit,
          entityType: 'EMAIL',
          templateType: this.templateType,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTemplateList(this.entityId, config)
        .subscribe((response) => {
          this.templateTopicList = [
            {
              templates: response.records,
              totalTemplate: response.entityTypeCounts['EMAIL'],
            },
          ];
        })
    );
  }

  /**
   * @function listenForFormChanges listen for topic form changes.
   */
  listenForFormChanges(): void {
    this.topicFG.valueChanges.subscribe((_) => {
      this.getTemplateList();
    });
  }

  /**
   * @function setTemplate function to set template.
   */
  setTemplate(event) {
    this.templateForm?.patchValue({ htmlTemplate: event.data });
    this.templateService?.templateFormData.next(
      this.templateForm?.getRawValue()
    );
    if (event.status) {
      if (this.templateId)
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.TEMPLATE,
          additionalPath: `edit-template/${this.templateId}/html-editor`,
        });
      else
        this.routesConfigService.navigate({
          subModuleName: ModuleNames.TEMPLATE,
          additionalPath: `create-template/html-editor`,
        });
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
