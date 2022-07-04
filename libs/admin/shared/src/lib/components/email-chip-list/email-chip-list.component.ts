import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { Component, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { SnackBarService } from '@hospitality-bot/shared/material';

@Component({
  selector: 'hospitality-bot-email-chip-list',
  templateUrl: './email-chip-list.component.html',
  styleUrls: ['./email-chip-list.component.scss'],
})
export class EmailChipListComponent implements OnInit {
  @Input() parentFG: FormGroup;
  @Input() name: string;
  @Input() disabled = false;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  constructor(
    private _snackbarService: SnackBarService,
    private _fb: FormBuilder
  ) {}

  ngOnInit(): void {}

  ngOnChanges() {
    if (this.disabled) this.parentFG.get(this.name).disable();
  }

  addEmail(event: MatChipInputEvent, control): void {
    let input = event.input;
    let value = event.value;

    // Add our keyword
    if ((value || '').trim()) {
      if (!this.isValidEmail(value)) {
        this._snackbarService.openSnackBarAsText('Invalid email format');
        return;
      } else {
        const controlValues = control.value.filter(
          (cValue) => cValue === value
        );
        if (!controlValues.length) {
          control.push(this._fb.control(value.trim()));
        }
      }
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  removeEmail(keyword: any, control: FormArray): void {
    let index = control.value.indexOf(keyword);

    if (index >= 0) {
      control.removeAt(index);
    }
  }

  isValidEmail(email): RegExpMatchArray {
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return !!email && typeof email === 'string' && email.match(emailRegex);
  }
}
