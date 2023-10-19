import { Location } from '@angular/common';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { TranslateService } from '@ngx-translate/core';
import { NavRouteOptions } from 'libs/admin/shared/src/lib/types/common.type';
import { Subscription } from 'rxjs';
import { Topic } from '../../data-models/topicConfig.model';
import { TopicService } from '../../services/topic.service';
import { TopicRoutes } from '../../constants/routes';

@Component({
  selector: 'hospitality-bot-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss'],
})
export class EditTopicComponent implements OnInit, OnDestroy {
  @Input() id: string;
  private $subscription: Subscription = new Subscription();

  topicForm: FormGroup;
  topic: Topic;
  topicId: string;
  entityId: string;
  isSavingTopic = false;
  globalQueries = [];

  navRoutes: NavRouteOptions = [];

  pageTitle = 'Create Topic';

  constructor(
    private _fb: FormBuilder,
    private snackbarService: SnackBarService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private globalFilterService: GlobalFilterService,
    private topicService: TopicService,
    private _router: Router,
    protected _translateService: TranslateService,
    private routesConfigService: RoutesConfigService
  ) {
    this.initFG();
  }

  initFG(): void {
    this.topicForm = this._fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
    const { navRoutes, title } = TopicRoutes[
      this.topicId ? 'editTopic' : 'createTopic'
    ];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
    this.initNavRoutes();
  }

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];

        this.entityId = this.globalFilterService.entityId;
        this.getTopicId();
      })
    );
  }

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
  }

  /**
   * @function handleSubmit handles form submission type.
   */
  handleSubmit() {
    if (this.topicForm.invalid) {
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
    const data = this.topicForm.getRawValue();
    console.log(data);
    if (this.topicId) {
      this.updateTopic();
    } else {
      this.addTopic();
    }
  }

  /**
   * @function addTopic add new record in topic list.
   */
  addTopic() {
    this.isSavingTopic = true;
    const data = this.topicService.mapTopicData(
      this.topicForm.getRawValue(),
      this.entityId
    );
    this.$subscription.add(
      this.topicService.addTopic(this.entityId, data).subscribe(
        (response) => {
          this.topic = new Topic().deserialize(response);
          this.topicForm.patchValue(this.topic);
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: 'message.success.topic_created',
                priorityMessage: 'Topic Created Successfully.',
              },
              '',
              {
                panelClass: 'success',
              }
            )
            .subscribe();
          this.routesConfigService.goBack();
          this.isSavingTopic = false;
        },
        ({ error }) => {
          this.isSavingTopic = false;
        }
      )
    );
  }

  /**
   * @function getTopicId to get topic Id from routes query param.
   */
  getTopicId(): void {
    this.$subscription.add(
      this.activatedRoute.params.subscribe((params) => {
        if (params['id']) {
          this.topicId = params['id'];
          this.getTopicDetails(this.topicId);
        } else if (this.id) {
          this.topicId = this.id;
          this.getTopicDetails(this.topicId);
        }
      })
    );
  }

  /**
   * @function getTopicDetails to get the topic details.
   * @param topicId The topic id for which edit action will be done.
   */
  getTopicDetails(topicId: string): void {
    this.$subscription.add(
      this.topicService
        .getTopicDetails(this.entityId, topicId)
        .subscribe((response) => {
          this.topic = new Topic().deserialize(response);
          this.topicForm.patchValue(this.topic);
        })
    );
  }

  /**
   * @function updateTopic update topic record.
   */
  updateTopic(): void {
    this.isSavingTopic = true;
    const data = this.topicService.mapTopicData(
      this.topicForm.getRawValue(),
      this.entityId,
      this.topic.id
    );
    this.$subscription.add(
      this.topicService
        .updateTopic(this.entityId, this.topic.id, data)
        .subscribe(
          (response) => {
            this.snackbarService
              .openSnackBarWithTranslate(
                {
                  translateKey: 'message.success.topic_updated',
                  priorityMessage: 'Topic Updated Successfully.',
                },
                '',
                {
                  panelClass: 'success',
                }
              )
              .subscribe();
            this._router.navigate(['/pages/library/topic']);
            this.isSavingTopic = false;
          },
          ({ error }) => {
            this.isSavingTopic = false;
          }
        )
    );
  }

  resetForm() {
    this.topicForm.reset();
  }

  /**
   * @function redirectToTable To navigate to data table page.
   */
  redirectToTable() {
    this.routesConfigService.goBack();
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
