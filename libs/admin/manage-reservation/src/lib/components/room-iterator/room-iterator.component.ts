import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IteratorComponent } from 'libs/admin/shared/src/lib/components/iterator/iterator.component';

@Component({
  selector: 'hospitality-bot-room-iterator',
  templateUrl: './room-iterator.component.html',
  styleUrls: ['./room-iterator.component.scss'],
})
export class RoomIteratorComponent extends IteratorComponent {
  @Input() userFormGroup: FormGroup;
  @Output() onSearch = new EventEmitter();
  @Output() paginate = new EventEmitter();

  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  /**
   * @function createNewFields To get the initial value config
   */
  createNewFields(): void {
    const data = this.fields.reduce((prev, curr) => {
      const value = curr.required ? ['', Validators.required] : [''];
      prev[curr.name] = value;
      return prev;
    }, {});
    this.userFormGroup.addControl('roomInformation', this.fb.group(data));
  }

  loadMoreRoomTypes(): void {
    this.paginate.emit();
  }

  searchRoomTypes(event): void {
    this.onSearch.emit(event);
  }
}
