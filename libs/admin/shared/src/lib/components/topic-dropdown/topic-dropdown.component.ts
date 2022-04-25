import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Subscription } from 'rxjs';
import { Topics } from '../../models/topic.model';
import { AdminUtilityService } from '../../services/admin-utility.service';
import { TopicService } from '../../services/topic.service';

@Component({
  selector: 'hospitality-bot-topic-dropdown',
  templateUrl: './topic-dropdown.component.html',
  styleUrls: ['./topic-dropdown.component.scss'],
})
export class TopicDropdownComponent implements OnInit {
  @Input() parentForm: FormGroup;
  @Input() name: string = 'topicName';
  @Input() hotelId: string;
  @Input() title = true;
  @Input() id = false;
  @Output() changeTopic = new EventEmitter();
  private $subscription = new Subscription();
  topicList = [];
  constructor(
    private adminUtilityService: AdminUtilityService,
    private topicService: TopicService,
    private _snackbarService: SnackBarService
  ) {}

  ngOnInit() {
    if (this.parentForm == undefined) this.initFG();
    this.getTopicList();
  }

  initFG() {
    this.parentForm = new FormGroup({
      topicName: new FormControl(''),
    });
  }

  getTopicList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: 'ACTIVE', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.topicService.getHotelTopic(config, this.hotelId).subscribe(
        (response) => {
          this.topicList = new Topics().deserialize(response).records;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  handleSelection(event) {
    this.changeTopic.emit({ value: event.value });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
