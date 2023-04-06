import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';

@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent {
  @Input() userFormGroup: FormGroup;

  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields() {
    const data = this.fields.reduce((prev, curr) => {
      const value = curr.required ? ['', Validators.required] : [''];
      prev[curr.name] = value;
      return prev;
    }, {});
    this.userFormGroup.addControl('roomInformation', this.fb.group(data));
  }
}
