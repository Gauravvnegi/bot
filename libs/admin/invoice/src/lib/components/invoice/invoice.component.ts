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

  editMode = false;
  viewDiscountTab = false;
  viewPaidTab = false;
  isValidDiscount = true;
  isValidPaid = true;

  /**Table Variable */
  selectedRows;
  cols = cols;

  // #Move to constant, give type here and in menu component, initialise ngInit - initOptionsConfig
  addDiscount = [{ label: 'Add Discount', value: 'Add Discount' }];
  editDiscount = [
    { label: 'Edit Discount', value: 'editDiscount' },
    { label: 'Remove Discount', value: 'removeDiscount' },
  ];

  constructor(private fb: FormBuilder) {
    this.initPageHeaders();
  }

  get inputControl() {
    return this.useForm.controls as Record<keyof InvoiceForm, AbstractControl>;
  }

  get currentAmount() {
    return this.useForm.get('currentAmount');
  }
  get discountedAmount() {
    return this.useForm.get('discountedAmount');
  }
  get totalDiscount() {
    return this.useForm.get('totalDiscount');
  }
  get paidAmount() {
    return this.useForm.get('paidAmount');
  }
  get dueAmount() {
    return this.useForm.get('dueAmount');
  }
  get discount() {
    return this.useForm.get('discount');
  }
  get discountType() {
    return this.useForm.get('discountType');
  }
  get paidValue() {
    return this.useForm.get('paidValue');
  }
  get paid() {
    return this.useForm.get('paid');
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

      currentAmount: [''],
      discountedAmount: [''],
      totalDiscount: [''],
      paidAmount: [''],
      dueAmount: [''],

      discount: [''],
      discountType: [''],

      paidValue: [''],
      paid: [''],

      cashierName: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      departureDate: ['', Validators.required],
      roomNumber: ['', Validators.required],
      roomType: ['', Validators.required],
      adults: ['', Validators.required],
      children: ['', Validators.required],
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;

    this.addNewFieldTableForm();

    this.initDetails();
    this.initFormSubscription();
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
      currentAmount: 448,
      totalDiscount: 0,
      discountedAmount: 448,
      paidAmount: 50,
      dueAmount: 398,  

      discountType: '%Off',
      discount: 0,
      paidValue: 50,
      paid: 0,
    });
  }
  
  initFormSubscription(){
    this.registerDiscountChanges();
    this.registerPaidChanges();
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
        if (i === 'SGST' || i === 'CGST' || i === 'VAT') {
          discount += 12;
        } else if (i === 'GST') {
          discount += 18;
        } else {
          discount = 0;
        }
      }

      const amount = unit.value * unitPrice.value;
      const totalValue = amount + (amount * discount) / 100;

      if (amount) {
        currentFormGroup.patchValue({
          amount: amount,
          totalAmount: totalValue,
        });
      }
    }; 
    unit.valueChanges.subscribe(setAmount);
    unitPrice.valueChanges.subscribe(setAmount);
    tax.valueChanges.subscribe(setAmount);


    this.tableFormArray.valueChanges.subscribe((values)=>{
      const prices = values.map((value)=>value.totalAmount);
      const totalValue = prices.reduce((acc, price)=> acc+ price, 0);

      this.currentAmount.setValue(totalValue);
      this.discountedAmount.setValue(this.currentAmount.value - this.totalDiscount.value);
      this.dueAmount.setValue(this.discountedAmount.value - this.paidValue.value);
    })
  }

  /**
   * @function registerDiscountChanges To handle changes in discount tab
   */
  registerDiscountChanges() {
    const setError = () => {
      if (
        this.discount.value > this.currentAmount.value &&
        this.discountType.value === 'Flat'
      ) {
        return 'isNumError';
      }

      if (this.discount.value > 100 && this.discountType.value === '%Off') {
        return 'isPercentError';
      }

      if(this.discountedAmount.value<this.paidAmount.value){
        return 'maxOccupancy';
      }
    };

    const clearError = () => {
      if (this.discount.value > 0) {
        this.discount.setErrors(null);
        this.isValidDiscount = true;
      }
    };

    const discountSubscription = () => {
      clearError();
      const error = setError();
      if (error === 'isNumError') {
        this.discount.setErrors({ isPriceLess: true });
        this.isValidDiscount = false;
      }
      if (error === 'isPercentError') {
        this.discount.setErrors({ moreThan100: true });
        this.isValidDiscount = false;
      }
      if(error === 'maxOccupancy'){
        this.discount.setErrors({ maxOccupancy: true})
        this.isValidDiscount = false;
      }

      this.handleDiscount();

    };

    this.discountType.valueChanges.subscribe(discountSubscription);
    this.discount.valueChanges.subscribe(discountSubscription);
    this.discountedAmount.valueChanges.subscribe(discountSubscription);
    this.paidAmount.valueChanges.subscribe(discountSubscription);
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */
  registerPaidChanges() {
    // const { paidValue, paid, discountedAmount } = this.inputControl;
    const setError = () => {
      if (this.paidValue.value + +this.paid.value > this.discountedAmount.value) {
        return 'moreThanTotal';
      }
    };
    const clearError = () => {
      if (this.paid.value > 0) {
        this.paid.setErrors(null);
        this.isValidPaid = true;
      }
    };

    this.paid.valueChanges.subscribe(() => {
      clearError();
      const error = setError();
      if (error === 'moreThanTotal') {
        this.paid.setErrors({ moreThanTotal: true });
        this.isValidPaid = false;
      }
      this.handlePaidAmount();
    });
  }

  onSaveDiscount() {
    this.viewDiscountTab = false;
  }

  handleDiscount(){
    if (this.discount.value > 0) {
      this.editMode = true;
    }

    const calculateDiscount = (value, type) =>{
      if(type === 'Flat'){
        return value;
      }
      else{
        return this.currentAmount.value*value/100;
      }
    }

    this.discount.valueChanges.subscribe((discount: number) => {
        const total = calculateDiscount(discount, this.discountType.value);
        this.totalDiscount.setValue(total);
        this.discountedAmount.setValue(this.currentAmount.value - total);
        this.dueAmount.setValue(this.discountedAmount.value - this.paidAmount.value);
      })

    this.discountType.valueChanges.subscribe((discountType: string) => {
        const total = calculateDiscount(this.discount.value, discountType);
        this.totalDiscount.setValue(total);
        this.discountedAmount.setValue(this.currentAmount.value - total);
        this.dueAmount.setValue(this.discountedAmount.value - this.paidAmount.value);
    })
  }

  onAddDiscount(e) {
    this.viewDiscountTab = true;
  }

  onEditDiscount(e) {
    if (e.item.value === 'editDiscount') {
      this.editMode = false;
      this.viewDiscountTab = true;
    } else {
      this.resetDiscount();
    }
  }

  resetDiscount() {
    if (this.viewDiscountTab) {
      this.viewDiscountTab = false;
    }
    this.editMode = false;

    this.discountType.patchValue('%Off');
    this.discount.patchValue(0);
    this.totalDiscount.patchValue(0);
    this.discountedAmount.patchValue(this.currentAmount.value);
    this.dueAmount.patchValue(this.currentAmount.value - this.paidAmount.value);
  }

  onEditPaid(e) {
    if (e.item.value === 'Edit') {
      this.viewPaidTab = true;
    }
  }

  savePaidAmount() {
    if (this.viewPaidTab) {
      this.viewPaidTab = false;
    }
  }

  handlePaidAmount(){
    this.paid.valueChanges.subscribe((value)=>{
      const total = +value + this.paidValue.value;
      this.paidAmount.setValue(total);
      this.dueAmount.setValue(this.discountedAmount.value - this.paidAmount.value);
    })
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
