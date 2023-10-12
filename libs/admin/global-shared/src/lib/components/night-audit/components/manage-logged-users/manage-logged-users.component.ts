import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { cols, title } from '../../constants/manage-login.table';
import { ActionConfigType } from '../../../../types/night-audit.type';
import { MenuItem } from 'primeng/api';
import { timer } from 'rxjs';
import { LoggedInUsers } from '../../models/night-audit.model';

@Component({
  selector: 'hospitality-bot-manage-logged-users',
  templateUrl: './manage-logged-users.component.html',
  styleUrls: [
    '../../night-audit.component.scss',
    './manage-logged-users.component.scss',
  ],
})
export class ManageLoggedUsersComponent implements OnInit {
  title = title;
  cols = cols;
  loading = false;
  actionConfig: ActionConfigType;
  usersLoggedOut: boolean;
  isTimerStart = false;

  @Input() items: LoggedInUsers[];
  @Input() activeIndex = 0;
  @Input() stepList: MenuItem[];
  @Output() indexChange = new EventEmitter<number>();

  constructor() {}

  ngOnInit(): void {
    this.initActionConfig();
  }

  initActionConfig(postLabel?: string, postDisabled?: boolean) {
    this.actionConfig = {
      preHide: this.activeIndex == 0,
      preLabel: this.activeIndex != 0 ? 'Back' : undefined,
      postLabel: postLabel
        ? postLabel
        : this.activeIndex == 0
        ? 'Forcefully Logout Users >'
        : 'Next',
      ...(postDisabled && { postDisabled: true }),
      preSeverity: 'primary',
    };
  }

  handleNext() {
    if (!this.isTimerStart && this.activeIndex == 0) {
      // this.handleMangeLoggedIn(); // TODO: Uncomment for timer
      //these below line should be removed, after uncommenting above line
      this.isTimerStart = true;
      this.initActionConfig('Next', false);
      this.items = [];
    } else if (this.activeIndex + 1 < this.stepList.length)
      this.indexChange.emit(this.activeIndex + 1);
  }

  handlePrev() {
    if (this.activeIndex > 0) this.indexChange.emit(this.activeIndex - 1);
  }

  /**
   * @function handleMangeLoggedIn mange logged-in component actions
   */
  handleMangeLoggedIn() {
    this.usersLoggedOut = true;
    this.isTimerStart = true;
    const targetTime = Date.now() + 5 * 60 * 1000;
    // Update the display every second
    timer(0, 1000).subscribe(() => {
      const now = Date.now();
      const remainingTime = targetTime - now;

      if (remainingTime <= 0) {
        // call api
        this.usersLoggedOut = false;
        this.initActionConfig('Next', false);
        this.items = [];
      } else {
        const minutes = Math.floor(remainingTime / 60000);
        const seconds = Math.floor((remainingTime % 60000) / 1000);
        this.initActionConfig(
          `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`,
          true
        );
      }
    });
  }
}
