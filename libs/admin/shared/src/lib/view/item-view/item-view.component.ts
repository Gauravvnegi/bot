import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Option } from '../../types/form.type';
import { FormComponent } from '../../components/form-component/form.components';
import { AbstractControl, ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-item-view',
  templateUrl: './item-view.component.html',
  styleUrls: ['./item-view.component.scss'],
})
export class ItemViewComponent extends FormComponent implements OnInit {
  @Input() items: Option[];
  @Output() changeItem = new EventEmitter<Option>();

  constructor(public controlContainer: ControlContainer) {
    super(controlContainer);
  }

  ngOnInit(): void {}

  click(item: Option) {
    this.changeState(item);
    this.changeItem.emit(item);
  }

  changeState(item: Option) {
    const getFilteredItems = () => {
      const values: string[] = this.currentControl.value;
      if (values.find((data: string) => data == item.value)) {
        return values.filter((data) => data != item.value);
      } else {
        return [...values, item.value];
      }
    };
    this.currentControl.patchValue(getFilteredItems());
  }

  get currentControl(): AbstractControl {
    return this.parentFG.get(this.controlName);
  }

  get parentFG(): AbstractControl {
    return this.controlContainer.control;
  }

  isActive(item: Option) {
    return (
      !item.disabled &&
      this.currentControl.value.find((data) => data == item.value)
    );
  }
}
