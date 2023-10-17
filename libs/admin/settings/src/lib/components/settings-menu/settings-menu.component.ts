import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  SettingsMenuItem,
  SubscriptionPlanService,
} from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-settings-menu',
  templateUrl: './settings-menu.component.html',
  styleUrls: ['./settings-menu.component.scss'],
})
export class SettingsMenuComponent implements OnInit {
  settings: SettingsMenuItem[];
  isImageLoaded = false;
  isSideBar = false;
  @Output() closeEvent = new EventEmitter(false);

  constructor(
    private router: Router,
    private subscriptionService: SubscriptionPlanService
  ) {}

  ngOnInit(): void {
    this.settings = this.subscriptionService.settings;
  }

  close() {
    this.closeEvent.emit(false);
  }

  onImageLoad() {
    this.isImageLoaded = true;
  }
}
