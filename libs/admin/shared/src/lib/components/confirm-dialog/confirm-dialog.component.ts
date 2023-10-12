import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'hospitality-bot-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss'],
})
export class ConfirmDialogComponent implements OnInit {
  header: string;
  message: string;
  noLabel = 'No';
  noIcon = 'pi pi-times';
  yesLabel = 'Yes';
  yesIcon = 'pi pi-check';
  @Input() isVisible = false;
  @Output() onChange = new EventEmitter();

  @Input() set props(values: ConfirmDialogProps) {
    Object.entries(values).forEach(([key, value]) => {
      this[key] = value;
    });
  }

  constructor() {}

  ngOnInit(): void {}

  onActionClicked(action: boolean) {
    this.onChange.emit(action);
    this.isVisible = false;
  }
}

export interface ConfirmDialogProps {
  header: string;
  noIcon?: string;
  noLabel?: string;
  yesLabel?: string;
  yesIcon?: string;
  message?: string;
}