import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-modal-header',
  templateUrl: './modal-header.component.html',
  styleUrls: ['./modal-header.component.scss', '../datatable.component.scss'],
})
export class ModalHeaderComponent implements OnInit {
  @Input() tableName: string;
  @Output() onModalClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  closeModal(): void {
    this.onModalClose.emit(true);
  }
}
