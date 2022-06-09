import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit {
  @Input() feedback;
  @Output() guestInfo = new EventEmitter();
  $subscription = new Subscription();
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.listenForSelectedFeedback();
  }

  listenForSelectedFeedback() {
    this.$subscription.add(
      this.cardService.selectedFeedback.subscribe((response) => {
        this.feedback = response;
        console.log(this.feedback);
      })
    );
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }
}
