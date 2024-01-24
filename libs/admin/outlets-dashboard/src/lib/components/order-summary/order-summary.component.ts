import { Component, OnInit } from '@angular/core';
import { MenuItemCard, mealPreferenceConfig } from '../../types/menu-order';
import { OutletFormService } from '../../services/outlet-form.service';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { OutletTableService } from '../../services/outlet-table.service';
import { Subscription } from 'rxjs';
import { PaymentMethodList } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { Option } from '@hospitality-bot/admin/shared';

@Component({
  selector: 'hospitality-bot-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  selectedItems: MenuItemCard[] = [];
  kotList: string[] = ['item'];

  readonly mealPreferenceConfig = mealPreferenceConfig;

  parentFormGroup: FormGroup;
  kotFormArray: FormArray;
  itemFormArray: FormArray;

  $subscription = new Subscription();

  entityId: string;

  paymentOptions: Option[] = [];
  itemOffers: Option[] = [];

  constructor(
    private fb: FormBuilder,
    private formService: OutletFormService,
    public controlContainer: ControlContainer,
    private outletService: OutletTableService
  ) {}

  ngOnInit(): void {
    this.entityId = this.formService.entityId;
    this.initForm();
    this.getPaymentMethod();
    this.listenForItemsChange();
  }

  initForm() {
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.kotFormArray = this.fb.array([]);

    const data = {
      items: new FormArray([]),
      kotInstruction: [''],
      kotOffer: [[]],
      viewKotInstruction: [false],
      viewKotOffer: [false],
    };
    const formGroup = this.fb.group(data);
    this.kotFormArray.push(formGroup);

    const kotItemFormGroup = this.fb.group({
      kotItems: this.kotFormArray,
    });

    this.parentFormGroup.addControl('kotInformation', kotItemFormGroup);

    this.itemFormArray = this.kotFormArray.controls[0].get(
      'items'
    ) as FormArray;
  }

  createNewItemFields(newItem: MenuItemCard) {
    const data: Record<
      keyof MenuItemCard & { viewItemInstruction: boolean },
      any
    > = {
      id: [newItem.id],
      itemName: [newItem.itemName],
      unit: [1],
      mealPreference: [newItem.mealPreference],
      price: [newItem.price],
      itemInstruction: [''],
      image: [newItem.image],
      viewItemInstruction: [false],
    };

    const itemFormGroup = this.fb.group(data);
    this.itemFormArray.push(itemFormGroup);
  }

  decrementQuantity(itemControl: FormControl) {
    const unitControl = itemControl.get('unit');
    unitControl.patchValue(unitControl.value - 1, { emitEvent: false });
    unitControl.value === 0 &&
      this.formService.removeItemFromSelectedItems(itemControl.value.id);
  }

  incrementQuantity(index: number) {
    const currentUnit = this.itemFormArray.at(index).get('unit') as FormControl;
    const newUnitValue = currentUnit.value + 1;
    currentUnit.setValue(newUnitValue, { emitEvent: false });
  }

  getPaymentMethod(): void {
    this.$subscription.add(
      this.outletService.getPaymentMethod(this.entityId).subscribe(
        (response) => {
          const types = new PaymentMethodList()
            .deserialize(response)
            .records.map((item) => item.type);
          const labels = [].concat(
            ...types.map((array) => array.map((item) => item.label))
          );
          this.paymentOptions = labels.map((label) => ({
            label: label,
            value: label,
          }));
        },
        (error) => {}
      )
    );
  }

  listenForItemsChange() {
    this.formService.selectedMenuItems.subscribe((res) => {
      if (res) {
        this.selectedItems = res;
        const existingIds = this.itemFormArray.value.map((item) => item.id);
        const newItems = res.filter((item) => !existingIds.includes(item.id));
        const removedItems = this.itemFormArray.controls.filter(
          (control, index) => !res.some((item) => item.id === control.value.id)
        );

        if (newItems.length > 0 || removedItems.length > 0) {
          newItems.forEach((newItem) => {
            this.createNewItemFields(newItem);
          });

          removedItems.forEach((removedItem) => {
            const index = this.itemFormArray.controls.indexOf(removedItem);
            this.removeItemFields(index);
          });
        }
      }
    });
  }

  removeItemFields(index: number) {
    this.itemFormArray.removeAt(index);
  }

  clear() {}

  cancelOrder() {}

  toggleControlVisibility(
    type: 'Instruction' | 'Offer' | 'ItemInstruction',
    index: number,
    array: FormArray
  ) {
    const controlName =
      type === 'ItemInstruction' ? `view${type}` : `viewKot${type}`;
    array
      .at(index)
      .get(controlName)
      .patchValue(!array.at(index).get(controlName).value, {
        emitEvent: false,
      });
  }
}

// type KOTFormArray = Omit<FormArray, 'at'> & {
//   at: (
//     idx: number
//   ) => Omit<AbstractControl, 'get'> & {
//     get: (keyName: keyof KotForm) => AbstractControl;
//   };
// };

// type ItemFormArray = Omit<FormArray, 'at'> & {
//   at: (
//     idx: number
//   ) => Omit<AbstractControl, 'get'> & {
//     get: (keyName: keyof ItemForm) => AbstractControl;
//   };
// };

type KotForm = {
  items: FormArray;
  instruction: string;
  kotInstruction: string;
  kotOffer: string[];
  viewKotInstructions: boolean;
  viewKotOffer: boolean;
};

type ItemForm = {
  itemId: string;
  unit: number;
  itemInstruction: string;
  viewInstruction: string;
  mealPreference: string;
  price: string;
};
