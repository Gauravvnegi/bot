import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { AdminUtilityService, NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { invoiceRoutes } from '../../constants/routes';
import { InvoiceForm } from '../../types/forms.types';
import { cols, taxes } from '../../constants/payment';
import { PaymentField } from '../../types/forms.types';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.model';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'hospitality-bot-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  readonly errorMessages = errorMessages;
  pageTitle: string;
  navRoutes: NavRouteOptions;
  hotelId: string;
  reservationId: string;
  globalQueries = [];
  tableFormArray: FormArray;
  useForm: FormGroup;

  taxes: Option[];
  tableValue = [];
  discountOption: Option[] = [
    { label: '%Off', value: 'off' },
    { label: 'Flat', value: 'flat' },
  ];
  editPaidAmount: Option[] = [{ label: 'Edit', value: 'edit' }];

  editMode = false;
  viewDiscountTab = false;
  viewPaidTab = false;
  isValidDiscount = true;
  isValidPaid = true;

  $subscription = new Subscription();

  /**Table Variable */
  selectedRows;
  cols = cols;

  // #Move to constant, give type here and in menu component, initialise ngInit - initOptionsConfig
  addDiscount = [{ label: 'Add Discount', value: 'addDiscount' }];
  editDiscount = [
    { label: 'Edit Discount', value: 'editDiscount' },
    { label: 'Remove Discount', value: 'removeDiscount' },
  ];

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private adminUtilityService: AdminUtilityService,
    private snackbarService: SnackBarService,
  ) {
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
    this.hotelId = this.globalFilterService.hotelId;
    console.log(this.hotelId);
    this.listenForGlobalFilters();
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

    this.initDetails();
    this.addNewFieldTableForm();
    this.initFormSubscription();
    this.useForm.valueChanges.subscribe((res) => {
    });
  }

  listenForGlobalFilters(): void{
    this.globalFilterService.globalFilter$.subscribe((data)=>{
      this.globalQueries = [
        ...data['filter'].queryValue,
        ...data['dateRange'].queryValue,
      ];
      this.getReservationId();
    })
    console.log(this.reservationId);
  }

  getReservationId(): void{
    const id = this.activatedRoute.snapshot.paramMap.get('id')
    this.reservationId = id;
    console.log(this.reservationId)
  }

  /**
   * @function initForm Initialize form
   */
  initDetails() {
    this.tableValue = [{ id: 1 }];
    this.invoiceService.getInvoiceData(this.reservationId).subscribe((res)=>{
      const data = new Invoice().deserialize(res);
      this.useForm.patchValue(data);
    })
    this.discountType.patchValue('%Off');
  }

  initFormSubscription(){
    this.registerDiscountChanges();
    this.registerPaidChanges();
  }

  /**
   * @function initForm Initialize tax options
   */
  initOptionsConfig() {
    this.taxes = taxes;
  }

  /**
   * Add new entry in the payment field
   */
  addNewFieldTableForm() {
    const data: Record<keyof PaymentField, any> = {
      description: ['', Validators.required],
      unit: [''],
      unitValue: [''],
      amount: [''],
      tax: [[]],
      totalAmount: [''],
    };

    this.tableFormArray.push(this.fb.group({ ...data }));
  }
  
  /**
   * To add new charged
  */
 addNewCharges() {
   this.addNewFieldTableForm();
   this.tableValue.push({ id: this.tableValue.length + 1 });
   this.registerUnitPriceChange();
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */
  registerUnitPriceChange() {
    console.log(this.tableFormArray.controls.length);
    const currentFormGroup = this.tableFormArray.at(
      this.tableFormArray.controls.length-1
    ) as FormGroup;
    const { unit, unitValue, tax } = currentFormGroup.controls;

    const setAmount = () => {
      let taxRate = 0;
      for (let i of tax.value) {
        if (i === 'SGST' || i === 'CGST') {
          taxRate += 12;
        } else if(i === 'VAT'){
          taxRate += 20;
        } else if (i === 'GST') {
          taxRate += 18;
        } else {
          taxRate = 0;
        }
      }

      const amount = unit.value * unitValue.value;
      const totalValue = amount + (amount * taxRate) / 100;

      if (amount) {
        currentFormGroup.patchValue({
          amount: amount,
          totalAmount: totalValue,
        });
      }
    }; 
    unit.valueChanges.subscribe(setAmount);
    unitValue.valueChanges.subscribe(setAmount);
    tax.valueChanges.subscribe(setAmount);

    this.tableFormArray.valueChanges.subscribe((values)=>{
      const prices = values.map((value)=> Number(value.totalAmount));
      const totalValue = prices.reduce((acc, price)=> acc + price, 0);

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

      if(this.discountedAmount.value<this.paidAmount.value || this.dueAmount.value < 0){
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
        this.discount.setErrors({ maxOccupancy: true});
        this.isValidDiscount = false;
      }
    };

    this.discountType.valueChanges.subscribe(discountSubscription);
    this.discount.valueChanges.subscribe(discountSubscription);
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */
  registerPaidChanges() {
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
    });
  }

  onSaveDiscount() {
    this.viewDiscountTab = false;
    this.handleDiscount();
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

    const total = calculateDiscount(this.discount.value , this.discountType.value);
    this.totalDiscount.setValue(total);
    this.discountedAmount.setValue(this.currentAmount.value - total);
    this.dueAmount.setValue(this.discountedAmount.value - this.paidAmount.value);
  }

  onAddDiscount(e) {
    if(e.item.value === 'addDiscount')
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
    if (e.item.value === 'edit') {
      this.viewPaidTab = true;
    }
  }
  
  savePaidAmount() {
    if (this.viewPaidTab) {
      this.viewPaidTab = false;
    }
    this.handlePaidAmount();
  }

  handlePaidAmount(){
    const total = +this.paid.value + this.paidValue.value;
    this.paidAmount.setValue(total);
    this.dueAmount.setValue(this.discountedAmount.value - this.paidAmount.value);
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

  handleSave(): void{
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }
    const data = this.invoiceService.mapInvoiceData(
      this.useForm.getRawValue()
    );
    this.updateInvoiceData(data);
    // formate data in InvoiceResponse
  }

  handleReset(){
    this.useForm.reset();
  }

  createInvoiceData(data): void{
    this.$subscription.add(
      this.invoiceService.createInvoice(this.reservationId, data)
      .subscribe((_)=>{
        console.log("Invoice Created");
      })
    )
  }

  updateInvoiceData(data): void{
    this.$subscription.add(
      this.invoiceService.updateInvoice(this.reservationId, data)
      .subscribe((res)=>{
        console.log("Invoice Updated");
      })
    )
  }

    /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
    ngOnDestroy(): void {
      this.$subscription.unsubscribe();
    }
}
