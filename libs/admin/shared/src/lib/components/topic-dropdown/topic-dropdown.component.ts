import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
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
export class TopicDropdownComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() name: string;
  @Input() hotelId: string;
  @Input() title = true;
  @Input() id = false;
  @Input() state: string;
  @Output() changeTopic = new EventEmitter();
  private $subscription = new Subscription();
  topicList = [];
  constructor(
    private adminUtilityService: AdminUtilityService,
    private topicService: TopicService,
    private snackbarService: SnackBarService
  ) {}

  ngOnInit() {
    this.getTopicList();
  }

  initFG() {}

  getTopicList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: this.state || 'ALL', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.topicService.getHotelTopic(config, this.hotelId).subscribe(
        (response) => {
          this.topicList = new Topics().deserialize(response).records;
        },
        ({ error }) => { }
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
