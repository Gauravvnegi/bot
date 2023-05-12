import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { UserService } from 'libs/admin/shared/src/index';
import { Subscription } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'admin-notification-settings',
  templateUrl: './notification-settings.component.html',
  styleUrls: ['./notification-settings.component.scss'],
})
export class NotificationSettingsComponent implements OnInit {
  customizeFG: FormGroup;
  @Output() closeCustomize = new EventEmitter();
  private $subscription = new Subscription();
  notificationSettings;
  loading = false;
  constructor(
    private notificationService: NotificationService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    this.customizeFG = fb.group({});
  }

  ngOnInit(): void {
    this.getNotificationSettings();
  }

  getNotificationSettings() {
    this.loading = true;
    this.$subscription.add(
      this.notificationService
        .getNotificationSettings(this.userService.getLoggedInUserId())
        .subscribe((response) => {
          Object.keys(response).forEach((key) => {
            this.customizeFG.addControl(key, new FormGroup({}));
            response[key].forEach((item) => {
              (this.customizeFG.get(key) as FormGroup).addControl(
                item.id,
                new FormControl(item.active)
              );
            });
          });
          this.notificationSettings = response;
          this.loading = false;
        })
    );
  }

  updatePackageStatus(event, id: string) {
    this.$subscription.add(
      this.notificationService
        .updateNotificationSetting(
          this.userService.getLoggedInUserId(),
          id,
          event.checked
        )
        .subscribe((response) => {
          console.log('Updated');
        })
    );
  }

  close() {
    this.closeCustomize.emit();
  }
}
