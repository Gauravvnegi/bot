import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';

@Component({
  selector: 'hospitality-bot-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends FormComponent {
  @Input() isHideSpinners = false;
  @Input() maxLength: number;
  @Input() min: number;
  @Input() max: number;
  @Input() controlName: string;

  strike = false;
  inputLength = 0;

  @Input() viewButton = false;
  @Input() buttonText = 'Save';

  @Output() onSaveText = new EventEmitter();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    if (!this.subtitle && this.maxLength) {
      this.subtitle = `${this.inputLength}/${this.maxLength}`;
      const control = this.controlContainer.control.get(this.controlName);
      const calculateInput = (value) => {
        this.inputLength = value?.length ?? 0;
        this.subtitle = `${this.inputLength}/${this.maxLength}`;
      };
      calculateInput(control.value);
      control.valueChanges.subscribe((value) => {
        calculateInput(value);
      });
    }
    this.initInputControl();
  }

  /**
   *
   * to disable value changes on scroll
   */
  disableValueChangesOnScroll(e) {
    // Prevent the input value change
    e.target.blur();

    // Prevent the page/container scrolling
    e.stopPropagation();
  }

  get getWrapperNgClasses() {
    return {
      ...this.wrapperNgClasses,
      'hide-spinner': this.isHideSpinners,
    };
  }

  handleKeyClick(event: KeyboardEvent) {
    this.handleKeyDown(event);
    this.viewButton && this.handleEnterClick(event);
  }

  handleEnterClick(event: KeyboardEvent): void {
    // Check if the pressed key is Enter and the focus is on the current input field
    if (event.key === 'Enter' && event.target === event.currentTarget) {
      this.onSaveText.emit();
    }
  }
}
