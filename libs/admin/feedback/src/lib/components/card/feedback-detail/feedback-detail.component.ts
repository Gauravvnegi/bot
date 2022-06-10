import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit {
  @Input() feedback;
  @Input() colorMap;
  @Input() feedbackType;
  @Output() guestInfo = new EventEmitter();
  globalFeedbackConfig = feedback;
  $subscription = new Subscription();
  constructor(
    private cardService: CardService,
    public _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.listenForSelectedFeedback();
  }

  listenForSelectedFeedback() {
    this.$subscription.add(
      this.cardService.$selectedFeedback.subscribe(
        (response) => (this.feedback = response)
      )
    );
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }
}
