import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'hospitality-bot-form-action',
  templateUrl: './form-action.component.html',
  styleUrls: ['./form-action.component.scss'],
})
export class FormActionComponent implements OnInit {
  @ViewChild('fd') fd: HTMLElement;
  saveLabel = 'Create';
  resetLabel = 'Reset';
  id: boolean = false;
  @Input() bottomThreshold: number = 100; //746;
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
  isFixed = true;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mainLayout = document.getElementById('main-layout');
    this.mainLayout?.addEventListener('scroll', this.onScroll.bind(this));
  }

  resetForm() {
    if (this.id) return this.location.back();
    this.onReset.emit();
  }

  submitForm() {
    this.onSave.emit();
  }

  constructor(private elementRef: ElementRef, private location: Location) {}

  // Set the threshold for how close to the bottom the scroll position should be
  onScroll = () => {
    // Get the native elements from the ElementRe
    const fixedElementNativeElement: HTMLElement = this.fd;

    // Calculate the distance from the bottom of the container
    console.log(this.mainLayout, 'mainLayout');
    const distanceFromBottom =
      this.mainLayout.scrollHeight -
      (this.mainLayout.scrollTop + this.mainLayout.clientHeight);

    console.log(distanceFromBottom, 'distanceFromBottom');

    // Check if the distance from the bottom is less than the threshold
    // If so, unfixed the element; otherwise, fix it.
    if (distanceFromBottom <= this.bottomThreshold && this.isFixed) {
      this.isFixed = false;
    } else if (distanceFromBottom > this.bottomThreshold && !this.isFixed) {
      this.isFixed = true;
    }
  };
}
