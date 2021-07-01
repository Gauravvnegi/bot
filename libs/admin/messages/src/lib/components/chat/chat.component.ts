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
import { Chats, IChats } from '../../models/message.model';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { interval, Subscription } from 'rxjs';

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
  chatList = {};
  constructor(
    private messageService: MessageService,
    private fb: FormBuilder,
    private snackBarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private _globalFilterService: GlobalFilterService
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
    this.getChat({ offset: 0, limit: 20 });
  }

  ngAfterViewChecked() {
    this.scrollChat();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
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

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  openGuestInfo(value): void {
    this.guestInfo.emit({ openGuestInfo: true, data: value });
  }

  getChat(config = { offset: 0, limit: 20 }, scrollHeight?: number): void {
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
              this.chat = new Chats().deserialize(response);
              this.chat.messages = DateService.sortObjArrayByTimeStamp(
                this.chat.messages,
                'timestamp'
              );
              this.chatList = this.messageService.filterMessagesByDate(
                this.chat.messages
              );
              scrollHeight
                ? (this.scrollView = scrollHeight)
                : (this.scrollBottom = true);
              this.isLoading = false;
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

  sendMessage(): void {
    if (this.chatFG.invalid) {
      this.chatFG.markAsTouched();
      this.snackBarService.openSnackBarAsText('Please enter a message');
      return;
    }

    const values = this.chatFG.getRawValue();
    values.receiverId = this.selectedChat.phone;

    this.$subscription.add(
      this.messageService.sendMessage(this.hotelId, values).subscribe(
        (response) => {
          this.chatFG.get('message').setValue('');
          this.getChat({
            offset: 0,
            limit: this.limit,
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

  refreshChat() {
    this.getChat(
      {
        offset: 0,
        limit: this.limit % 20 === 0 ? this.limit - 20 : this.limit + 1,
      },
      0
    );
  }

  get chatDates() {
    return Object.keys(this.chatList);
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
