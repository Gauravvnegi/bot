import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Topic } from '../../data-models/topicConfig.model';
import { TopicService } from '../../services/topic.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'hospitality-bot-edit-topic',
  templateUrl: './edit-topic.component.html',
  styleUrls: ['./edit-topic.component.scss'],
})
export class EditTopicComponent implements OnInit {
  @Input() id: string;
  private $subscription: Subscription = new Subscription();

  topicForm: FormGroup;
  topic: Topic;
  topicId: string;
  hotelId: string;
  isSavingTopic = false;
  globalQueries = [];

  constructor(
    private _fb: FormBuilder,
    private _snackbarService: SnackBarService,
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private globalFilterService: GlobalFilterService,
    private topicService: TopicService,
    private _router: Router,
    protected _translateService: TranslateService
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

        this.getHotelId(this.globalQueries);
        this.getTopicId();
      })
    );
  }

  /**
   * @function getHotelId To set the hotel id after extracting from filter array.
   * @param globalQueries The filter list with date and hotel filters.
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   * @function handleSubmit handles form submission type.
   */
  handleSubmit() {
    if (this.topicForm.invalid) {
      this._snackbarService.openSnackBarWithTranslate(
        {
          translateKey: 'message.error.invalid',
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
    let data = this.topicService.mapTopicData(
      this.topicForm.getRawValue(),
      this.hotelId
    );
    this.$subscription.add(
      this.topicService.addTopic(this.hotelId, data).subscribe(
        (response) => {
          this.topic = new Topic().deserialize(response);
          this.topicForm.patchValue(this.topic);
          this._snackbarService.openSnackBarWithTranslate(
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
          this._router.navigate(['/pages/library/topic']);
          this.isSavingTopic = false;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarWithTranslate(
            {
              translateKey: 'message.error.topic_not_created',
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
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
        .getTopicDetails(this.hotelId, topicId)
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
      this.hotelId,
      this.topic.id
    );
    this.$subscription.add(
      this.topicService
        .updateTopic(this.hotelId, this.topic.id, data)
        .subscribe(
          (response) => {
            this._snackbarService.openSnackBarWithTranslate(
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
            this._snackbarService.openSnackBarWithTranslate(
            {
              translateKey: 'message.error.topic_not_updated',
              priorityMessage: error.message,
            },
            ''
          )
          .subscribe();
            this.isSavingTopic = false;
          }
        )
    );
  }

  /**
   * @function redirectToTable To navigate to data table page.
   */
  redirectToTable() {
    this.location.back();
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
