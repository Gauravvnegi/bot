import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-detail',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailComponent implements OnInit {
  feedback;
  $subscription = new Subscription();
  constructor(private cardService: CardService) {}

  ngOnInit(): void {
    this.listenForSelectedFeedback();
  }

  listenForSelectedFeedback() {
    this.$subscription.add(
      this.cardService.selectedFeedback.subscribe(
        (response) => (this.feedback = response)
      )
    );
  }
}
