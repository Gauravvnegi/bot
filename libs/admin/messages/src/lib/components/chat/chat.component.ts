import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
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
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @Input() refreshData;
  @Input() selectedChat;
  @Output() guestInfo = new EventEmitter();
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  hotelId: string;
  chat: IChats;
  chatFG: FormGroup;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  offset = 0;
  $subscription = new Subscription();
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
  }

  ngOnChanges(): void {
    this.getChat();
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

  openGuestInfo(): void {
    this.guestInfo.emit({ openGuestInfo: true });
  }

  getChat(config = { offset: 0, limit: 20 }): void {
    if (this.selectedChat) {
      this.chatFG.patchValue({
        message: '',
        receiverId: this.selectedChat.phone,
        channelType: 'whatsapp',
        messageType: 'DATA_TEXT',
      });
      this.$subscription.add(
        this.messageService
          .getChat(
            this.hotelId,
            this.selectedChat.receiverId,
            this.adminUtilityService.makeQueryParams([
              {
                ...config,
                ...{
                  hotelId: this.hotelId,
                  phone: this.selectedChat.phone,
                  timestamp: DateService.getCurrentTimeStamp(),
                },
              },
            ])
          )
          .subscribe(
            (response) => {
              this.chat = new Chats().deserialize(response);
              this.chat.messages = DateService.sortObjArrayByTimeStamp(
                this.chat.messages,
                'timestamp'
              );
            },
            ({ error }) => {
              this.chat = new Chats();
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

    this.$subscription.add(
      this.messageService
        .sendMessage(
          'd63974e6-9d37-4eff-bf93-81b26f6751ee',
          this.chatFG.getRawValue()
        )
        .subscribe(
          (response) => {
            this.chatFG.get('message').setValue('');
            this.getChat();
          },
          ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
        )
    );
  }

  loadMoreChat(config) {
    this.$subscription.add(
      this.messageService
        .getChat(
          this.hotelId,
          this.selectedChat.receiverId,
          this.adminUtilityService.makeQueryParams([
            {
              ...config,
              ...{
                hotelId: this.hotelId,
                phone: this.selectedChat.phone,
                timestamp: 0,
              },
            },
          ])
        )
        .subscribe(
          (response) => {
            this.chat.messages = [
              ...this.chat.messages,
              ...new Chats().deserialize(response).messages,
            ];
            this.chat.messages = DateService.sortObjArrayByTimeStamp(
              this.chat.messages,
              'timestamp'
            );
          },
          ({ error }) => this.snackBarService.openSnackBarAsText(error.message)
        )
    );
  }

  onUp() {
    const start = this.offset;
    this.offset += 20;
    this.getChat({ offset: start, limit: this.offset });
  }

  checkForEnterKey(event) {
    if (event.keyCode === 13) {
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    if (this.myScrollContainer)
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
  }
}
