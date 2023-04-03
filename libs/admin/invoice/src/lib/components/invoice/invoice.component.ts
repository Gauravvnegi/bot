import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { invoiceRoutes } from '../../constants/routes';
import { InvoiceForm } from '../../types/forms.types';
import { cols } from '../../constants/payment';
import { PaymentField } from '../../types/forms.types';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';

@Component({
  selector: 'hospitality-bot-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  readonly errorMessages = errorMessages;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  tableFormArray: FormArray;
  useForm: FormGroup;
  taxes: Option[] = [];
  tableValue = [];
  discountOption: Option[] = [
    { label: '%Off', value: '%Off' },
    { label: 'Flat', value: 'Flat' },
  ];
  editPaidAmount: Option[] = [{ label: 'Edit', value: 'Edit' }];

  /* Payment Variables */
  currentAmount = 0;
  discountedAmount = 0;
  paidAmount = 0;
  totalDiscount = 0;
  dueAmount = 0;
  // #Convert the above in form structure (paymentForm_) - add type also

  editMode = false;
  viewDiscountTab = false;
  paidInput = false;
  isValidDiscount = true;
  isValidPaid = true;

  /**Table Variable */
  selectedRows;
  cols = cols;

  // #Move to constant, give type here and in menu component, initialise ngInit - initOptionsConfig
  addDiscount = [{ label: 'Add Discount', value: 'Add Discount' }];
  editDiscount = [
    { label: 'Edit Discount', value: 'Edit Discount' },
    { label: 'Remove Discount', value: 'Remove Discount' },
  ];

  constructor(private fb: FormBuilder) {
    this.initPageHeaders();
  }

  get inputControl() {
    // #change name to something (add get paymentForm control)
    return this.useForm.controls as Record<keyof InvoiceForm, AbstractControl>;
  }

  ngOnInit(): void {
    this.initForm();
    this.initOptionsConfig();
  }

  /**
   * Initialize page title and navigator
   */
  initPageHeaders() {
    const { title, navRoutes } = invoiceRoutes['createInvoice'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    this.useForm = this.fb.group({
      invoiceNumber: ['#8544556CY'],
      confirmationNumber: ['#8544556CY'],
      guestName: ['', Validators.required],
      companyName: ['', Validators.required],

      additionalNote: [''],
      tableData: new FormArray([]),

      cashierName: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      departureDate: ['', Validators.required],
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      adults: ['', Validators.required],
      children: ['', Validators.required],

      discountType: ['', Validators.required],
      discount: [''],

      paid: [''],
      paidAmount: [''],
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;
    this.addNewFieldTableForm();
    this.initDetails();

    //# initFormSubscription
    this.useForm.valueChanges.subscribe((res) => {
      // console.log(res);
    });
  }

  /**
   * @function initForm Initialize form
   */
  initDetails() {
    this.tableValue = [{ id: 1 }];
    this.useForm.patchValue({
      tableData: [
        // call api service - dummy response
        {
          description: 'Room',
          unit: 1,
          unitPrice: 400,
          amount: 400,
          tax: ['CGST'],
          totalAmount: 448,
        },
      ],
      discountType: '%Off',
      discount: 0,
      paid: 0,
    });
  }

  /**
   * @function initForm Initialize tax options
   */
  initOptionsConfig() {
    this.taxes = [
      // Move to constant
      { label: 'CGST @12%', value: 'CGST' },
      { label: 'SGST @12%', value: 'SGST' },
      { label: 'VAT', value: 'VAT' },
      { label: 'GST @18%', value: 'GST' },
      { label: 'None', value: 'none' },
    ];
  }

  /**
   * Add new entry in the payment field
   */
  addNewFieldTableForm() {
    const data: Record<keyof PaymentField, any> = {
      description: ['', Validators.required],
      unit: [''],
      unitPrice: [''],
      amount: [''],
      tax: [[]],
      totalAmount: [''],
    };
    this.tableFormArray.push(this.fb.group({ ...data }));
    this.registerUnitPriceChange();
  }

  /**
   * To add new charged
   */
  addNewCharges() {
    this.addNewFieldTableForm();
    this.tableValue.push({ id: this.tableValue.length + 1 });
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */
  registerUnitPriceChange() {
    const currentFormGroup = this.tableFormArray.at(
      this.tableFormArray.controls.length - 1
    ) as FormGroup;
    const { unit, unitPrice, tax } = currentFormGroup.controls;

    const setAmount = () => {
      let discount = 0;
      for (let i of tax.value) {
        // #Check it option service (manage)
        if (i === 'SGST' || i === 'CGST' || i === 'VAT') {
          discount += 12;
        } else if (i === 'GST') {
          discount += 18;
        } else {
          discount = 0;
        }
      }

      const amount = unit.value * unitPrice.value;
      const totalAmount =
        Math.round(
          (amount + (amount * discount) / 100 + Number.EPSILON) * 100
        ) / 100;

      if (amount) {
        currentFormGroup.patchValue({
          amount: amount,
          totalAmount: totalAmount,
        });
        this.currentAmount = totalAmount;
        this.discountedAmount = totalAmount;
        this.dueAmount = totalAmount;
      }
    };

    unit.valueChanges.subscribe(setAmount);
    unitPrice.valueChanges.subscribe(setAmount);
    tax.valueChanges.subscribe(setAmount);
  }

  /**
   * @function registerDiscountChanges To handle changes in discount tab
   */
  registerDiscountChanges() {
    const { discountType, discount } = this.useForm.controls;

    const setError = () => {
      if (
        discount.value > this.currentAmount &&
        discountType.value === 'Flat'
      ) {
        return 'isNumError';
      }

      if (discount.value > 100 && discountType.value === '%Off') {
        return 'isPercentError';
      }
    };

    const clearError = () => {
      if (discount.value > 0) {
        discount.setErrors(null);
        this.isValidDiscount = true;
      }
    };

    const discountSubscription = () => {
      clearError();
      const error = setError();
      if (error === 'isNumError') {
        discount.setErrors({ isPriceLess: true });
        this.isValidDiscount = false;
      }
      if (error === 'isPercentError') {
        discount.setErrors({ moreThan100: true });
        this.isValidDiscount = false;
      }
    };

    discountType.valueChanges.subscribe(discountSubscription);
    discount.valueChanges.subscribe(discountSubscription);
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */
  registerPaidChanges() {
    const { paid, paidAmount } = this.useForm.controls;
    const setError = () => {
      if (paid.value + +paidAmount.value > this.discountedAmount) {
        return 'moreThanTotal';
      }
    };

    const clearError = () => {
      if (paidAmount.value > 0) {
        paidAmount.setErrors(null);
        this.isValidPaid = true;
      }
    };

    paidAmount.valueChanges.subscribe(() => {
      clearError();
      const error = setError();
      if (error === 'moreThanTotal') {
        paidAmount.setErrors({ moreThanTotal: true });
        this.isValidPaid = false;
      }
    });
  }

  onSaveDiscount() {
    this.viewDiscountTab = false;
    const { discountType, discount } = this.useForm.controls;

    if (discount.value > 0) {
      this.editMode = true;
    }
    if (discountType.value === 'Flat') {
      this.discountedAmount -= discount.value;
      this.totalDiscount = this.currentAmount - this.discountedAmount;
      this.dueAmount = this.discountedAmount;
    } else {
      this.discountedAmount -= (this.discountedAmount * discount.value) / 100;
      this.totalDiscount =
        Math.round(
          (this.currentAmount - this.discountedAmount + Number.EPSILON) * 100
        ) / 100;
      this.dueAmount = this.discountedAmount;
    }
  }

  onAddDiscount(e) {
    this.viewDiscountTab = true;
    this.registerDiscountChanges();
  }

  onEditDiscount(e) {
    if (e.item.value === 'Edit Discount') {
      this.editMode = false;
      this.viewDiscountTab = true;
      this.totalDiscount = 0;
      this.discountedAmount = this.currentAmount;
      this.dueAmount = this.currentAmount;
    } else {
      this.resetDiscount();
    }
  }

  resetDiscount() {
    if (this.viewDiscountTab) {
      this.viewDiscountTab = false;
    }
    this.editMode = false;
    this.useForm.patchValue({
      discountType: '%Off',
      discount: 0,
    });
    this.totalDiscount = 0;
    this.discountedAmount = this.currentAmount;
    this.dueAmount = this.currentAmount;
  }

  onEditPaid(e) {
    if (e.item.value === 'Edit') {
      this.paidInput = true;
      this.registerPaidChanges();
    }
  }

  savePaidAmount() {
    if (this.paidInput) {
      this.paidInput = false;
    }
    const paidValue = +this.useForm.get('paidAmount').value;

    this.paidAmount += paidValue;
    this.useForm.patchValue({
      paid: this.paidAmount,
      paidAmount: 0,
    });

    this.dueAmount =
      Math.round(
        (this.discountedAmount - this.paidAmount + Number.EPSILON) * 100
      ) / 100;
  }

  /**
   * To remove selected charges
   */
  removeSelectedCharges() {
    console.log(this.selectedRows, 'selected rows');
  }

  onRowSelect(event) {
    console.log('onRowSelect', event);
    // debugger;
  }

  onRowUnselect(event) {
    console.log('onRowUnselect', event);
  }

  onToggleSelectAll({ checked }) {
    console.log(
      'onToggleSelectAll',
      this.selectedRows?.length,
      this.selectedRows
    );
    // if (checked) {
    //   this.selectedRows = this.selectedRows.shift();
    // }
  }
}
