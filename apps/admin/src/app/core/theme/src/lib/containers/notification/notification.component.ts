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
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminUtilityService, UserService } from 'libs/admin/shared/src/index';
import { NotificationService } from '../../services/notification.service';
import {
  Notification,
  NotificationList,
} from '../../data-models/notifications.model';
import { GlobalFilterService } from '../../services/global-filters.service';
import * as moment from 'moment';
@Component({
  selector: 'admin-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent
  implements OnInit, OnDestroy, AfterViewChecked {
  @Input() notificationFilterData;
  @Output() onCloseNotification = new EventEmitter();
  @Output() filterData = new EventEmitter();
  @ViewChild('notificationList') private myScrollContainer: ElementRef;
  scrollView;
  filterFG: FormGroup;
  isCustomizeVisible = false;
  isFilterVisible = false;
  limit = 20;
  notifications: Notification[];
  private $subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    private notificationService: NotificationService,
    private adminUtilityService: AdminUtilityService,
    public userService: UserService,
    public globalFilterService: GlobalFilterService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.getNotifications();
  }

  ngAfterViewChecked() {
    if (this.myScrollContainer && this.scrollView) {
      this.myScrollContainer.nativeElement.scrollTop = this.scrollView;
      this.scrollView = undefined;
    }
  }

  initFG(): void {
    this.filterFG = this.fb.group({
      status: [''],
      fromDate: [''],
      toDate: [''],
    });
  }

  getNotifications() {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        this.notificationFilterData,
        { limit: this.limit },
      ]),
    };
    this.$subscription.add(
      this.notificationService
        .getNotificationHistory(this.userService.getLoggedInUserid(), config)
        .subscribe((response) => {
          this.notifications = new NotificationList().deserialize(response);
          this.limit =
            response.length < this.limit
              ? this.limit
              : (this.limit = this.limit + 20);
        })
    );
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(_) {
    if (
      this.myScrollContainer &&
      this.myScrollContainer.nativeElement.offsetHeight +
        this.myScrollContainer.nativeElement.scrollTop ===
        this.myScrollContainer.nativeElement.scrollHeight &&
      this.limit > this.notifications.length
    ) {
      this.getNotifications();
    }
  }

  closePopup() {
    let data = this.notificationFilterData;
    data.fromDate = data.fromDate
      ? moment(data.fromDate).unix() * 1000
      : data.fromDate;
    data.toDate = data.toDate ? moment(data.toDate).unix() * 1000 : data.toDate;
    this.onCloseNotification.emit();
  }

  handleCustomize(event) {
    event.stopPropagation();
    this.isCustomizeVisible = true;
  }

  deleteNotification(event, item: Notification) {
    event.stopPropagation();
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([{ id: item.id }]),
    };
    this.$subscription.add(
      this.notificationService
        .deleteNotification(this.userService.getLoggedInUserid(), config)
        .subscribe((_) => this.getNotifications())
    );
  }

  dismisAll() {
    if (this.notifications?.length) {
      const config = {
        queryObj: '',
      };
      this.$subscription.add(
        this.notificationService
          .deleteNotification(this.userService.getLoggedInUserid(), config)
          .subscribe((_) => this.getNotifications())
      );
    }
  }

  handleApplyFilter(event) {
    if (event.status) {
      this.notificationFilterData = event.data;
      this.filterData.emit({ data: event.data });
      this.getNotifications();
    }
    this.isFilterVisible = false;
  }

  openFilterForm() {
    if (!this.isFilterVisible) {
      let data = this.notificationFilterData;
      data.fromDate = data.fromDate ? moment(data.fromDate) : data.fromDate;
      data.toDate = data.toDate ? moment(data.toDate) : data.toDate;
      this.filterFG.patchValue(data);
      this.isFilterVisible = true;
      this.isCustomizeVisible = false;
    }
  }

  handleCustomizeClose() {
    this.isCustomizeVisible = false;
    this.getNotifications();
  }

  openNotifications(event, item) {
    event.stopPropagation();
    this.$subscription.add(
      this.notificationService
        .updateNotificationStatus(this.userService.getLoggedInUserid(), item.id)
        .subscribe((_) => console.log('Notification status updated'))
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
