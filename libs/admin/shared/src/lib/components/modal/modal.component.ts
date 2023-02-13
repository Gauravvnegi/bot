import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalAction, ModalContent } from '../../types/fields.type';

@Component({
  selector: 'hospitality-bot-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
  displayModal = false;

  heading: string = 'Notification';
  descriptions: string[] = ['Are you sure?'];

  defaultAction: ModalAction = {
    label: 'Okay',
    onClick: () => {
      this.close();
    },
    variant: 'contained',
  };

  @Input() actions: ModalAction[];

  @Input() set show(value: boolean) {
    this.displayModal = value;
  }

  @Input() set content(value: ModalContent) {
    if (value) {
      this.heading = value.heading;
      this.descriptions = value.description;
    }
  }

  @Output() onClose = new EventEmitter();

  constructor() {}

  ngOnInit(): void {}

  close() {
    this.displayModal = false;
    this.onClose.emit();
  }
}
