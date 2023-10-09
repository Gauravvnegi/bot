import { Component, EventEmitter, Input, OnInit } from '@angular/core';
import { NightAuditService } from '../../services/night-audit.service';
import { FormActionConfig } from 'libs/admin/shared/src/lib/components/form-component/form-action/form-action.component';
import { itemList } from '../../constants/night-audit.const';
import { timer } from 'rxjs';

@Component({
  selector: 'night-audit',
  templateUrl: './night-audit.component.html',
  styleUrls: ['./night-audit.component.scss'],
})
export class NightAuditComponent implements OnInit {
  constructor() {}
  @Input() isSidebar = true;
  @Input() onClose = new EventEmitter();
  pageTitle = 'Night Audit';
  currentDate = new Date();
  itemList = itemList;
  activeStep = 0;
  loading = false;

  // Manage logged config
  usersLoggedOut = false;

  ngOnInit(): void {}

  onActive(event) {
    this.activeStep = event.index;
  }

  close() {
    this.onClose.emit(false);
  }
}
