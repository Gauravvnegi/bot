import { Component } from '@angular/core';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { templateConfig } from '../../constants/template';
import { Topics } from '../../data-models/templateConfig.model';
import { TemplateService } from '../../services/template.service';
import { AdminUtilityService, NavRouteOptions } from 'libs/admin/shared/src';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EditTemplateComponent } from '../edit-template/edit-template.component';
import { Router, ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { TranslateService } from '@ngx-translate/core';

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

  navRoutes: NavRouteOptions = [
    { label: 'Library', link: './' },
    { label: 'Template', link: '/pages/library/template' },
    { label: 'Create Template', link: '/pages/library/template/create' },
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
        this.getTopicList();
        this.getTemplateForAllTopics();
        this.listenForFormChanges();
      })
    );
  }

  /**
   * @function getAssetId to get template Id from routes query param.
   */
  getTemplateId(): void {
    this.templateLabel = this._router.url.includes('saved')
      ? 'Saved Templates'
      : 'Pre-Designed Templates';
    this.navRoutes[2].link = '/pages/library/template/create';
    this.navRoutes.push({ label: this.templateLabel, link: './' });

    this.pageTitle = this.templateLabel;

    this.$subscription.add(
      this.activatedRoute.parent.params.subscribe((params) => {
        if (params['id']) {
          this.templateId = params['id'];
          this.navRoutes[2].label = 'Edit Template';
          this.navRoutes[2].link = '/pages/library/template/edit';
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
   * @function getTopicList function to get topic list.
   */
  getTopicList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          limit: templateConfig.topicConfig.limit,
          entityState: templateConfig.topicConfig.active,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTopicList(this.entityId, config).subscribe(
        (response) => {
          this.topicList = new Topics()
            .deserialize(response)
            .records.map((item) => ({ label: item.name, value: item.id }));
          this.topicList.unshift({ label: 'All', value: 'All' });
        }
      )
    );
  }

  /**
   * @function getTemplateForAllTopics function to get template for all topics.
   */
  getTemplateForAllTopics() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.rowsPerPage.limit,
          templateType: this.typeOfTemplate,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTemplateListByTopic(this.entityId, config)
        .subscribe((response) => {
          this.templateTopicList = response;
        })
    );
  }

  /**
   * @function listenForFormChanges listen for topic form changes.
   */
  listenForFormChanges(): void {
    this.topicFG.valueChanges.subscribe((_) => {
      if (this.topicFG.get('topicId').value === 'All')
        this.getTemplateForAllTopics();
      else this.getTemplateByTopicId();
    });
  }

  /**
   * @function getTemplateByTopicId function to get template by topic id.
   */
  getTemplateByTopicId() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityState: templateConfig.topicConfig.active,
          limit: templateConfig.rowsPerPage.limit,
          templateType: this.typeOfTemplate,
        },
      ]),
    };
    this.$subscription.add(
      this.templateService
        .getTemplateListByTopicId(
          this.entityId,
          this.topicFG.get('topicId').value,
          config
        )
        .subscribe((response) => {
          const data = this.topicList.filter(
            (item) => item.value === this.topicFG.get('topicId').value
          );
          this.templateTopicList = [
            {
              templates: response.records,
              topicId: this.topicFG.get('topicId').value,
              topicName: data[0].label,
              totalTemplate: response.total,
            },
          ];
        })
    );
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
        this._router.navigate([
          `/pages/library/template/edit/${this.templateId}/html-editor`,
        ]);
      else
        this._router.navigate([`/pages/library/template/create/html-editor`]);
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
