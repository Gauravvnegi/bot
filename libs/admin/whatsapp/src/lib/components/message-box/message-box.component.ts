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
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import {
  AdminUtilityService,
  User,
  UserList,
  UserService,
} from '@hospitality-bot/admin/shared';

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
  items: User[];
  mentions = [];
  $subscription = new Subscription();
  constructor(
    private snackbarService: SnackBarService,
    private messageService: MessageService,
    private dateService: DateService,
    private globalFilterService: GlobalFilterService,
    private userService: UserService,
    private adminUtilityService: AdminUtilityService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((_) => {
        this.userService
          .getUsersList(this.globalFilterService.hotelId)
          .subscribe((response) => {
            this.items = new UserList().deserialize(response);
          });
      })
    );
  }

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
    const mentions = this.mentions
      .map((mention) => {
        if (values.message.includes(`@${mention.firstName}`)) {
          return { mentionedUserId: mention.id };
        }
      })
      .filter((item) => item !== undefined);
    const timestamp = this.dateService.getCurrentTimeStamp();
    this.messageSent.emit({
      message: encodeURIComponent(this.chatFG.get('message').value),
      timestamp,
      status: 'unsend',
      update: false,
    });
    values.message = encodeURIComponent(values.message);
    const queryObj = this.adminUtilityService.makeQueryParams([
      {
        isMention: mentions.length > 0,
      },
      ...mentions,
    ]);
    this.$subscription.add(
      this.messageService.sendMessage(this.hotelId, values, queryObj).subscribe(
        (_) => {
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

  setSelectedItem(event) {
    this.mentions.push(event);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
