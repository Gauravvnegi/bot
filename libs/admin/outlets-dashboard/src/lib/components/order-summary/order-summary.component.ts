import { Component, OnInit } from '@angular/core';
import { mealPreferenceConfig } from '../../types/menu-order';
import { OutletFormService } from '../../services/outlet-form.service';
import {
  AbstractControl,
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { OutletTableService } from '../../services/outlet-table.service';
import { Subscription } from 'rxjs';
import { PaymentMethodList } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { Option } from '@hospitality-bot/admin/shared';
import { MenuItem } from 'libs/admin/all-outlets/src/lib/models/outlet.model';
import { KotItemsForm, MenuForm } from '../../types/form';

@Component({
  selector: 'hospitality-bot-order-summary',
  templateUrl: './order-summary.component.html',
  styleUrls: ['./order-summary.component.scss'],
})
export class OrderSummaryComponent implements OnInit {
  selectedItems: MenuItem[] = [];

  readonly mealPreferenceConfig = mealPreferenceConfig;

  parentFormGroup: FormGroup;
  kotFormArray: FormArray;
  itemFormArray: FormArray;

  $subscription = new Subscription();

  entityId: string;

  paymentOptions: Option[] = [];
  itemOffers: Option[] = [];

  totalAmount: number = 0;
  viewOffer = false;
  totalItemUnits = 0;

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

  createNewItemFields(newItem: MenuItem) {
    const data: Record<
      keyof MenuItem & { viewItemInstruction: boolean },
      any
    > = {
      id: [newItem.id],
      itemName: [newItem.name],
      unit: [1],
      mealPreference: [newItem.mealPreference],
      price: [newItem.dineInPrice],
      itemInstruction: [''],
      image: [newItem.imageUrl],
      viewItemInstruction: [false],
    };

    const itemFormGroup = this.fb.group(data);
    this.itemFormArray.push(itemFormGroup);
  }

  /**
   * Decrement unit of the selected menu item
   */
  decrementQuantity(itemControl: Controls) {
    itemControl
      .get('unit')
      .patchValue(itemControl.value.unit - 1, { emitEvent: false });
    itemControl.value.unit && this.totalItemUnits--;
    this.totalAmount = this.totalAmount - itemControl.get('price').value;
    itemControl.value.unit === 0 &&
      this.formService.removeItemFromSelectedItems(itemControl.value.id);
  }

  /**
   * Increment unit of the selected menu item
   */
  incrementQuantity(itemControl: Controls) {
    itemControl
      .get('unit')
      .patchValue(itemControl.value.unit + 1, { emitEvent: false });
    this.totalItemUnits++;
    this.totalAmount = this.totalAmount + itemControl.get('price').value;
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
    this.$subscription.add(
      this.formService.selectedMenuItems.subscribe((res) => {
        if (res?.length) {
          this.selectedItems = res;
          const existingIds = this.itemFormArray.value.map((item) => item.id);
          const newItems = res.filter((item) => !existingIds.includes(item.id));
          const removedItems = this.itemFormArray.controls.filter(
            (control) => !res.some((item) => item.id === control.value.id)
          );
          this.totalAmount = this.selectedItems.reduce(
            (total, currentItem) => total + currentItem.dineInPrice,
            0
          );
          if (newItems.length > 0 || removedItems.length > 0) {
            newItems.forEach((newItem) => {
              this.totalItemUnits++;
              this.createNewItemFields(newItem);
            });

            removedItems.forEach((removedItem) => {
              this.totalItemUnits--;
              const index = this.itemFormArray.controls.indexOf(removedItem);
              this.removeItemFields(index);
            });
          }
        }
      })
    );
  }

  removeItemFields(index: number) {
    this.itemFormArray.removeAt(index);
  }

  clear() {
    this.formService.removeItemFromSelectedItems();
  }

  /**
   * Toggles the control visibility in item and
   * kot controls for instruction and offer inputs
   */
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

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get orderInfoControls() {
    return (this.parentFormGroup.get('orderInformation') as FormGroup)
      .controls as Record<keyof MenuForm['orderInformation'], AbstractControl>;
  }

  get paymentControls() {
    return (this.parentFormGroup.get('paymentInformation') as FormGroup)
      .controls as Record<
      keyof MenuForm['paymentInformation'],
      AbstractControl
    >;
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

type Controls = Omit<AbstractControl, 'value'> & {
  value: KotItemsForm;
};
