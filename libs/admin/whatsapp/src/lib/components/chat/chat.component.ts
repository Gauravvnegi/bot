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
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { IChats, Chats, Chat, RequestList } from '../../models/message.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';

@Component({
  selector: 'hospitality-bot-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() selectedChat;
  @Input() data;
  @Output() guestInfo = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  hotelId: string;
  chat: IChats;
  chatFG: FormGroup;
  liveChatFG: FormGroup;
  isLoading = false;
  limit = 20;
  $subscription = new Subscription();
  scrollBottom = true;
  scrollView;
  requestList;
  selectedIndex = 0;
  buttonConfig = [
    { button: true, label: 'Raise Request', icon: 'assets/svg/requests.svg' },
  ];
  constructor(
    private modalService: ModalService,
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
    this.liveChatFG = this.fb.group({
      status: [false],
    });
  }

  ngOnChanges(): void {
    if (this.hotelId) {
      this.loadChat();
      this.getLiveChat();
    }
  }

  loadChat() {
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
    this.listenForApplicationActive();
    this.listenForMessageNotification();
    this.listenForLiveRequestNotification();
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.getLiveChat();
      })
    );
  }

  listenForMessageNotification() {
    this._firebaseMessagingService.currentMessage.subscribe((response) => {
      if (response) {
        this.scrollBottom = true;
        this.getChat({ offset: 0, limit: this.limit + 1 }, undefined, false);
      }
    });
  }

  listenForApplicationActive() {
    this._firebaseMessagingService.tabActive.subscribe((response) => {
      if (response) {
        this.scrollBottom = true;
        this.getChat({
          offset: 0,
          limit: this.limit % 20 === 0 ? this.limit - 20 : 20,
        });
        this._firebaseMessagingService.tabActive.next(false);
      }
    });
  }

  listenForLiveRequestNotification() {
    this._firebaseMessagingService.liveRequestEnable.subscribe((response) => {
      if (
        response &&
        response?.data?.phoneNumber &&
        response?.data?.phoneNumber === this.selectedChat.phone
      ) {
        this.getLiveChat();
      }
    });
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
        this.loadChat();
      }
    });
  }

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  getChat(
    config = { offset: 0, limit: 20 },
    scrollHeight?: number,
    updatePagination = true,
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
              if (updatePagination)
                this.updatePagination(response.messages.length, config.limit);
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

  updatePagination(messageLength, limit) {
    this.limit = messageLength < limit ? messageLength : this.limit + 20;
  }

  handleChatResponse(response) {
    this.chat = new Chats().deserialize(
      response,
      this._globalFilterService.timezone
    );
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
      this.messageService.refreshData$.next(true);
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
      this.limit > this.getMessagesFromTimeList().length
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

  getLiveChat() {
    this.$subscription.add(
      this.messageService
        .getLiveChat(
          this.hotelId,
          this.selectedChat.receiverId,
          this.selectedChat.phone
        )
        .subscribe(
          (response) => this.liveChatFG.patchValue(response),
          ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
        )
    );
  }

  onLiveChatChange() {
    this.$subscription.add(
      this.messageService
        .updateLiveChat(
          this.hotelId,
          this.selectedChat.receiverId,
          this.liveChatFG.getRawValue()
        )
        .subscribe(
          (response) => this.liveChatFG.patchValue(response),
          ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
        )
    );
  }

  handleButtonClick(): void {
    this.openRaiseRequest();
  }

  getRequestList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          hotelId: this.hotelId,
          confirmationNumber: this.data.reservationId,
        },
      ]),
    };
    this.$subscription.add(
      this.messageService.getRequestByConfNo(config).subscribe(
        (response) => {
          this.requestList = new RequestList().deserialize(response).data;
        },
        ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
      )
    );
  }
  openRaiseRequest() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '50%';
    const raiseRequestCompRef = this.modalService.openDialog(
      RaiseRequestComponent,
      dialogConfig
    );

    this.$subscription.add(
      raiseRequestCompRef.componentInstance.onRaiseRequestClose.subscribe(
        (res) => {
          if (res.status) {
            this.getRequestList();
            const values = {
              reservationId: res.data.number,
            };
            this.$subscription.add(
              this.messageService
                .updateGuestDetail(this.hotelId, this.data.receiverId, values)
                .subscribe(
                  (response) => {
                    this.messageService.refreshData$.next(true);
                  },
                  ({ error }) =>
                    this.snackBarService.openSnackBarAsText(error.message)
                )
            );
          }
          raiseRequestCompRef.close();
        }
      )
    );
  }

  get chatList() {
    return this.messageService.chatList;
  }

  get liveChatStatus() {
    return this.liveChatFG?.get('status');
  }
}
