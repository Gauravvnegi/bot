import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  NavRouteOptions,
  Option,
  UserService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';
import { ServicesService } from 'libs/admin/services/src/lib/services/services.service';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import { Subscription, from } from 'rxjs';
import {
  addDiscountMenu,
  addRefundMenu,
  DiscountActionItem,
  discountOptions,
  editDiscountMenu,
  editRefundMenu,
  paymentOptions,
} from '../../constants/invoice.constant';
import { cols } from '../../constants/payment';
import { invoiceRoutes } from '../../constants/routes';
import {
  Invoice,
  Service,
  ServiceList,
  TableData,
} from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceForm, PaymentField } from '../../types/forms.types';

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
  guestId: string;

  tableFormArray: FormArray;
  useForm: FormGroup;

  readonly paymentOptions = paymentOptions;
  readonly discountOption = discountOptions;
  readonly addRefund = addRefundMenu;
  readonly editRefund = editRefundMenu;
  readonly addDiscountMenu = addDiscountMenu;
  readonly editDiscountMenu = editDiscountMenu;

  tableLength = 0;
  tax: Option[] = [];

  tableValue = [];
  refundOption = [{ label: 'INR', value: 'INR' }];

  isRefundSaved = false;
  viewRefundRow = false;
  isValidDiscount = true;

  addGST = false;
  addPayment = false;

  isInvoiceGenerated = false;

  $subscription = new Subscription();
  typeSubscription: Subscription;

  serviceOptions: Option[];

  descriptionOffSet = 0;
  loadingDescription = false;
  noMoreDescription = false;
  selectedSearchIndex = -1;
  descriptionOptions: Option[] = [];
  defaultDescriptionOptions: Option[] = [];

  /**Table Variable */
  selectedRows = [];
  cols = cols;

  constructor(
    private fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private activatedRoute: ActivatedRoute,
    private invoiceService: InvoiceService,
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private servicesService: ServicesService,
    private router: Router,
    private modalService: ModalService,
    private userService: UserService
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.initPageHeaders();
  }

  get inputControl() {
    return this.useForm.controls as Record<keyof InvoiceForm, AbstractControl>;
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
    this.getDescriptionOptions();
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
    const { firstName, lastName } = this.userService.userDetails;

    this.useForm = this.fb.group({
      invoiceId: [],
      invoiceNumber: [],
      confirmationNumber: [],
      guestName: ['', Validators.required],
      companyName: [''],

      gstNumber: ['', Validators.required],
      contactName: ['', Validators.required],
      contactNumber: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pin: ['', Validators.required],

      additionalNote: [''],
      tableData: new FormArray([]),

      currentAmount: [0],
      discountedAmount: [0],
      totalDiscount: [0],
      paidAmount: [0],
      dueAmount: [0],

      currency: ['INR'],
      refundAmount: [0],

      cashierName: [`${firstName} ${lastName}`, Validators.required],
      paymentMethod: ['', Validators.required],
      receivedPayment: ['', Validators.required],
      remarks: ['', Validators.required],
      transactionId: ['', Validators.required],
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;
    // this.addNewCharges('price', 0);
    this.gstValidation(false);
    this.paymentValidation(false);
    this.initFormDetails();
    this.initFormSubscription();
  }

  /**
   * Patch the initial form values
   */
  initFormDetails() {
    const { firstName, lastName } = this.userService.userDetails;
    // this.tableValue = [{ id: 1 }];
    this.invoiceService.getInvoiceData(this.reservationId).subscribe((res) => {
      this.invoiceService.initInvoiceData(res); // saving initial invoice data

      const data = new Invoice().deserialize(res, {
        cashierName: `${firstName} ${lastName}`,
      });
      // this.tableValue = data.tableData.map((_, idx) => ({ id: idx + 1 }));
      // for (let i = 1; i < data.tableData.length; i++) {
      //   this.addNewCharges(); // adding new table entry to patch data
      // }

      data.tableData.forEach((item, idx) => {
        // this.tableValue.push({ id: idx + 1 });
        this.addNewCharges(item.type, idx); // adding new table entry to patch data
      });

      this.useForm.patchValue(data, { emitEvent: false });

      // Generating tax options
      this.tax = res.itemList.reduce((prev, curr) => {
        const taxes = curr.itemTax.map((item) => ({
          label: `${item.taxType} [${item.taxValue}%]`,
          value: item.id,
        }));

        return [...prev, ...taxes];
      }, []);

      // Generating default description options
      res.itemList.forEach((item) => {
        this.defaultDescriptionOptions.push({
          label: item.description,
          value: item.id,
          amount: item.amount,
          taxes: item.itemTax,
        });
      });

      this.guestId = res.primaryGuest.id;
      this.isInvoiceGenerated = res.invoiceGenerated;
    });
  }

  handleFocus(index: number) {
    this.selectedSearchIndex = index;
  }

  handleBlur() {
    this.selectedSearchIndex = -1;
  }

  /**
   * Initialize Form Subscription
   */
  initFormSubscription() {
    const totalCurrentAmount = this.useForm.get('currentAmount');
    const totalDiscountControl = this.useForm.get('totalDiscount');
    const totalDiscountedAmountControl = this.useForm.get('discountedAmount');
    const paidAmountControl = this.useForm.get('paidAmount');
    const dueAmountControl = this.useForm.get('dueAmount');

    totalDiscountControl.valueChanges.subscribe((res) => {
      const discountedAmount = totalCurrentAmount.value - res;
      totalDiscountedAmountControl.patchValue(discountedAmount);
    });

    totalDiscountedAmountControl.valueChanges.subscribe((res) => {
      const dueAmount = res - paidAmountControl.value;
      dueAmountControl.patchValue(dueAmount);
    });
  }

  paymentValidation(addValidation: boolean = true) {
    const paymentMethodControl = this.useForm.get('paymentMethod');
    const receivedPaymentControl = this.useForm.get('receivedPayment');
    const transactionIdControl = this.useForm.get('transactionId');
    const remarksControl = this.useForm.get('remarks');

    [
      paymentMethodControl,
      receivedPaymentControl,
      transactionIdControl,
      remarksControl,
    ].forEach((item) => {
      if (addValidation) item.setValidators([Validators.required]);
      else {
        item.clearValidators();
        item.updateValueAndValidity();
        item.reset();
      }
    });
  }

  gstValidation(addValidation: boolean = true) {
    const companyNameControl = this.useForm.get('companyName');

    const gstNumberControl = this.useForm.get('gstNumber');
    const contactNameControl = this.useForm.get('contactName');
    const contactNumberControl = this.useForm.get('contactNumber');
    const emailControl = this.useForm.get('email');
    const addressControl = this.useForm.get('address');
    const stateControl = this.useForm.get('state');
    const cityControl = this.useForm.get('city');
    const pinControl = this.useForm.get('pin');

    [
      gstNumberControl,
      contactNameControl,
      contactNumberControl,
      emailControl,
      addressControl,
      stateControl,
      cityControl,
      pinControl,
    ].forEach((item) => {
      if (addValidation) item.setValidators([Validators.required]);
      else {
        item.clearValidators();
        item.updateValueAndValidity();
        item.reset();
      }
    });

    if (addValidation) {
      companyNameControl.setValidators([Validators.required]);
      companyNameControl.updateValueAndValidity();
    } else {
      companyNameControl.updateValueAndValidity();
      companyNameControl.clearValidators();
      companyNameControl.markAsUntouched();
    }
  }

  /**
   * Handle addition of table entry (New Charges)
   */
  addNewCharges(type: 'price' | 'discount' = 'price', rowIndex?: number) {
    const index = rowIndex ?? this.tableValue.length;
    this.tableValue.push(index);

    // if (this.useForm.invalid) {
    //   this.useForm.markAllAsTouched();
    //   this.snackbarService.openSnackBarAsText(
    //     'Invalid form: Please fix the errors.'
    //   );
    //   return;
    // }
    const data: Record<keyof PaymentField, any> = {
      key: [
        type === 'discount'
          ? this.tableFormArray.at(index - 1)?.get('key').value
          : `${Date.now()}`,
      ],
      description: ['', Validators.required],
      unit: [null],
      unitValue: [null],
      amount: [null],
      tax: [[]],
      totalAmount: [null],
      discount: [null],
      discountType: ['PERCENT'],
      type: [type],
      isDisabled: [false],
      discountState: [type === 'discount' ? 'editing' : 'notApplied'],
    };

    const formGroup = this.fb.group(data);

    if (type === 'discount') {
      this.tableFormArray.insert(index, formGroup);
    } else {
      this.tableFormArray.push(formGroup);
      this.registerServiceSelection();
    }
    // add row in table
  }

  updateTotalDiscount() {
    const rowData = this.tableFormArray.getRawValue() as TableData[];
    const totalDiscount = rowData.reduce((prev, curr) => {
      return prev + (curr.type === 'discount' ? +curr.totalAmount : 0);
    }, 0);

    this.useForm.get('totalDiscount').patchValue(totalDiscount);
  }

  /**
   * To handle changes in service charges
   */
  registerServiceSelection() {
    const currentFormGroup = this.tableFormArray.at(
      this.tableFormArray.controls.length - 1
    ) as FormGroup;

    const { description, unit, unitValue } = currentFormGroup.controls;

    const handlePriceRowUpdate = ({
      serviceId,
      unitQuantity,
      unitPrice,
    }: {
      serviceId?: string;
      unitQuantity?: number;
      unitPrice?: number;
    }) => {
      let isMain = true;
      let selectedService = this.descriptionOptions.find((item) => {
        const id = serviceId ?? description.value;
        return item.value === id;
      });

      if (!selectedService) {
        isMain = false;
        selectedService = this.defaultDescriptionOptions.find((item) => {
          const id = serviceId ?? description.value;
          return item.value === id;
        });
      }

      if (!selectedService) return;

      if (serviceId && isMain) {
        // adding selected default description
        const newSelectedOption = {
          label: selectedService.label,
          value: selectedService.value,
          amount: selectedService.amount,
          taxes: selectedService.taxes,
        };

        this.defaultDescriptionOptions = [
          ...this.defaultDescriptionOptions,
          newSelectedOption,
        ];
      }

      const currentUnitQuantity = unitQuantity ?? unit.value ?? 1;
      const currentUnitValue =
        unitPrice ?? (serviceId ? selectedService.amount : unitValue.value);

      const serviceTaxes = selectedService?.taxes;
      const taxRate =
        serviceTaxes?.reduce((acc, val) => acc + val.taxValue, 0) ?? 0;

      const taxes =
        serviceTaxes?.map((item) => ({
          label: `${item.taxType} [${item.taxValue}%]`,
          value: item.id,
        })) ?? [];
      this.tax = [...this.tax, ...taxes];

      const amount = currentUnitValue * currentUnitQuantity;
      const totalValue = amount + (amount * taxRate) / 100;

      currentFormGroup.patchValue(
        {
          unit: currentUnitQuantity,
          tax: serviceTaxes.map((item) => item.id),
          unitValue: currentUnitValue,
          amount: amount,
          totalAmount: totalValue,
        },
        { emitEvent: false }
      );

      // ---- discount logic attach to price
      const rowId = currentFormGroup.value.description;
      const rowIdx = this.tableFormArray.value.findIndex(
        (item) => item.description === rowId
      );
      const nextEntry = this.tableFormArray.at(rowIdx + 1);
      const nextEntryValues = this.tableFormArray.at(rowIdx + 1)?.value;

      if (
        nextEntry &&
        nextEntryValues &&
        nextEntryValues.type === 'discount' &&
        nextEntryValues.discountType === 'PERCENT'
      ) {
        const totalDiscountAmount =
          totalValue * (nextEntryValues.discount / 100);

        nextEntry.patchValue({
          totalAmount:
            Math.round((totalDiscountAmount + Number.EPSILON) * 100) / 100,
        });

        this.updateTotalDiscount();
      }
    };

    description.valueChanges.subscribe((serviceId) =>
      handlePriceRowUpdate({ serviceId })
    );

    unit.valueChanges.subscribe((unitQuantity) => {
      handlePriceRowUpdate({ unitQuantity });
    });

    unitValue.valueChanges.subscribe((unitPrice) => {
      handlePriceRowUpdate({ unitPrice });
    });

    this.listenTableChanges('price');
  }

  listenTableChanges(type: 'price' | 'discount', index?: number) {
    if (this.typeSubscription) {
      this.typeSubscription.unsubscribe();
    }

    this.typeSubscription = this.tableFormArray.valueChanges.subscribe(
      (values) => {
        const typeValues = values.filter((value) => value.type === type);
        if (type === 'price') {
          const prices = typeValues.map((value) => Number(value.totalAmount));
          const totalValue = prices.reduce((acc, price) => acc + price, 0);
          this.updateInputControls(totalValue, 0);
        } else {
          const totalDiscount = typeValues.reduce((acc, value) => {
            if (value.isDiscountApplied) {
              return acc + Number(value.totalAmount);
            }
            return acc;
          }, 0);
          this.updateInputControls(0, totalDiscount);
          this.typeSubscription.unsubscribe();
        }
      }
    );
  }

  updateInputControls(currentAmount, totalDiscount) {
    if (currentAmount) {
      this.inputControl.currentAmount.setValue(currentAmount);
    }
    if (totalDiscount) {
      this.inputControl.totalDiscount.setValue(totalDiscount);
    }
    this.inputControl.discountedAmount.setValue(
      this.inputControl.currentAmount.value -
        this.inputControl.totalDiscount.value
    );
    this.inputControl.dueAmount.setValue(
      this.inputControl.discountedAmount.value -
        this.inputControl.paidAmount.value
    );
  }

  /**
   * To handle discount changes
   */
  registerDiscountChanges(index: number) {
    const priceControls = this.getTableRowFormGroup(index);
    const discountControls = this.getTableRowFormGroup(index + 1);

    const { totalAmount: currentTotalAmount } = priceControls;
    const { discount, discountType, totalAmount } = discountControls;

    const setError = () => {
      if (
        discount.value > currentTotalAmount.value &&
        discountType.value === 'FLAT'
      ) {
        return 'isNumError';
      }
      if (discount.value > 100 && discountType.value === 'PERCENT') {
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
      discountType.value === 'FLAT'
        ? totalAmount.setValue(discount.value)
        : totalAmount.setValue(
            ((discount.value * currentTotalAmount.value) / 100).toFixed(2)
          );
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
   * Handle saving discount
   * @param index Row index
   */
  onSaveDiscount(index: number) {
    const priceControls = this.getTableRowFormGroup(index - 1);
    const discountControls = this.getTableRowFormGroup(index);
    const { isDisabled } = discountControls;
    const { discountState } = priceControls;
    discountState.setValue('applied');
    isDisabled.setValue(true);

    this.updateTotalDiscount();
  }

  getTableRowFormGroup(index: number) {
    const data = this.tableFormArray.at(index) as FormGroup;
    const formControl = data.controls as Record<
      keyof TableData,
      AbstractControl
    >;
    return formControl;
  }

  /**
   * Handle discount flow
   */
  handleDiscount(
    { item: { value } }: { item: { value: DiscountActionItem } },
    index: number
  ) {
    const priceControls = this.getTableRowFormGroup(index);

    if (value === DiscountActionItem.ADD_DISCOUNT) {
      this.addNewCharges('discount', index + 1);
      this.registerDiscountChanges(index);
      const { discountState } = priceControls;
      discountState.setValue('editing');
    }

    if (value === DiscountActionItem.EDIT_DISCOUNT) {
      const discountControls = this.getTableRowFormGroup(index + 1);
      this.registerDiscountChanges(index);
      const { isDisabled } = discountControls;
      const { discountState } = priceControls;
      discountState.setValue('editing');
      isDisabled.setValue(false);
    }

    if (value === DiscountActionItem.REMOVE_DISCOUNT) {
      const { discountState } = priceControls;
      discountState.setValue('notApplied');
      this.removeDiscount(index);
    }
  }

  /**
   * Remove Discount logic
   * @param index Row index
   */
  removeDiscount(index: number) {
    const {
      totalDiscount,
      discountedAmount,
      currentAmount,
      dueAmount,
      paidAmount,
    } = this.inputControl;
    const totalAmount = this.tableFormArray.at(index + 1).get('totalAmount')
      .value;
    this.tableFormArray.removeAt(index + 1);
    this.tableValue.splice(index + 1, 1);
    const removedDiscount = totalDiscount.value - totalAmount;
    totalDiscount.patchValue(removedDiscount);
    discountedAmount.patchValue(currentAmount.value - totalDiscount.value);
    dueAmount.patchValue(discountedAmount.value - paidAmount.value);
  }

  removeSelectedCharges() {
    const idsToRemove = this.selectedRows;

    // const newData = this.tableFormArray.getRawValue().filter((item) => {
    //   return !idsToRemove.includes(item.key);
    // });
    this.selectedRows.forEach((item) => {});

    const oldLength = this.tableFormArray.controls.length;

    const idxToBeDeleted = this.tableFormArray
      .getRawValue()
      .reduce((prev, curr, idx) => {
        if (idsToRemove.includes(curr.key)) {
          prev.push(idx);
        }

        return prev;
      }, []);

    this.tableFormArray.controls = this.tableFormArray.controls.filter(
      (item, idx) => !idxToBeDeleted.includes(idx)
    );

    this.tableValue = Array.from(Array(oldLength - idsToRemove.length).keys());

    this.selectedRows = [];

    // this.tableFormArray.value.findIndex(
    //   (item) => item.description === rowId
    // );

    // this.tableFormArray.patchValue(newData);

    // this.tableFormArray.controls.forEach(item=>{
    //   item.
    // })

    // this.tableFormArray.pa

    let totalDiscount = 0;
    let currentAmount = 0;
    this.tableFormArray.getRawValue().map((item) => {
      if (item.type === 'discount') {
        totalDiscount = +item.totalAmount + currentAmount;
        // currentAmount: [0],
        // discountedAmount: [0],
        // totalDiscount: [0],
        // paidAmount: [0],
        // dueAmount: [0],
        this.useForm.patchValue({ totalDiscount });
      }
      if (item.type === 'price') {
        currentAmount = +item.totalAmount + totalDiscount;
        this.useForm.patchValue({ currentAmount });
      }
      const discountedAmount = currentAmount - totalDiscount;

      this.useForm.patchValue({ discountedAmount });
      this.useForm.patchValue({ dueAmount: discountedAmount - totalDiscount });
    });

    return;

    // Remove rows in descending order
    for (let i = this.tableValue.length - 1; i >= 0; i--) {
      if (idsToRemove.includes(i + 1)) {
        // Check if the next row is a discount row
        const isNextRowDiscount =
          i < this.tableValue.length - 1 &&
          this.tableFormArray.at(i + 1)?.get('type').value === 'discount';
        // Remove the current row and the next row if it's a discount row
        if (isNextRowDiscount) {
          this.tableValue.splice(i, 2);
          this.registerOnDeleteChanges(i);
          this.tableFormArray.removeAt(i);
          this.tableFormArray.removeAt(i); // Remove the next row
        } else {
          this.tableValue.splice(i, 1);
          this.registerOnDeleteChanges(i);
          this.tableFormArray.removeAt(i);
        }
      }
    }

    // Update the IDs in tableValue
    this.tableValue.forEach((_, index) => index);

    this.selectedRows = [];
  }

  registerOnDeleteChanges(index) {
    let currentPriceValue = this.tableFormArray.at(index).get('totalAmount')
      .value;
    let currentDiscountValue =
      this.tableFormArray.at(index + 1)?.get('discount').value || 0;
    const {
      currentAmount,
      totalDiscount,
      discountedAmount,
      dueAmount,
      paidAmount,
    } = this.useForm.controls;
    currentAmount.setValue(currentAmount.value - currentPriceValue);
    if (currentDiscountValue) {
      totalDiscount.setValue(totalDiscount.value - currentDiscountValue);
      discountedAmount.setValue(currentAmount.value - totalDiscount.value);
      dueAmount.setValue(discountedAmount.value - paidAmount.value);
    }
  }

  onRowSelect({ data }) {}

  onRowUnselect({ data }) {}

  onToggleSelectAll({ checked }) {}

  handleSave(): void {
    if (!this.addGST) this.gstValidation(false);
    const markAsTouched = (control: AbstractControl) => {
      if (control instanceof FormArray) {
        control.controls.forEach((formGroup: FormGroup) => {
          Object.values(formGroup.controls).forEach((control) =>
            markAsTouched(control)
          );
        });
      } else if (control instanceof FormGroup) {
        Object.values(control.controls).forEach((control) =>
          markAsTouched(control)
        );
      } else if (control.validator) {
        control.markAsTouched();
      }
    };

    markAsTouched(this.useForm);
    markAsTouched(this.tableFormArray);

    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }

    const invoiceFormData = this.useForm.getRawValue() as Invoice;
    const data = this.invoiceService.getPostInvoiceData(invoiceFormData, {
      reservationId: this.reservationId,
      hotelId: this.hotelId,
      guestId: this.guestId,
      currency: 'INR',
    });

    this.$subscription.add(
      this.invoiceService
        .updateInvoice(this.reservationId, data)
        .subscribe((res) => {
          console.log('Invoice Updated');
        })
    );
  }

  createInvoiceData(data): void {
    this.$subscription.add(
      this.invoiceService
        .createInvoice(this.reservationId, data)
        .subscribe((_) => {
          console.log('Invoice Created');
        })
    );
  }

  onAddGST() {
    if (this.addGST) {
      this.removeDetails(
        'Remove GST details',
        'Are you sure you want to remove GST details?',
        () => {
          this.addGST = false;
          this.gstValidation(false);
        }
      );
    } else {
      this.addGST = true;
      this.gstValidation(true);
    }
  }

  onAddPaymentDetails() {
    if (this.addPayment) {
      this.removeDetails(
        'Remove Payment Details',
        'Are you sure you want to remove payment details?',
        () => {
          this.addPayment = false;
          this.paymentValidation(false);
        }
      );
    } else {
      this.addPayment = true;
      this.paymentValidation(true);
    }
  }

  removeDetails(heading: string, description: string, callback: () => void) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );

    togglePopupCompRef.componentInstance.content = {
      heading: heading,
      description: [description],
    };

    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'Yes',
        onClick: () => {
          callback();
          this.modalService.close();
        },
        variant: 'outlined',
      },
      {
        label: 'No',
        onClick: () => {
          this.modalService.close();
        },
        variant: 'contained',
      },
    ];
    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: LibraryItem.service,
          serviceType: 'ALL',
          limit: 10,
          offset: this.descriptionOffSet,
          status: true,
        },
      ]),
    };
    return config;
  }

  /**
   * Getting All Services (Description)
   */
  getDescriptionOptions() {
    this.loadingDescription = true;

    this.servicesService
      .getLibraryItems(this.hotelId, {
        params: `?&type=${LibraryItem.service}&serviceType=PAID&limit=10&offset=${this.descriptionOffSet}&status=true`,
      })
      .subscribe(
        (res) => {
          const data = new ServiceList().deserialize(res).allService;

          this.descriptionOptions = [...this.descriptionOptions, ...data];
          this.noMoreDescription = data.length < 10;
          this.loadingDescription = false;
        },
        (err) => {
          this.loadingDescription = false;
        }
      );
  }

  /**
   * Load more service (pagination)
   */
  loadMoreDescription() {
    this.descriptionOffSet = this.descriptionOffSet + 10;
    this.getDescriptionOptions();
  }

  /**
   * Search Services
   * @param text input text
   */
  searchDescription(text: string) {
    if (text) {
      this.loadingDescription = true;
      this.servicesService
        .searchLibraryItem(this.hotelId, {
          params: `?key=${text}&type=${LibraryItem.service}&serviceType=PAID`,
        })
        .subscribe((res) => {
          this.loadingDescription = false;
          const data = res && res[LibraryItem.service];
          const serviceListData =
            data
              ?.filter((item) => item.active)
              .map((item) => new Service().deserialize(item)) ?? [];

          this.descriptionOptions = serviceListData;
        });
    }
  }

  /***
   * Navigate to service form
   */
  createService() {}

  /**
   * Handle Invoice download
   */

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  /**
   * Getting tax list (will not be using it as values are not editable)
   */
  // getTax() {
  //   this.$subscription.add(
  //     this.servicesService.getTaxList(this.hotelId).subscribe(({ records }) => {
  //       records = records.filter(
  //         (item) => item.category === 'service' && item.status
  //       );
  //       this.tax = records.map((item) => ({
  //         label: `${item.taxType} ${item.taxValue}%`,
  //         value: item.id,
  //         taxType: item.taxType,
  //         taxValue: item.taxValue,
  //       }));
  //     })
  //   );
  // }
}
