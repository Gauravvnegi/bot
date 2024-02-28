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
  @Input() reservationId: string;
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
  currentKotIndex = 0;

  viewOffer = false;
  loadingKotData = false;

  selectedOffer: Option;

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
    if (this.orderId || this.reservationId) this.listenForFormData();
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
      kotOffer: [''],
      viewKotInstruction: [false],
      viewKotOffer: [false],
      id: [null],
      itemOffers: [[]],
      selectedOffer: [null],
    };

    const formGroup = this.fb.group(data);
    this.kotFormArray.push(formGroup);

    if (this.orderId) formGroup.get('kotOffer').disable();

    const kotItemFormGroup = this.fb.group({
      kotItems: this.kotFormArray,
    });

    this.parentFormGroup.addControl('kotInformation', kotItemFormGroup);

    this.itemFormArray = this.kotFormArray.controls[0].get(
      'items'
    ) as FormArray;

    if (!this.orderId) this.listenForOfferChange();
  }

  // Method to add a new KOT dynamically
  addNewKOT(kotIndex: number) {
    const data = {
      items: new FormArray([]),
      kotInstruction: [''],
      kotOffer: [''],
      viewKotInstruction: [false],
      viewKotOffer: [false],
      id: [null],
      itemOffers: [[]],
      selectedOffer: [null],
    };
    this.kotFormArray.push(this.fb.group(data));
    this.itemFormArray = this.kotFormArray.controls[kotIndex].get(
      'items'
    ) as FormArray;

    if (!this.orderId) this.listenForOfferChange();
  }

  createNewItemFields(newItem: MenuItem, kotIndex: number = 0) {
    const data: Record<
      keyof MenuItem & { viewItemInstruction: boolean },
      any
    > = {
      id: [null],
      itemId: [newItem?.itemId],
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
          const menuItems = res.kots[0].items.map((item) =>
            new MenuItem().deserialize(item.menuItem)
          );
          this.currentKotIndex = res?.kots?.length;
          let kotIndex = 0;
          // Process all KOTs efficiently using a single loop
          for (const kot of res.kots) {
            kotIndex > 0 && this.addNewKOT(kotIndex); // Create KOT with unique ID

            const menuItems = kot.items
              .filter((item) => item.menuItem) // Filter only items with menu items
              .map((item) => new MenuItem().deserialize(item.menuItem)); // Deserialize menu items

            menuItems.forEach((item) => this.createNewItemFields(item));
            kotIndex++; // Increment the index for the next KOT
          }

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
      this.formService.removeItemFromSelectedItems(itemControl.value.itemId);
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

  listenForOfferChange() {
    this.$subscription.add(
      this.kotFormArray
        .at(this.currentKotIndex)
        .get('kotOffer')
        .valueChanges.subscribe((res) => {
          if (res) {
            const selectedOffer = this.kotFormArray
              .at(this.currentKotIndex)
              .value.itemOffers.find((offer) => offer.value === res);
            this.kotFormArray
              .at(this.currentKotIndex)
              .patchValue({ selectedOffer: selectedOffer });
          }
        })
    );
  }

  removeOffer() {
    this.kotFormArray.at(this.currentKotIndex).patchValue({
      kotOffer: [],
      viewKotOffer: false,
    });
  }

  listenForItemsChange() {
    let newKotAdded = false;

    this.$subscription.add(
      this.formService.selectedMenuItems.subscribe((res) => {
        if (res) {
          this.selectedItems = res;

          // Add New Kot while updating
          if (
            this.currentKotIndex > 0 &&
            this.selectedItems.length &&
            !newKotAdded
          ) {
            this.addNewKOT(this.currentKotIndex);
            newKotAdded = true;
          }

          // Add and remove menu items
          const existingIds = this.itemFormArray.value.map(
            (item) => item.itemId
          );
          const newItems = res?.filter(
            (item) => !existingIds.includes(item.itemId)
          );

          this.totalAmount = this.selectedItems?.reduce(
            (total, currentItem) => total + currentItem.dineInPrice,
            0
          );

          const removedItems = this.itemFormArray.controls?.filter(
            (control) =>
              !res?.some((item) => item.itemId === control.value.itemId)
          );

          this.selectedItems.length && this.mapItemOffers();

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

  mapItemOffers() {
    const itemOffers = this.selectedItems?.reduce((acc, item) => {
      const offers = item.offers.map((offer) => ({
        label: offer.name,
        value: offer.id,
        offerDescription: offer.description,
        validDate: offer.endDate,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
      }));

      // Merge offers from the current item with accumulated offers, filtering out duplicates
      offers.forEach((offer) => {
        const existingOfferIndex = acc.findIndex(
          (accOffer) => accOffer.value === offer.value
        );
        if (existingOfferIndex === -1) {
          acc.push(offer); // Add the offer if it's not already in the accumulator
        }
      });

      return acc;
    }, []);
    this.kotFormArray
      .at(this.currentKotIndex)
      .patchValue({ itemOffers: itemOffers });
  }

  removeItemFields(index: number) {
    this.itemFormArray.removeAt(index);
    !this.itemFormArray.value.length &&
      this.kotFormArray.at(this.currentKotIndex).patchValue({
        viewKotOffer: false,
        viewKotInstruction: false,
        kotOffer: [],
      });
  }

  clear() {
    this.formService.removeItemFromSelectedItems();
  }

  getTotalItemUnits(itemControls: FormGroup[]) {
    let totalUnits = 0;

    if (itemControls?.length) {
      itemControls.forEach((itemControl) => {
        totalUnits += itemControl.get('unit').value;
      });
    }

    return totalUnits;
  }

  applyOffer(formGroup?: FormGroup) {
    formGroup &&
      formGroup.get('viewKotOffer').patchValue(true, { emitEvent: false });
  }

  trackItemControls(index: number, item: FormGroup) {
    return item.get('itemId').value;
  }

  /**
   * Toggles the control visibility in item and
   * kot controls for instruction and offer inputs
   */
  toggleControlVisibility(
    type: 'Instruction' | 'Offer' | 'ItemInstruction',
    formGroup: FormGroup
  ) {
    const controlName =
      type === 'ItemInstruction' ? `view${type}` : `viewKot${type}`;
    formGroup.get(controlName).patchValue(!formGroup.get(controlName).value, {
      emitEvent: false,
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get orderInfoControls() {
    return (this.parentFormGroup.get('reservationInformation') as FormGroup)
      .controls as Record<
      keyof MenuForm['reservationInformation'],
      AbstractControl
    >;
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
//     get: (keyName: keyof KotItemsForm) => AbstractControl;
//   };
// };

type Controls = Omit<AbstractControl, 'value'> & {
  value: KotItemsForm;
};
