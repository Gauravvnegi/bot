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
  items = [
    { id: 1, name: 'Ram ', department: 'Department' },
    { id: 2, name: 'Shyam ', department: 'Department' },
  ];
  mentions = [];
  $subscription = new Subscription();
  constructor(
    private snackBarService: SnackBarService,
    private messageService: MessageService,
    private dateService: DateService
  ) {}

  ngOnInit(): void {}

  sendMessage(): void {
    if (this.chatFG.invalid) {
      this.chatFG.markAsTouched();
      this.snackBarService.openSnackBarAsText('Please enter a message');
      return;
    }
    if (
      !this.chatList.receiver[this.selectedChat.receiverId]?.checkEnableSend()
    ) {
      this.snackBarService
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
    const mentions = this.checkForMentions();
    this.$subscription.add(
      this.messageService.sendMessage(this.hotelId, values).subscribe(
        (response) => {
          this.messageSent.emit({
            message: encodeURIComponent(this.chatFG.get('message').value),
            timestamp,
            status: 'sent',
            update: true,
            // mentions,
          });
        },
        ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
      )
    );
  }

  checkForEnterKey(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  setSelectedItem(event) {
    this.mentions.push(event);
  }

  checkForMentions() {
    const data = [];
    const chat = this.chatFG.get('message').value;
    this.mentions.forEach((mention) => {
      if (chat.includes(`@${mention.name}`)) {
        data.push(mention);
      }
    });
    return data;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
