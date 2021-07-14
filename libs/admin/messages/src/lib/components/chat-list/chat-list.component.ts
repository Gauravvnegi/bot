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
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, filter } from 'rxjs/operators';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';

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
  limit = 20;
  hotelId: string;
  chatList: IContactList;
  $subscription = new Subscription();
  contactFG: FormGroup;
  scrollView;
  showFilter = false;
  filterData = {};
  constructor(
    private messageService: MessageService,
    private _globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private _firebaseMessagingService: FirebaseMessagingService
  ) {}

  ngOnInit(): void {
    this.initFG();
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForSearchChanges();
    this.listenForRefreshData();
    this.listenForMessageNotification();
  }

  initFG() {
    this.contactFG = this.fb.group({
      search: [''],
    });
  }

  ngAfterViewChecked() {
    if (this.myScrollContainer && this.scrollView) {
      this.myScrollContainer.nativeElement.scrollTop = this.scrollView;
      this.scrollView = undefined;
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

  listenForRefreshData() {
    this.messageService.refreshData$.subscribe((response) => {
      if (response) {
        this.scrollView = this.myScrollContainer.nativeElement.scrollTop;
        this.loadChatList();
        this.messageService.refreshData$.next(false);
      }
    });
  }

  listenForMessageNotification() {
    this._firebaseMessagingService.currentMessage.subscribe((response) => {
      if (
        response &&
        (this.selected === null ||
          this.selected?.phone !== response.notification.body.split(',')[0])
      ) {
        if (this.contactFG.get('search').value.length < 3) {
          this.loadChatList();
        } else this.loadSearchList(this.contactFG.get('search').value);
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

  loadChatList() {
    this.$subscription.add(
      this.messageService
        .getChatList(
          this.hotelId,
          this.adminUtilityService.makeQueryParams([
            {
              hotelId: this.hotelId,
              limit: this.limit,
              ...this.filterData,
            },
          ])
        )
        .subscribe((response) => {
          response.length < this.limit
            ? (this.limit = response.length)
            : (this.limit = this.limit + 20);
          this.chatList = new ContactList().deserialize(response);
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
        this.myScrollContainer.nativeElement.scrollHeight &&
      this.limit > this.chatList.contacts.length
    ) {
      if (this.contactFG.get('search').value.length < 3) {
        this.scrollView = this.myScrollContainer.nativeElement.scrollHeight;
        this.loadChatList();
      } else this.loadSearchList(this.contactFG.get('search').value);
    }
  }

  loadSearchList(searchKey) {
    this.$subscription.add(
      this.messageService
        .searchChatList(
          this.hotelId,
          this.adminUtilityService.makeQueryParams([
            {
              limit: this.limit,
              key: searchKey,
              ...this.filterData,
            },
          ])
        )
        .subscribe((response) => {
          response.length < this.limit
            ? (this.limit = response.length)
            : (this.limit = this.limit + 20);
          this.chatList = new ContactList().deserialize(response);
        })
    );
  }

  listenForSearchChanges() {
    const formChanges$ = this.contactFG.valueChanges.pipe(
      filter(() => !!(this.contactFG.get('search') as FormControl).value)
    );

    formChanges$.pipe(debounceTime(1000)).subscribe((response) => {
      // setting minimum search character limit to 3
      if (response?.search.length >= 3) {
        this.limit = 20;
        this.loadSearchList(response?.search);
      } else {
        if (this.limit < 20) this.limit = 20;
        this.loadChatList();
      }
    });
  }

  handleFilter(event) {
    if (event.status) {
      this.limit = this.limit < 20 ? 20 : this.limit;
      this.filterData = event.data;
      if (this.contactFG.get('search').value.length < 3) {
        this.loadChatList();
      } else this.loadSearchList(this.contactFG.get('search').value);
      this.showFilter = false;
    }
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
