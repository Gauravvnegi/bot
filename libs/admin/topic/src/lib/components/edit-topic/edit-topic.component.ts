import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Topic } from '../../data-models/topicConfig.model';
import { TopicService } from '../../services/topic.service';
import { Location } from '@angular/common';

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
    private _router: Router
  ) {
    this.initFG();
  }

  // , Validators.pattern(Regex.NAME)
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
  handleSubmit() {
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
          this._snackbarService.openSnackBarWithTranslate(
            {
              translateKey: 'datatable.status_success',
              priorityMessage: 'Status updated.',
            },
            '',
            { panelClass: 'success' }
          );
          // this._router.navigate(['/pages/library/topic']);
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
            this._snackbarService.openSnackBarWithTranslate(
              {
                translateKey: 'datatable.status_success',
                priorityMessage: 'Status updated.',
              },
              '',
              { panelClass: 'success' }
            );
            // this._router.navigate(['/pages/library/topic']);
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
