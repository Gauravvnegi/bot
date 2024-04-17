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
  Department,
  DepartmentList,
  QueryConfig,
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
  @Output() messageSent = new EventEmitter<MessageData>();
  @Input() entityId;
  items: Array<User | Department>;
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
    this.messageService.sendLiveChatEndMessage.subscribe((res) => {
      if (res) {
        this.sendMessage();
      }
    });
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((_) => {
        this.userService
          .getMentionList(this.globalFilterService.entityId)
          .subscribe((response) => {
            const userList = new UserList().deserialize(response?.users);
            const departmentList = new DepartmentList().deserialize(
              response?.department
            );
            this.items = [].concat(departmentList, userList);
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
    if (values.message.trim().length === 0) {
      return;
    }
    values.receiverId = this.selectedChat.phone;
    const mentions = this.mentions
      .map((mention) => {
        if (
          mention.firstName &&
          values.message.includes(`@${mention.firstName}`)
        ) {
          return { mentionedUserId: mention.id };
        }
        if (
          mention.departmentLabel &&
          values.message.includes(`@${mention.departmentLabel}`)
        ) {
          return { departmentMentionedUserName: mention.departmentName };
        }
      })
      .filter((item) => item !== undefined);

    const departmentMentions = mentions.filter(
      (item) => !!item.departmentMentionedUserName
    );
    const userMentions = mentions.filter((item) => !!item.mentionedUserId);

    const timestamp = this.dateService.getCurrentTimeStamp();
    this.messageSent.emit({
      message: encodeURIComponent(this.chatFG.get('message').value),
      timestamp,
      status: 'unsend',
      update: false,
    });
    values.message = encodeURIComponent(values.message);

    const getQueryArray = (list: typeof mentions, configName: string) => {
      if (list.length > 0) {
        return [{ [configName]: true }, ...list];
      }
      return [];
    };

    const queryObj = this.adminUtilityService.makeQueryParams([
      ...getQueryArray(userMentions, 'isMention'),
      ...getQueryArray(departmentMentions, 'isDepartmentMention'),
    ]);

    this.$subscription.add(
      this.messageService
        .sendMessage(this.entityId, values, queryObj)
        .subscribe((_) => {
          this.messageSent.emit({
            message: encodeURIComponent(this.chatFG.get('message').value),
            timestamp,
            status: 'sent',
            update: true,
          });
          this.mentions = [];
        })
    );
  }

  uploadDoc(event) {
    const formData = new FormData();
    formData.append('files', event.file, event.file.name);
    const config: QueryConfig = {
      params: '?folder_name=BOTSHOT/CONVERSATION/TEST/VIDEO',
    };
    this.$subscription.add(
      this.messageService.uploadData(config, formData).subscribe((res) => {
        const values = this.chatFG.getRawValue();

        const messagePayload = {
          mediaUrl: res.fileDownloadUri,
          filename: event.file.name,
          channelType: values.channelType,
          receiverId: this.selectedChat.phone,
          messageType: event?.documentType,
        };

        this.messageSent.emit({
          url: res.fileDownloadUri,
          timestamp: this.dateService.getCurrentTimeStamp(),
          status: 'unsend',
          update: false,
          type: event?.documentType,
        });

        this.$subscription.add(
          this.messageService
            .sendMessage(this.entityId, messagePayload, null)
            .subscribe((_) => {
              this.messageSent.emit({
                url: res.fileDownloadUri,
                timestamp: this.dateService.getCurrentTimeStamp(),
                status: 'sent',
                update: true,
                type: event?.documentType,
              });
            })
        );
      })
    );
  }

  checkForEnterKey(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  setSelectedItem(event) {
    if (!this.mentions.includes(event)) {
      this.mentions.push(event);
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

export type MessageData = {
  message?: string;
  timestamp: number;
  status: string;
  update: boolean;
  url?: string;
  type?: string;
};
