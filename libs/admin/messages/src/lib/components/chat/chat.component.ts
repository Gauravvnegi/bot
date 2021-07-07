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
import { Chat, Chats, IChat, IChats } from '../../models/message.model';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';

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
  newMessages = {};
  hotelId: string;
  chat: IChats;
  chatFG: FormGroup;
  isLoading = false;
  limit = 20;
  $subscription = new Subscription();
  scrollBottom = true;
  scrollView;
  chatList = {};
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService,
    private dateService: DateService
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
    this.newMessages = new Array<IChat>();
  }

  ngOnChanges(): void {
    if (!this.chatList[this.selectedChat.receiverId]) {
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

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true, data: this.chat.receiver });
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
              response.messages.length < config.limit
                ? (this.limit = response.messages.length)
                : (this.limit = this.limit + 20);
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
              this.chatList = {};
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
    this.chatList[
      response.receiver.receiverId
    ] = this.messageService.filterMessagesByDate(
      this.newMessages[response.receiver.receiverId]
        ? [
            ...this.chat.messages,
            ...this.newMessages[response.receiver.receiverId],
          ]
        : this.chat.messages
    );
  }

  sendMessage(): void {
    if (this.chatFG.invalid) {
      this.chatFG.markAsTouched();
      this.snackBarService.openSnackBarAsText('Please enter a message');
      return;
    }

    const values = this.chatFG.getRawValue();
    values.receiverId = this.selectedChat.phone;
    const timestamp = this.dateService.getCurrentTimeStamp();
    this.updateMessageToChatList(timestamp, 'unsend');

    this.$subscription.add(
      this.messageService.sendMessage(this.hotelId, values).subscribe(
        (response) => {
          this.chatFG.get('message').setValue('');
          this.updateMessageToChatList(timestamp, 'sent', true);
        },
        ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
      )
    );
  }

  updateMessageToChatList(timestamp, status, update = false) {
    let data;
    let messages = this.getMessagesFromTimeList();
    if (!update) {
      data = new Chat().deserialize({
        direction: 'OUTBOUND',
        text: this.chatFG.get('message').value,
        timestamp,
        status,
      });
      if (this.newMessages[this.selectedChat.receiverId]) {
        this.newMessages[this.selectedChat.receiverId].push(data);
      } else {
        this.newMessages[this.selectedChat.receiverId] = [data];
      }
    } else {
      this.newMessages[this.selectedChat.receiverId].forEach((message) => {
        if (message.timestamp === timestamp) {
          message.status = status;
        }
      });
    }
    messages = [...messages, ...this.newMessages[this.selectedChat.receiverId]];
    messages = DateService.sortObjArrayByTimeStamp(messages, 'timestamp');
    this.chatList[
      this.selectedChat.receiverId
    ] = this.messageService.filterMessagesByDate(messages);
  }

  getMessagesFromTimeList() {
    let messages = [];
    Object.keys(this.chatList[this.selectedChat.receiverId]).forEach((key) => {
      messages = [
        ...messages,
        ...this.chatList[this.selectedChat.receiverId][key],
      ];
    });
    return messages;
  }

  checkForEnterKey(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
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
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } else if (this.myScrollContainer && this.scrollView) {
      this.myScrollContainer.nativeElement.scrollTop =
        this.myScrollContainer.nativeElement.scrollHeight - this.scrollView;
      this.scrollView = undefined;
    }
  }

  get chatDates() {
    if (this.chatList[this.selectedChat.receiverId]) {
      return Object.keys(this.chatList[this.selectedChat.receiverId]);
    }
    return [];
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
