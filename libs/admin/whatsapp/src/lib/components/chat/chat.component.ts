import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { IChats, Chats, Chat } from '../../models/message.model';

@Component({
  selector: 'hospitality-bot-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() refreshData;
  @Input() selectedChat;
  @Output() guestInfo = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  hotelId: string;
  chat: IChats;
  chatFG: FormGroup;
  isLoading = false;
  limit = 20;
  $subscription = new Subscription();
  scrollBottom = true;
  scrollView;

  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private _firebaseMessagingService: FirebaseMessagingService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  initFG(): void {
    this.chatFG = this.fb.group({
      message: ['', Validators.required],
      receiverId: [''],
      channelType: ['whatsapp'],
      messageType: ['DATA_TEXT'],
    });
  }

  ngOnChanges(): void {
    if (
      !this.chatList.messages[this.selectedChat.receiverId] ||
      this.selectedChat.unreadCount
    ) {
      this.getChat({ offset: 0, limit: 20 });
    } else {
      const chatLength = this.getMessagesFromTimeList().length;
      this.limit = chatLength % 20 > 0 ? chatLength : chatLength + 20;
    }
    this.scrollBottom = true;
  }

  ngAfterViewChecked() {
    this.scrollChat();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForRefreshData();
    this.listenForMessageNotification();
    this.listenForApplicationActive();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
      })
    );
  }

  listenForRefreshData() {
    this.messageService.refreshData$.subscribe((response) => {
      if (response) {
        this.scrollBottom = true;
        this.guestInfo.emit(false);
        this.getChat({ offset: 0, limit: 20 }, 0, true);
        this.messageService.refreshData$.next(false);
      }
    });
  }

  listenForMessageNotification() {
    this._firebaseMessagingService.currentMessage.subscribe((response) => {
      if (
        response &&
        response.notification.body.split(',')[0] === this.selectedChat.phone
      ) {
        this.scrollBottom = true;
        this.getChat({ offset: 0, limit: this.limit + 1 });
      }
    });
  }

  listenForApplicationActive() {
    this._firebaseMessagingService.tabActive.subscribe((response) => {
      if (response) {
        this.scrollBottom = true;
        this.getChat({ offset: 0, limit: this.limit });
        this._firebaseMessagingService.tabActive.next(false);
      }
    });
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  getChat(
    config = { offset: 0, limit: 20 },
    scrollHeight?: number,
    openGuest?
  ): void {
    if (this.selectedChat) {
      this.limit = config.limit;
      this.isLoading = true;
      this.$subscription.add(
        this.messageService
          .getChat(
            this.hotelId,
            this.selectedChat.receiverId,
            this.adminUtilityService.makeQueryParams([
              {
                ...config,
              },
            ])
          )
          .subscribe(
            (response) => {
              this.limit =
                response.messages.length < config.limit
                  ? response.messages.length
                  : this.limit + 20;
              this.handleChatResponse(response);
              scrollHeight
                ? (this.scrollView = scrollHeight)
                : (this.scrollBottom = true);
              this.isLoading = false;
              if (openGuest) this.openGuestInfo();
            },
            ({ error }) => {
              this.isLoading = false;
              this.chat = new Chats();
              this.snackBarService.openSnackBarAsText(error.message);
            }
          )
      );
    }
  }

  handleChatResponse(response) {
    this.chat = new Chats().deserialize(response);
    this.chat.messages = DateService.sortObjArrayByTimeStamp(
      this.chat.messages,
      'timestamp'
    );
    this.chatList.messages[
      response.receiver.receiverId
    ] = this.messageService.filterMessagesByDate(this.chat.messages);
    this.chatList.receiver[response.receiver.receiverId] = this.chat.receiver;
  }

  updateMessageToChatList(message, timestamp, status, update = false) {
    let data;
    let messages = this.getMessagesFromTimeList();
    if (!update) {
      data = new Chat().deserialize({
        direction: 'OUTBOUND',
        text: message,
        timestamp,
        status,
      });
      this.limit += 1;
      this.chatFG.get('message').setValue('');
      messages.push(data);
    } else {
      messages = messages.map((message) => {
        if (message.timestamp === timestamp) message.status = status;
        return message;
      });
    }
    messages = DateService.sortObjArrayByTimeStamp(messages, 'timestamp');
    this.chatList.messages[
      this.selectedChat.receiverId
    ] = this.messageService.filterMessagesByDate(messages);
    this.scrollToBottom();
  }

  getMessagesFromTimeList() {
    let messages = [];
    Object.keys(this.chatList.messages[this.selectedChat.receiverId]).forEach(
      (key) => {
        messages = [
          ...messages,
          ...this.chatList.messages[this.selectedChat.receiverId][key],
        ];
      }
    );
    return messages;
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (
      this.myScrollContainer &&
      this.myScrollContainer.nativeElement.scrollTop === 0 &&
      this.limit > this.chat?.messages?.length
    )
      this.getChat(
        { offset: 0, limit: this.limit },
        this.myScrollContainer.nativeElement.scrollHeight
      );
  }

  scrollChat() {
    if (this.myScrollContainer && this.scrollBottom) {
      this.scrollBottom = false;
      this.scrollToBottom();
    } else if (this.myScrollContainer && this.scrollView) {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight - this.scrollView;
      this.scrollView = undefined;
    }
  }

  get chatDates() {
    if (this.chatList.messages[this.selectedChat.receiverId]) {
      return Object.keys(this.chatList.messages[this.selectedChat.receiverId]);
    }
    return [];
  }

  scrollToBottom() {
    this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  handleSentMessage(event) {
    this.scrollToBottom();
    this.updateMessageToChatList(
      event.message,
      event.timestamp,
      event.status,
      event.update
    );
  }

  get chatList() {
    return this.messageService.chatList;
  }
}
