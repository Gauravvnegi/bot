import { Component, Input } from '@angular/core';
import { ControlContainer } from '@angular/forms';
import { FormComponent } from '../form.components';
import { ignoreElements } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent extends FormComponent {
  @Input() maxLength: number;
  @Input() min: number;
  @Input() max: number;
  @Input() controlName: string;
  inputLength = 0;

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {
    if(!this.subtitle && this.maxLength){
      const control = this.controlContainer.control.get(this.controlName);
      control.valueChanges.subscribe((value)=>{
        this.inputLength = value?.length || 0;
        this.subtitle =  `${this.inputLength}/${this.maxLength}`
      })
    }
    
    this.initInputControl();
  }
}
