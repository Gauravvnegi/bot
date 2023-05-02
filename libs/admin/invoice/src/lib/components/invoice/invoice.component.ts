import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import {
  AdminUtilityService,
  NavRouteOptions,
  Option,
} from '@hospitality-bot/admin/shared';
import { invoiceRoutes } from '../../constants/routes';
import { InvoiceForm } from '../../types/forms.types';
import { cols } from '../../constants/payment';
import { PaymentField } from '../../types/forms.types';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';
import { GlobalFilterService, Item } from '@hospitality-bot/admin/core/theme';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';
import {
  Invoice,
  ServiceList,
  TableDataList,
} from '../../models/invoice.model';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { ServicesService } from 'libs/admin/services/src/lib/services/services.service';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';

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
  tableFormArray: FormArray;
  useForm: FormGroup;

  paymentOptions: Option[] = [
    { label: 'Razor Pay', value: 'razorPay' },
    { label: 'Cash', value: 'cash' },
    { label: 'Stripe', value: 'stripe' },
    { label: 'Pay at desk', value: 'payAtDesk' },
    { label: 'Bank Deposit', value: 'bankDeposit' },
  ];
  loading = false;

  tax: Option[] = [];
  defaultTax: Option[] = [];
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
  isGenerated = false;
  isAddingGST = false;

  $subscription = new Subscription();

  serviceOptions = [
    { label: 'se default', value: 'se default', amount: 0, taxes: [] },
  ];

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
    private snackbarService: SnackBarService,
    private adminUtilityService: AdminUtilityService,
    private servicesService: ServicesService
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
    this.getServices();
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
      paymentMethod: [''],
      recievedPayment: [''],
      remarks: [''],
      transactionId: [''],
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;
    this.initDetails();
    this.initOptionsConfig();
    this.addNewFieldTableForm();
    this.initFormSubscription();
  }

  /**
   * @function initForm Initialize form
   */
  initDetails() {
    this.tableValue = [{ id: 1 }];
    this.invoiceService.getInvoiceData(this.reservationId).subscribe((res) => {
      const data = new Invoice().deserialize(res);
      const tableData = new TableDataList().deserialize(res.itemList).records;
      this.defaultTax = tableData[0].tax;
      let taxValues = this.defaultTax.map((item) => item.value);

      const addCharges = () => this.addNewCharges();

      if (tableData.length > 1) {
        Array.from({ length: tableData.length - 1 }, addCharges);
      }

      tableData.forEach((data, i) => {
        this.tableFormArray.controls[i].setValue(data);
        this.tableFormArray.controls[i].get('tax').setValue(taxValues);
      });
      this.useForm.patchValue(data);
    });
    this.inputControl.discountType.setValue('off');
  }

  initFormSubscription() {
    this.registerDiscountChanges();
  }

  /**
   * @function initForm Initialize tax options
   */
  initOptionsConfig() {
    this.getTax();
  }

  getQueryConfig(): QueryConfig {
    const config = {
      params: this.adminUtilityService.makeQueryParams([
        {
          type: LibraryItem.service,
          serviceType: 'ALL',
          limit: 50,
        },
      ]),
    };
    console.log('Config - ', config);
    return config;
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
    const currentFormGroup = this.tableFormArray.at(
      this.tableFormArray.controls.length - 1
    ) as FormGroup;
    const {
      description,
      unit,
      unitValue,
    } = currentFormGroup.controls;

    let taxRate = 0;

    const setValues = (amountValue: number) => {
      const totalValue = amountValue + (amountValue * taxRate) / 100;
      currentFormGroup.patchValue({
        amount: amountValue,
        totalAmount: totalValue,
      });
    };

    const setAmount = () => {
      let serviceId = description.value;
      let selectedService = this.serviceOptions.find(
        (item) => item.value === serviceId
      );
      taxRate =
        selectedService?.taxes.reduce((acc, val) => acc + val.taxValue, 0) ?? 0;

      if (selectedService) {
        currentFormGroup.patchValue({
          unit: 1,
          tax: selectedService.taxes.map((item) => item.id),
          unitValue: selectedService.amount,
          amount: selectedService.amount,
        });

        setValues(selectedService.amount);
      }
    };

    description.valueChanges.subscribe(setAmount);

    const unitChanges = () => {
      let amountValue = unit.value * unitValue.value;
      setValues(amountValue);
    };

    unit.valueChanges.subscribe(unitChanges);
    unitValue.valueChanges.subscribe(unitChanges);

    this.tableFormArray.valueChanges.subscribe((values) => {
      const prices = values.map((value) => Number(value.totalAmount));
      const totalValue = prices.reduce((acc, price) => acc + price, 0);

      this.inputControl.currentAmount.setValue(totalValue);
      this.inputControl.discountedAmount.setValue(
        this.inputControl.currentAmount.value -
          this.inputControl.totalDiscount.value
      );
      this.inputControl.dueAmount.setValue(
        this.inputControl.discountedAmount.value -
          this.inputControl.paidValue.value
      );
    });
  }

  /**
   * @function registerDiscountChanges To handle changes in discount tab
   */
  registerDiscountChanges() {
    const setError = () => {
      if (
        this.inputControl.discount.value >
          this.inputControl.currentAmount.value &&
        this.inputControl.discountType.value === 'flat'
      ) {
        return 'isNumError';
      }
      if (
        this.inputControl.discount.value > 100 &&
        this.inputControl.discountType.value === 'off'
      ) {
        return 'isPercentError';
      }
    };

    const clearError = () => {
      if (this.inputControl.discount.value > 0) {
        this.inputControl.discount.setErrors(null);
        this.isValidDiscount = true;
      }
    };

    const discountSubscription = () => {
      clearError();
      const error = setError();
      if (error === 'isNumError') {
        this.inputControl.discount.setErrors({ isPriceLess: true });
        this.isValidDiscount = false;
      }
      if (error === 'isPercentError') {
        this.inputControl.discount.setErrors({ moreThan100: true });
        this.isValidDiscount = false;
      }
    };

    this.inputControl.discountType.valueChanges.subscribe(discountSubscription);
    this.inputControl.discount.valueChanges.subscribe(discountSubscription);
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */

  onSaveDiscount() {
    this.viewDiscountTab = false;
    this.editMode = this.inputControl.discount.value > 0;

    const calculateDiscount = (value, type) =>
      type === 'flat'
        ? value
        : (this.inputControl.currentAmount.value * value) / 100;

    const total = calculateDiscount(
      this.inputControl.discount.value,
      this.inputControl.discountType.value
    );

    this.inputControl.totalDiscount.setValue(total);
    this.inputControl.discountedAmount.setValue(
      this.inputControl.currentAmount.value - total
    );
    this.inputControl.dueAmount.setValue(
      this.inputControl.discountedAmount.value -
        this.inputControl.paidAmount.value
    );
  }

  onEditDiscount(e) {
    this.editMode = false;
    e.item.value === 'editDiscount'
      ? (this.viewDiscountTab = true)
      : this.resetDiscount();
  }

  resetDiscount() {
    this.inputControl.discountType.patchValue('off');
    this.inputControl.discount.patchValue(0);
    this.inputControl.totalDiscount.patchValue(0);
    this.inputControl.discountedAmount.patchValue(
      this.inputControl.currentAmount.value
    );
    this.inputControl.dueAmount.patchValue(
      this.inputControl.currentAmount.value - this.inputControl.paidAmount.value
    );
  }

  onSavePaidAmount() {
    this.viewPaidTab = false;
    const total =
      +this.inputControl.paid.value + this.inputControl.paidValue.value;
    this.inputControl.paidAmount.setValue(total);
    this.inputControl.dueAmount.setValue(
      this.inputControl.discountedAmount.value -
        this.inputControl.paidAmount.value
    );
  }

  /**
   * To remove selected charges
   */
  removeSelectedCharges() {
    console.log('selected rows', this.selectedRows);
    const idsToRemove = this.selectedRows.map((row) => row.id);
    const controls = this.tableFormArray.controls;

    // removing in descending order
    for (let i = controls.length - 1; i >= 0; i--) {
      if (idsToRemove.includes(i + 1)) {
        const indexToRemove = this.tableValue.findIndex(
          (row) => row.id === i + 1
        );
        this.tableValue.splice(indexToRemove, 1);
        this.tableFormArray.removeAt(i);
      }
    }

    // Updating the id in table value
    this.tableValue.forEach((row, index) => {
      row.id = index + 1;
    });

    this.selectedRows = [];
  }

  onRowSelect(event) {
    console.log('onRowSelect', event);
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
  }

  handleSave(): void {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }
    const data = this.invoiceService.mapInvoiceData(this.useForm.getRawValue());
    this.updateInvoiceData(data);
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

  updateInvoiceData(data): void {
    this.$subscription.add(
      this.invoiceService
        .updateInvoice(this.reservationId, data)
        .subscribe((res) => {
          console.log('Invoice Updated');
        })
    );
  }

  onAddGST() {
    this.isAddingGST = !this.isAddingGST;
  }

  getTax() {
    this.$subscription.add(
      this.servicesService.getTaxList(this.hotelId).subscribe(({ records }) => {
        records = records.filter(
          (item) => item.category === 'service' && item.status
        );
        this.tax = records.map((item) => ({
          label: `${item.taxType} ${item.taxValue}%`,
          value: item.id,
          taxType: item.taxType,
          taxValue: item.taxValue,
        }));
      })
    );
  }

  getServices() {
    this.loading = true;
    let config = '?type=SERVICE&serviceType=ALL';
    this.servicesService
      .getLibraryItems(this.hotelId, this.getQueryConfig())
      .subscribe((res) => {
        this.loading = false;
        console.log(res);
        const servicesList = new ServiceList().deserialize(res);
        this.serviceOptions = servicesList.allService.map((item) => ({
          label: item.name,
          value: item.id,
          amount: item.amount,
          taxes: item.taxes,
        }));
      });
  }

  handleGenerate() {
    this.useForm.disable();
    this.invoiceService
      .updateInvoice(this.reservationId, { invoiceGenerated: true })
      .subscribe((res) => {
        this.isGenerated = true;
        this.snackbarService.openSnackBarAsText(
          'Invoice Generated Successfully',
          '',
          {
            panelClass: 'success',
          }
        );
      });
  }

  handleDownload() {
    this.invoiceService.downloadPDF(this.reservationId).subscribe((res) => {
      const fileUrl = res.file_download_url;
      const xhr = new XMLHttpRequest();
      xhr.open('GET', fileUrl, true);
      xhr.setRequestHeader('Content-type', 'application/pdf');
      xhr.responseType = 'blob';
      xhr.onload = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const blob = new Blob([xhr.response], { type: 'application/pdf' });
          const url = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = 'invoice.pdf';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          window.URL.revokeObjectURL(url);
        }
      };
      xhr.send();
    });
  }

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
