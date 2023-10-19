import { Location } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ButtonVariant } from '../../../types/form.type';
import { ButtonSeverity } from '../../button/button.component';

@Component({
  selector: 'hospitality-bot-form-action',
  templateUrl: './form-action.component.html',
  styleUrls: ['./form-action.component.scss'],
})
export class FormActionComponent implements OnInit {
  //pre-action
  preLabel = 'Reset';
  preLabelWithId = 'Cancel';
  preVariant = 'outlined';
  preSeverity = 'reset';
  preDisabled = false;
  preHide = false;

  //post-action
  postLabel = 'Create';
  postLabelWithId = 'Update';
  postVariant = 'contained';
  postSeverity = 'primary';
  postDisabled = false;
  postHide = false;

  @Input() disabled: boolean = false;
  @Input() isSticky: boolean = true; //props to make the form action sticky or non-sticky

  id: boolean = false;
  referenceId: string = 'form-layout';

  constructor(private elementRef: ElementRef, private location: Location) {
    this.generateRandomId();
  }

  @Input() set config(value: FormActionConfig) {
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        this[key] = value[key];
      }
    }
  }

  @Input() set isId(value: boolean) {
    if (value) {
      this.id = true;
      this.preLabel = this.preLabelWithId;
      this.postLabel = this.postLabelWithId;
    }
  }
  @Input() loading: boolean = false;
  @Output() onPreAction = new EventEmitter<Event>();
  @Output() onPostAction = new EventEmitter<Event>();

  mainLayout: HTMLElement;
  formLayout: HTMLElement;
  isFixed = true;

  ngOnInit(): void {}

  ngAfterViewInit() {
    this.mainLayout = document.getElementById('main-layout');
    this.formLayout = document.getElementById(this.referenceId);
    this.mainLayout?.addEventListener('scroll', this.onScroll.bind(this));
  }

  preAction() {
    if (this.id && this.preLabel.toLocaleLowerCase() === 'cancel')
      return this.location.back();
    this.onPreAction.emit();
  }

  postAction() {
    this.onPostAction.emit();
  }

  onScroll() {
    const distanceFromBottom =
      this.formLayout?.scrollHeight -
      (this.mainLayout?.scrollTop + this.mainLayout?.clientHeight);

    // Check if the user has scrolled close to the bottom
    if (distanceFromBottom <= 0 && this.isFixed) {
      // If we're at the bottom, set the position to relative
      this.isFixed = false;
    } else if (distanceFromBottom > 0 && !this.isFixed) {
      // If we're not at the bottom, set the position to fixed
      this.isFixed = true;
    }
  }

  generateRandomId() {
    this.referenceId = new Date().getUTCMilliseconds().toString();
  }

  ngOnDestroy() {
    // this.mainLayout?.removeEventListener('scroll', this.onScroll.bind(this));
  }
}

export type FormActionConfig = {
  preLabel: string;
  postLabel: string;
  preVariant: ButtonVariant;
  postVariant: ButtonVariant;
  postSeverity: ButtonSeverity;
  preSeverity: ButtonSeverity;
  PreLabelWithId: string;
  postLabelWithId: string;
  preDisabled?: boolean;
  postDisabled?: boolean;
  isSticky: boolean;
  id: boolean;
  referenceId: string;
};
