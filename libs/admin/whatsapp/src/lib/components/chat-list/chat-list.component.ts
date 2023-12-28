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
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { convertToNormalCase } from 'libs/admin/shared/src/lib/utils/valueFormatter';

@Component({
  selector: 'hospitality-bot-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
})
export class ChatListComponent implements OnInit, OnDestroy {
  @Input() selected;
  @Output() selectedChat = new EventEmitter();
  limit = 20;
  entityId: string;
  chatList: IContactList;
  $subscription = new Subscription();
  contactFG: FormGroup;
  showFilter = false;
  filterData = {};
  autoSearched = false;
  paginationDisabled = false;
  contextOptions: ContextmenuOptions[] = [];

  constructor(
    private messageService: MessageService,
    private globalFilterService: GlobalFilterService,
    private adminUtilityService: AdminUtilityService,
    private fb: FormBuilder,
    private _firebaseMessagingService: FirebaseMessagingService,
    private snackbarService: SnackBarService,
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

  /**
   * @function listenForGlobalFilters To listen for global filters and load data when filter value is changed.
   */
  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.entityId = this.globalFilterService.entityId;
        this.loadChatList();
      })
    );
  }

  listenForRefreshData() {
    this.messageService.refreshData$.subscribe((response) => {
      if (response) {
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

  loadChatList(updatePagination = true) {
    this.$subscription.add(
      this.messageService
        .getChatList(
          this.entityId,
          this.adminUtilityService.makeQueryParams([
            {
              entityId: this.entityId,
              limit: this.limit,
              sort: 'isImportant',
              ...this.filterData,
            },
          ])
        )
        .subscribe((response) => {
          if (updatePagination) this.updatePagination(response.length);
          this.chatList = new ContactList().deserialize(
            response,
            this.globalFilterService.timezone
          );
          this.messageService.setWhatsappUnreadContactCount(
            this.chatList.unreadContacts
          );
          if (this.selected) this.markChatAsRead(this.selected);
        })
    );
  }

  updatePagination(responseLength) {
    this.paginationDisabled = responseLength < this.limit;
    this.limit = this.paginationDisabled
      ? this.limit
      : (this.limit = this.limit + 20);
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
        .markAsRead(this.entityId, value.receiverId, { unreadCount: 0 })
        .subscribe((response) => {
          this.chatList.contacts[index].unreadCount = response.unreadCount;
          this.chatList.unreadContacts -= 1;
          this.messageService.setWhatsappUnreadContactCount(
            this.chatList.unreadContacts
          );
        });
    }
  }

  loadMore() {
    if (!this.paginationDisabled) {
      if (this.contactFG.get('search').value.length < 3) {
        this.loadChatList();
      } else this.loadSearchList(this.contactFG.get('search').value);
    }
  }

  loadSearchList(searchKey) {
    this.$subscription.add(
      this.messageService
        .searchChatList(
          this.entityId,
          this.adminUtilityService.makeQueryParams([
            {
              limit: this.limit,
              key: searchKey,
              ...this.filterData,
            },
          ])
        )
        .subscribe((response) => {
          if (response) {
            this.updatePagination(response.length);

            this.chatList = new ContactList().deserialize(
              response,
              this.globalFilterService.timezone
            );
            if (this.autoSearched) {
              this.selectedChat.emit({ value: this.chatList.contacts[0] });
            }
          } else {
            this.chatList = new ContactList().deserialize(
              [],
              this.globalFilterService.timezone
            );
            this.snackbarService.openSnackBarWithTranslate(
              {
                translateKey: `messages.SUCCESS.NO_CONTACT_FOUND`,
                priorityMessage: `No contact found with search key: ${searchKey}!`,
              },
              '',
              { panelClass: 'success' }
            );
            this.autoSearched = false;
          }
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
          this.notificationService.$whatsappNotification.next(null);
        }
      })
    );
  }

  handelContextMenu(contact) {
    this.contextOptions = [
      !!contact?.important
        ? {
            label: 'Unpin',
            name: 'UNIMPORTANT',
            icon: 'unpin-icon',
            command: () =>
              this.handleRightClick({
                name: 'UNIMPORTANT',
                id: contact?.receiverId,
              }),
          }
        : {
            label: 'Pin to top',
            name: 'IMPORTANT',
            icon: 'pin-icon',
            command: () =>
              this.handleRightClick({
                name: 'IMPORTANT',
                id: contact?.receiverId,
              }),
          },
      !!contact?.mute
        ? {
            label: 'Unmute',
            name: 'UNMUTE',
            icon: 'unmute-icon',
            command: () =>
              this.handleRightClick({
                name: 'UNMUTE',
                id: contact?.receiverId,
              }),
          }
        : {
            label: 'Mute',
            name: 'MUTE',
            icon: 'mute-icon',
            command: () =>
              this.handleRightClick({ name: 'MUTE', id: contact?.receiverId }),
          },
    ];
  }

  handleRightClick(data: { name: ContextmenuName; id: string }) {
    const { name, id } = data || {};

    switch (name) {
      case 'IMPORTANT':
        this.handleMarking(id, true, 'markAsImportant');
        break;

      case 'UNIMPORTANT':
        this.handleMarking(id, false, 'markAsImportant');
        break;

      case 'MUTE':
        this.handleMarking(id, true, 'markAsMute');
        break;

      case 'UNMUTE':
        this.handleMarking(id, false, 'markAsMute');
        break;
    }
  }

  handleMarking(
    id: string,
    value: boolean,
    method: 'markAsMute' | 'markAsImportant'
  ) {
    const key = method === 'markAsImportant' ? 'important' : 'mute';
    const options = {
      [key]: value,
    };

    this.messageService[method](this.entityId, id, options).subscribe((res) => {
      this.chatList.contacts.forEach((item) => {
        if (item?.receiverId === id) {
          item[key] = options[key];
        }
      });

      method === 'markAsImportant' && this.loadChatList();

      this.snackbarService.openSnackBarAsText('Status Updated', '', {
        panelClass: 'success',
      });
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}

type ContextmenuName = 'IMPORTANT' | 'MUTE' | 'UNMUTE' | 'UNIMPORTANT';

type ContextmenuOptions = {
  name: ContextmenuName;
  label: string;
  icon?: string;
  command: () => void;
};
