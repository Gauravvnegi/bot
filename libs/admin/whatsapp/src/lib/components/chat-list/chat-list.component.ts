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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { FirebaseMessagingService } from 'apps/admin/src/app/core/theme/src/lib/services/messaging.service';
import { NotificationService } from 'apps/admin/src/app/core/theme/src/lib/services/notification.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { SnackBarService } from 'libs/shared/material/src';
import { Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { ContactList, IContactList } from '../../models/message.model';
import { MessageService } from '../../services/messages.service';

@Component({
  selector: 'hospitality-bot-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy, AfterViewChecked {
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
  autoSearched = false;
  constructor(
    private messageService: MessageService,
    private _globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private _firebaseMessagingService: FirebaseMessagingService,
    private _snackBarService: SnackBarService,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  registerListeners(): void {
    this.listenForGlobalFilters();
    this.listenForSearchChanges();
    this.listenForRefreshData();
    this.listenForMessageNotification();
    this.listenForApplicationActive();
    this.listenForQueryParam();
    this.listenForStateData();
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

  listenForQueryParam() {
    this.$subscription.add(
      this.route.queryParams.subscribe((response) => {
        if (response['phoneNumber']) {
          this.contactFG.patchValue({ search: response['phoneNumber'] });
          this.autoSearched = true;
        }
      })
    );
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
      if (response) {
        this.limit = 20;
        if (this.contactFG.get('search').value.length < 3) {
          this.loadChatList();
        } else this.loadSearchList(this.contactFG.get('search').value);
      }
    });
  }

  listenForApplicationActive() {
    this._firebaseMessagingService.tabActive.subscribe((response) => {
      if (response) {
        if (this.contactFG.get('search').value.length < 3) {
          this.loadChatList(false);
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

  loadChatList(updatePagination = true) {
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
        .subscribe(
          (response) => {
            if (updatePagination) this.updatePagination(response.length);
            this.chatList = new ContactList().deserialize(
              response,
              this._globalFilterService.timezone
            );
            this.messageService.setWhatsappUnreadContactCount(
              this.chatList.unreadContacts
            );
            if (this.selected) this.markChatAsRead(this.selected);
          },
          ({ error }) => this._snackBarService.openSnackBarAsText(error.message)
        )
    );
  }

  updatePagination(responseLength) {
    this.limit =
      responseLength < this.limit ? this.limit : (this.limit = this.limit + 20);
  }

  onChatSelect(value) {
    this.markChatAsRead(value);
    this.selectedChat.emit({ value: value });
  }

  markChatAsRead(value) {
    const index = this.chatList.contacts.findIndex(
      (obj) => obj.receiverId === value.receiverId
    );
    if (this.chatList.contacts[index].unreadCount) {
      this.messageService
        .markAsRead(this.hotelId, value.receiverId, { unreadCount: 0 })
        .subscribe(
          (response) => {
            this.chatList.contacts[index].unreadCount = response.unreadCount;
            this.chatList.unreadContacts -= 1;
            this.messageService.setWhatsappUnreadContactCount(
              this.chatList.unreadContacts
            );
          },
          ({ error }) => this._snackBarService.openSnackBarAsText(error.message)
        );
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(event) {
    if (
      this.myScrollContainer &&
      this.myScrollContainer.nativeElement.offsetHeight +
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
        .subscribe(
          (response) => {
            if (response) {
              this.limit =
                response.length < this.limit ? this.limit : this.limit + 20;
              this.chatList = new ContactList().deserialize(
                response,
                this._globalFilterService.timezone
              );
              if (this.autoSearched) {
                this.selectedChat.emit({ value: this.chatList.contacts[0] });
              }
            } else {
              this.chatList = new ContactList().deserialize(
                [],
                this._globalFilterService.timezone
              );
              this._snackBarService.openSnackBarAsText(
                `No contact found with search key: ${searchKey}!`,
                '',
                { panelClass: 'success' }
              );
              this.autoSearched = false;
            }
          },
          ({ error }) => this._snackBarService.openSnackBarAsText(error.message)
        )
    );
  }

  listenForSearchChanges() {
    const formChanges$ = this.contactFG.valueChanges.pipe(
      filter(() => !!(this.contactFG.get('search') as FormControl).value)
    );

    formChanges$.pipe(debounceTime(1000)).subscribe((response) => {
      // setting minimum search character limit to 3
      if (response?.search.length >= 3) {
        this.loadSearchList(response?.search);
      } else {
        this.autoSearched = false;
        this.loadChatList();
      }
    });
  }

  handleFilter(event) {
    if (event.status) {
      this.filterData = event.data;
      if (this.contactFG.get('search').value.length < 3) {
        this.loadChatList();
      } else this.loadSearchList(this.contactFG.get('search').value);
      this.showFilter = false;
    }
  }

  listenForStateData() {
    this.$subscription.add(
      this.notificationService.$whatsappNotification.subscribe((response) => {
        if (response) {
          this.contactFG.patchValue({ search: response });
          this.autoSearched = true;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
