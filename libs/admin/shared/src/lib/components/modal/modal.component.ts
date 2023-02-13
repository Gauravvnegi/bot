import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalAction } from '../../types/fields.type';

@Component({
  selector: 'hospitality-bot-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  displayModal = false;

  heading: string = 'Notification';
  descriptions: string[] = ['You are about to perform an action'];

  @Input() actions: ModalAction[] = [
    {
      label: 'Okay',
      onClick: () => {
        this.close();
      },
      variant: 'contained',
    },
  ];

  @Input() set show(value: boolean) {
    this.displayModal = value;
  }

  @Input() set content(val: { heading: string; description: string[] }) {
    this.heading = val.heading;
    this.descriptions = val.description;
  }

  @Output() onClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  close() {
    this.displayModal = false;
    this.onClose.emit();
  }
}
