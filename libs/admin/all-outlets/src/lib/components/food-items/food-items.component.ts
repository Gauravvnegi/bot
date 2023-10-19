import { Component, OnInit } from '@angular/core';
import {
  BaseDatatableComponent,
  Option,
  TableService,
} from '@hospitality-bot/admin/shared';
import { cols } from '../../constants/data-table';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DeleteAction } from '../../constants/form';

@Component({
  selector: 'hospitality-bot-food-items',
  templateUrl: './food-items.component.html',
  styleUrls: [
    '../../../../../shared/src/lib/components/datatable/datatable.component.scss',
    './food-items.component.scss',
  ],
})
export class FoodItemsComponent extends BaseDatatableComponent
  implements OnInit {
  tableName = 'Items';
  cols = cols['FOOD_ITEMS'];
  useForm: FormGroup;
  foodItemsArray: FormArray;
  menuItems: Option[] = [{ label: 'Delete', value: 'DELETE_ITEM' }];

  constructor(
    public fb: FormBuilder,
    protected tabFilterService: TableService
  ) {
    super(fb, tabFilterService);
  }

  ngOnInit(): void {
    this.initTableForm();
  }

  initTableForm() {
    this.useForm = this.fb.group({
      foodItems: this.fb.array([]),
    });
    this.foodItemsArray = this.useForm.get('foodItems') as FormArray;
    this.addNewItems();
  }

  addNewItems() {
    const itemsFormGroup = this.fb.group({
      foodCategory: ['', Validators.required],
      type: ['', Validators.required],
    });

    this.foodItemsArray.push(itemsFormGroup);
  }

  handleMenuClick(
    { item: { value } }: { item: { value: DeleteAction } },
    index: number
  ) {
    if (value === DeleteAction.DELETE_ITEM) {
      this.removeItem(index);
    }
  }

  removeItem(index: number) {}

  onImportItems() {}
}
