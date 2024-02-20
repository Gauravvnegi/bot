import { Component, Input, OnInit } from '@angular/core';
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
  @Input() orderId: string;
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
  kotLength = 0;
  loadingKotData = false;

  constructor(
    private fb: FormBuilder,
    private formService: OutletFormService,
    public controlContainer: ControlContainer,
    private outletService: OutletTableService
  ) {}

  ngOnInit(): void {
    this.initDetails();
    this.initForm();
    this.getPaymentMethod();
    this.listenForItemsChange();
    if (this.orderId) this.listenForFormData();
  }

  initDetails() {
    this.entityId = this.formService.entityId;
    this.parentFormGroup = this.controlContainer.control as FormGroup;
    this.kotFormArray = this.fb.array([]);
  }

  initForm() {
    const data = {
      items: new FormArray([]),
      kotInstruction: [''],
      kotOffer: [[]],
      viewKotInstruction: [false],
      viewKotOffer: [false],
      id: [null],
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

  // Method to add a new KOT dynamically
  addNewKOT(kotIndex: number) {
    const data = {
      items: new FormArray([]),
      kotInstruction: [''],
      kotOffer: [[]],
      viewKotInstruction: [false],
      viewKotOffer: [false],
    };
    this.kotFormArray.push(this.fb.group(data));
    this.itemFormArray = this.kotFormArray.controls[kotIndex].get(
      'items'
    ) as FormArray;
  }

  createNewItemFields(newItem: MenuItem, kotIndex: number = 0) {
    const data: Record<
      keyof MenuItem & { viewItemInstruction: boolean },
      any
    > = {
      id: [newItem?.id],
      itemName: [newItem?.name],
      unit: [1],
      mealPreference: [newItem?.mealPreference],
      price: [newItem?.dineInPrice],
      itemInstruction: [''],
      image: [newItem?.imageUrl],
      viewItemInstruction: [false],
    };

    const itemFormGroup = this.fb.group(data);
    this.itemFormArray.push(itemFormGroup);
  }

  listenForFormData() {
    this.loadingKotData = true;
    this.$subscription.add(
      this.formService.orderFormData.subscribe((res) => {
        if (res) {
          const menuItems = res.items
            .filter((item) => item.menuItem)
            .map((item) => new MenuItem().deserialize(item.menuItem));
          this.kotLength = res.kots.length;
          menuItems.forEach((item) => {
            this.createNewItemFields(item);
          });
          this.loadingKotData = false;
        }
      })
    );
  }

  /**
   * Decrement unit of the selected menu item
   */
  decrementQuantity(itemControl: Controls) {
    itemControl
      .get('unit')
      .patchValue(itemControl.value.unit - 1, { emitEvent: false });
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
    let newKotAdded = false;

    this.$subscription.add(
      this.formService.selectedMenuItems.subscribe((res) => {
        if (res) {
          this.selectedItems = res;

          // Add New Kot while updating
          if (this.kotLength > 0 && this.selectedItems.length && !newKotAdded) {
            this.addNewKOT(this.kotLength);
            newKotAdded = true;
          }

          // Add and remove menu items
          const existingIds = this.itemFormArray.value.map((item) => item.id);
          const newItems = res?.filter(
            (item) => !existingIds.includes(item.id)
          );

          this.totalAmount = this.selectedItems?.reduce(
            (total, currentItem) => total + currentItem.dineInPrice,
            0
          );

          const removedItems = this.itemFormArray.controls?.filter(
            (control) => !res?.some((item) => item.id === control.value.id)
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
