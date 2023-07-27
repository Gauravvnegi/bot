import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Component({
  selector: 'hospitality-bot-form-action',
  templateUrl: './form-action.component.html',
  styleUrls: ['./form-action.component.scss'],
})
export class FormActionComponent implements OnInit {
  saveLabel = 'Create';
  resetLabel = 'Reset';
  id: boolean = false;
  @Input() bottomThreshold: number = 60; //746;
  @Input() type: stickyFormActionType = 'Sticky';
  referenceId: string = 'form-layout';
  constructor(private elementRef: ElementRef, private location: Location) {
    this.generateRandomId();
  }
  //746 for the form with table
  //100 for the form without table

  @Input() set isId(value: boolean) {
    if (value) {
      this.id = true;
      this.saveLabel = 'Update';
      this.resetLabel = 'Cancel';
    }
  }
  @Input() loading: boolean = false;
  @Output() onReset = new EventEmitter<Event>();
  @Output() onSave = new EventEmitter<Event>();
  mainLayout: HTMLElement;
  formLayout: HTMLElement;
  isFixed = true;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mainLayout = document.getElementById('main-layout');
    this.formLayout = document.getElementById(this.referenceId);
    this.mainLayout?.addEventListener('scroll', this.onScroll.bind(this));
  }

  resetForm() {
    if (this.id) return this.location.back();
    this.onReset.emit();
  }

  submitForm() {
    this.onSave.emit();
  }

  onScroll() {
    console.log(this.referenceId, 'referenceId');
    console.log(this.formLayout.scrollHeight, 'formLayout');
    const distanceFromBottom =
      this.formLayout.scrollHeight -
      (this.mainLayout.scrollTop + this.mainLayout.clientHeight);

    console.log(distanceFromBottom, 'distanceFromBottom');

    // Check if the user has scrolled close to the bottom
    if (distanceFromBottom <= 0 && this.isFixed) {
      // If we're at the bottom, set the position to fixed
      this.isFixed = false;
    } else if (distanceFromBottom > 0 && !this.isFixed) {
      // If we're not at the bottom, set the position to relative
      this.isFixed = true;
    }
  }

  generateRandomId() {
    this.referenceId = new Date().getUTCMilliseconds().toString();
  }

  ngOnDestroy() {
    this.mainLayout?.removeEventListener('scroll', this.onScroll.bind(this));
  }
}

export type stickyFormActionType = 'Sticky' | 'Non-Sticky';
