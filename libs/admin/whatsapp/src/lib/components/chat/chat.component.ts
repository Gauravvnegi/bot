import {
  AfterViewChecked,
  Component,
  ComponentFactoryResolver,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalService, SnackBarService } from 'libs/shared/material/src';
import { ModuleNames } from '@hospitality-bot/admin/shared';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from '@hospitality-bot/shared/utils';
import { Subscription } from 'rxjs';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { IChats, Chats, Chat, RequestList } from '../../models/message.model';
import { MatDialogConfig } from '@angular/material/dialog';
import { RaiseRequestComponent } from 'libs/admin/request/src/lib/components/raise-request/raise-request.component';
import * as FileSaver from 'file-saver';
import { SubscriptionPlanService } from '@hospitality-bot/admin/core/theme';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { SideBarService } from 'libs/admin/shared/src/lib/services/sidebar.service';

@Component({
  selector: 'hospitality-bot-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent
  implements OnInit, OnChanges, OnDestroy, AfterViewChecked {
  @Input() selectedChat;
  @Input() guestInfoEnable;
  @Input() data;
  @Output() guestInfo = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  entityId: string;
  chat: IChats;
  chatFG: FormGroup;
  liveChatFG: FormGroup;
  isLoading = false;
  limit = 20;
  paginationDisabled = false;
  // sidebarVisible: boolean = false;

  $subscription = new Subscription();
  scrollBottom = true;
  scrollView;
  requestList;
  selectedIndex = 0;
  buttonConfig = [
    { button: true, label: 'Raise Complaint', icon: 'assets/svg/requests.svg' },
  ];
  @ViewChild('sidebarSlide', { read: ViewContainerRef })
  sidebarSlide: ViewContainerRef;
  // sidebarType;
  loadingChat: boolean = false;

  constructor(
    private modalService: ModalService,
    private messageService: MessageService,
    private fb: FormBuilder,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private globalFilterService: GlobalFilterService,
    private _firebaseMessagingService: FirebaseMessagingService,
    private resolver: ComponentFactoryResolver,
    private subscriptionPlanService: SubscriptionPlanService,
    private sideBarService: SideBarService
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
    if (this.entityId) {
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        this.getLiveChat();
        this.loadChat();
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
            this.entityId,
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
            }
          )
      );
    }
  }

  updatePagination(messageLength, limit) {
    this.paginationDisabled = messageLength < limit;
    this.limit = this.paginationDisabled ? messageLength : this.limit + 20;
  }

  handleChatResponse(response) {
    this.chat = new Chats().deserialize(
      response,
      this.globalFilterService.timezone
    );
    this.chat.messages = DateService.sortObjArrayByTimeStamp(
      this.chat.messages,
      'timestamp'
    );
    this.liveChatStatus.patchValue(response?.receiver?.status);
    this.loadingChat = true;
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

  loadMore() {
    if (this.limit > this.getMessagesFromTimeList().length)
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

  checkWhatsappBotSubscription() {
    return this.subscriptionPlanService.checkModuleSubscription(
      ModuleNames.WHATSAPP_BOT
    );
  }

  getLiveChat() {
    this.$subscription.add(
      this.messageService
        .getLiveChat(
          this.entityId,
          this.selectedChat.receiverId,
          this.selectedChat.phone
        )
        .subscribe((response) => this.liveChatFG.patchValue(response))
    );
  }

  onLiveChatChange() {
    this.$subscription.add(
      this.messageService
        .updateLiveChat(
          this.entityId,
          this.selectedChat.receiverId,
          this.liveChatFG.getRawValue()
        )
        .subscribe((response) => this.liveChatFG.patchValue(response))
    );
  }

  openEndLiveChatPopup() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );

    togglePopupCompRef.componentInstance.content = {
      heading: 'Exit Live Chat',
      description: [
        'Do you want to exit the live chat.',
        'This will hand over the conversation back to the bot',
      ],
    };

    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'Cancel',
        onClick: () => this.modalService.close(),
        variant: 'outlined',
      },
      {
        label: 'Confirm',
        onClick: () => this.endLiveChat(),
        variant: 'contained',
      },
    ];

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  endLiveChat() {
    this.liveChatStatus.patchValue(true);
    this.chatFG.patchValue({
      receiverId: this.selectedChat.receiverId,
      message:
        'Your agent has ended the conversation. You can continue interacting with the bot',
    });
    this.messageService.sendLiveChatEndMessage.next(true);
    this.$subscription.add(
      this.messageService
        .updateLiveChat(
          this.entityId,
          this.selectedChat.receiverId,
          this.liveChatFG.getRawValue()
        )
        .subscribe((res) => {
          this.liveChatFG.patchValue(res);
        })
    );
    this.modalService.close();
  }

  handleButtonClick(): void {
    this.openRaiseRequest();
  }

  getRequestList() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        {
          entityId: this.entityId,
          confirmationNumber: this.data.reservationId,
        },
      ]),
    };
    this.$subscription.add(
      this.messageService.getRequestByConfNo(config).subscribe((response) => {
        this.requestList = new RequestList().deserialize(response).data;
      })
    );
  }
  openRaiseRequest() {
    this.sideBarService.openSideBar({
      type: 'RAISE_REQUEST',
      open: true,
    });

    return;

    // this.sidebarVisible = true;
    // this.sidebarType = 'complaint';

    // const factory = this.resolver.resolveComponentFactory(
    //   RaiseRequestComponent
    // );
    // this.sidebarSlide.clear();
    // const componentRef = this.sidebarSlide.createComponent(factory);
    // componentRef.instance.isSideBar = true;
    // componentRef.instance.onRaiseRequestClose.subscribe((res) => {
    //   // Not getting used.. status is hardcode to false in the RaiseRequestComponent
    //   if (res.status) {
    //     this.getRequestList();
    //     const values = {
    //       reservationId: res.data.number,
    //     };
    //     this.$subscription.add(
    //       this.messageService
    //         .updateGuestDetail(this.entityId, this.data.receiverId, values)
    //         .subscribe((response) => {
    //           this.messageService.refreshData$.next(true);
    //         })
    //     );
    //   }
    //   this.sidebarVisible = false;
    //   componentRef.destroy();
    // });
  }

  exportChat() {
    this.$subscription.add(
      this.messageService
        .exportChat(this.entityId, this.selectedChat.receiverId)
        .subscribe((response) => {
          FileSaver.saveAs(
            response,
            `${this.selectedChat.name
              .split(' ')
              .join('_')}_export_${new Date().getTime()}.csv`
          );
        })
    );
  }

  get chatList() {
    return this.messageService.chatList;
  }

  get liveChatStatus() {
    return this.liveChatFG?.get('status');
  }
}
