import { I } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { FeedbackTableService } from '../../services/table.service';
import { Subscription } from 'rxjs';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';

@Component({
  selector: 'hospitality-bot-action-overlay',
  templateUrl: './action-overlay.component.html',
  styleUrls: ['./action-overlay.component.scss'],
})
export class ActionOverlayComponent implements OnInit {
  isOpen = false;
  type: string;
  globalQueries = [];
  @Input() rowDataStatus;
  @Input() guestId;
  @Output() openDetail = new EventEmitter();
  @Output() statusUpdate = new EventEmitter();
  feedbackStatusFG: FormGroup;
  private $subscription: Subscription = new Subscription();
  constructor(
    private tableService: FeedbackTableService,
    private _fb: FormBuilder,
    private feedbackService: FeedbackTableService,
    protected _snackbarService: SnackBarService,
    private globalFilterService: GlobalFilterService
  ) {
    this.initFG();
  }

  initFG() {
    this.feedbackStatusFG = this._fb.group({
      comment: [''],
    });
  }

  ngOnInit(): void {
    this.statusType();
    this.listenForDisableMenu();
  }

  statusType() {
    if (this.rowDataStatus == 'TODO') this.type = 'INPROGRESS';
    else if (this.rowDataStatus === 'INPROGRESS') this.type = 'RESOLVED';
    else this.type = this.rowDataStatus;
  }

  handleButtonClick(event) {
    event.stopPropagation();
    if (!this.isOpen) this.tableService.$disableContextMenus.next(true);
    this.isOpen = !this.isOpen;
  }

  listenForDisableMenu() {
    this.tableService.$disableContextMenus.subscribe((response) => {
      if (response && this.isOpen) this.isOpen = false;
    });
  }

  updateStatus() {
    this.statusUpdate.emit({ statusType: this.type, id: this.guestId });
  }

  openDetailPage(event) {
    this.isOpen = false;
    this.openDetail.emit(event);
  }
}
