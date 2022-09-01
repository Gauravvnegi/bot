import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { MessageService } from '../../services/messages.service';

@Component({
  selector: 'hospitality-bot-message-box',
  templateUrl: './message-box.component.html',
  styleUrls: ['./message-box.component.scss'],
})
export class MessageBoxComponent implements OnInit, OnDestroy {
  @Input() chatFG: FormGroup;
  @Input() selectedChat;
  @Input() chatList;
  @Output() messageSent = new EventEmitter();
  @Input() hotelId;
  $subscription = new Subscription();
  constructor(
    private snackbarService: SnackBarService,
    private messageService: MessageService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {}

  sendMessage(): void {
    if (this.chatFG.invalid) {
      this.chatFG.markAsTouched();
      this.snackbarService.openSnackBarAsText('Please enter a message');
      return;
    }
    if (
      !this.chatList.receiver[this.selectedChat.receiverId]?.checkEnableSend()
    ) {
      this.snackbarService
        .openSnackBarAsText(`As per WhatsApp's rules, you can only respond to a user within 24 hours of
      their messages.`);
    }

    const values = this.chatFG.getRawValue();
    values.receiverId = this.selectedChat.phone;
    const timestamp = this.dateService.getCurrentTimeStamp();
    this.messageSent.emit({
      message: encodeURIComponent(this.chatFG.get('message').value),
      timestamp,
      status: 'unsend',
      update: false,
    });
    values.message = encodeURIComponent(values.message);

    this.$subscription.add(
      this.messageService.sendMessage(this.hotelId, values).subscribe(
        (response) => {
          this.messageSent.emit({
            message: encodeURIComponent(this.chatFG.get('message').value),
            timestamp,
            status: 'sent',
            update: true,
          });
        },
        ({ error }) =>
          this.snackbarService
            .openSnackBarWithTranslate(
              {
                translateKey: `messages.error.${error?.type}`,
                priorityMessage: error?.message,
              },
              ''
            )
            .subscribe()
      )
    );
  }

  checkForEnterKey(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
