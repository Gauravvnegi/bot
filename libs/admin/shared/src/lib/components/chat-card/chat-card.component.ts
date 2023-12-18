import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import {
  convertToNormalCase,
  convertToTitleCase,
} from '../../utils/valueFormatter';

@Component({
  selector: 'hospitality-bot-chat-card',
  templateUrl: './chat-card.component.html',
  styleUrls: ['./chat-card.component.scss'],
})
export class ChatCardComponent implements OnInit {
  cardType?: string;
  roomNo?: string;
  userImg?: any;
  rating?: string;
  name?: string;
  remark?: string;
  taskStatus?: any;
  time?: any;
  priority?: string;
  department?: any;
  serviceTag?: any;
  unReadCount?: any;
  subTitle?: string;
  colorMap?: any;
  feedbackType?: string;
  profileNickName?: string;
  backgroundColor?: any;

  readonly convertToTitleCase = convertToTitleCase;

  /**
   * Set Content of the empty view.
   */
  @Input() set content(value: Content) {
    Object.entries(value).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  @Input() isSelected = false;

  constructor(public globalFilterService: GlobalFilterService) {}

  ngOnInit(): void {}
  getRatingColorCode(rating) {
    if (this.feedbackType === 'stayFeedbacks') {
      return this.colorMap.stayFeedbacks[1].colorCode;
    } else {
      let colorCode = '';
      Object.keys(this.colorMap.transactionalFeedbacks).forEach((element) => {
        const a = this.colorMap.transactionalFeedbacks[element];
        const [min, max] = a.scale.split('-');
        if (rating >= min && rating <= max) {
          colorCode = a.colorCode;
        }
      });
      return colorCode;
    }
  }

  formatTime(timeLeft: number): string {
    const minutes = Math.floor(timeLeft / 60000);
    const seconds = Math.floor((timeLeft % 60000) / 1000);

    return `${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}M`;
  }
}

type Content = {
  cardType?: string;
  roomNo?: string;
  userImg?: any;
  rating?: string;
  name?: string;
  remark?: string;
  taskStatus?: any;
  time?: any;
  priority?: string;
  department?: any;
  serviceTag?: any;
  unReadCount?: any;
  subTitle?: string;
  colorMap?: any;
  feedbackType?: string;
  profileNickName?: string;
  backgroundColor?: any;
};
