import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { feedback } from '../../../constants/feedback';
import { CardService } from '../../../services/card.service';

@Component({
  selector: 'hospitality-bot-feedback-detail-modal',
  templateUrl: './feedback-detail.component.html',
  styleUrls: ['./feedback-detail.component.scss'],
})
export class FeedbackDetailModalComponent implements OnInit {
  @Output() onDetailsClose = new EventEmitter();
  globalFeedbackConfig = feedback;
  $subscription = new Subscription();
  constructor(
    private cardService: CardService,
    public _globalFilterService: GlobalFilterService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {}

  close() {
    this.onDetailsClose.emit();
  }
}
