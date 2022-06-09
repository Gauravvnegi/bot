import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { FeedbackTableService } from '../../services/table.service';

@Component({
  selector: 'hospitality-bot-action-overlay',
  templateUrl: './action-overlay.component.html',
  styleUrls: ['./action-overlay.component.scss'],
})
export class ActionOverlayComponent implements OnInit {
  isOpen = false;
  @Output() openDetail = new EventEmitter();
  feedbackStatusFG: FormGroup;
  constructor(
    private tableService: FeedbackTableService,
    private _fb: FormBuilder
  ) {
    this.initFG();
  }

  initFG() {
    this.feedbackStatusFG = this._fb.group({
      comment: [''],
    });
  }

  ngOnInit(): void {
    this.listenForDisableMenu();
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

  openDetailPage(event) {
    this.isOpen = false;
    this.openDetail.emit(event);
  }
}
