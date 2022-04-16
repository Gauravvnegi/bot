import { Location } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { Subscription } from 'rxjs';
import { TopicService } from '../../services/topic.service';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { Topic } from '../../data-models/topicConfig.model';


@Component({
  selector: 'hospitality-bot-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss'],
})
export class CreateTopicComponent implements OnInit {
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
  ) {}

  initFG(): void {
    this.topicForm = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(Regex.NAME)]],
      description: ['', [Validators.required]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.initFG();
    this.listenForGlobalFilters();
  }
  
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
   * returns Hotel Id
   * @param globalQueries 
   */
  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  /**
   * create topic and check validation
   */
  createTopic() {
    if (this.topicForm.invalid) {
      this._snackbarService.openSnackBarAsText('Invalid Form.');
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
   * add new record in topic list
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
          this._snackbarService.openSnackBarAsText(
            'Topic added successfully',
            '',
            { panelClass: 'success' }
          );
          this.redirectToTable();
          this.isSavingTopic = false;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
          this.isSavingTopic = false;
        }
      )
    );
  }

  /**
   * returns topic id
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
   * returns topic record details
   * @param topicId 
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
   * edit existing topic record
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
            this._snackbarService.openSnackBarAsText(
              'Topic updated successfully',
              '',
              { panelClass: 'success' }
            );
            this.redirectToTable();
            this.isSavingTopic = false;
          },
          ({ error }) => {
            this._snackbarService.openSnackBarAsText(error.message);
            this.isSavingTopic = false;
          }
        )
    );
  }

  /**
   * redirect to previous page
   */
  redirectToTable() {
    this.location.back();
  }
}
