import {
  AfterViewChecked,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { ContactList, IContactList } from '../../models/message.model';
import { MessageService } from '../../services/messages.service';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';

@Component({
  selector: 'hospitality-bot-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy, AfterViewChecked {
  @Input() refreshData;
  @Input() selected;
  @Output() selectedChat = new EventEmitter();
  @ViewChild('contactList') private myScrollContainer: ElementRef;
  hotelId: string;
  chatList: IContactList;
  $subscription = new Subscription();
  scrollView = 0;
  constructor(
    private messageService: MessageService,
    private _globalFilterService: GlobalFilterService
  ) {}

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
  }

  ngAfterViewChecked() {
    if (this.myScrollContainer) {
      this.myScrollContainer.nativeElement.scrollTop = this.scrollView;
    }
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.loadChatList();
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

  loadChatList() {
    this.$subscription.add(
      this.messageService.getChatList(this.hotelId).subscribe((response) => {
        this.chatList = new ContactList().deserialize(response);
        this.selectedChat.emit({ value: this.chatList.contacts[0] });
      })
    );
  }

  onChatSelect(value) {
    this.selectedChat.emit({ value: value });
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (
      this.myScrollContainer &&
      this.myScrollContainer.nativeElement.scrollTop ===
        this.myScrollContainer.nativeElement.scrollHeight
    ) {
      this.loadChatList();
      this.scrollView = this.myScrollContainer.nativeElement.scrollHeight;
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
