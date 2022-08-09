import { Component, Input, OnInit } from '@angular/core';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { GuestDetail } from '../../../data-models/feedback-card.model';

@Component({
  selector: 'hospitality-bot-feedback-history',
  templateUrl: './feedback-history.component.html',
  styleUrls: ['./feedback-history.component.scss'],
})
export class FeedbackHistoryComponent implements OnInit {
  @Input() guestId;
  @Input() guestReservations: GuestDetail[];
  constructor(private globalFilterService: GlobalFilterService) {}

  ngOnInit(): void {}
}
