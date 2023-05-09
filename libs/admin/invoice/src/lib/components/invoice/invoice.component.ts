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
  CookiesSettingsService,
  NavRouteOptions,
  Option,
  UserService,
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
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { ServicesService } from 'libs/admin/services/src/lib/services/services.service';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import { MatDialogConfig } from '@angular/material/dialog';
import { SettingOptions } from '@hospitality-bot/admin/settings';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';

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
  gstForm: FormGroup;
  paymentOptions: Option[] = [
    { label: 'Razor Pay', value: 'razorPay' },
    { label: 'Cash', value: 'cash' },
    { label: 'Stripe', value: 'stripe' },
    { label: 'Pay at desk', value: 'payAtDesk' },
    { label: 'Bank Deposit', value: 'bankDeposit' },
  ];
  loading = false;

  tableLength = 0;
  tax: Option[] = [];
  defaultTax: Option[] = []
  tableValue = [];
  discountOption: Option[] = [
    { label: '%Off', value: 'PERCENT' },
    { label: 'Flat', value: 'FLAT' },
  ];
  refundOption = [{ label: 'INR', value: 'inr' }];
  addRefund: Option[] = [{ label: 'Add Refund', value: 'addRefund' }];
  editRefund: Option[] = [{ label: 'Edit Refund', value: 'editRefund' }];

  isDiscountSaved = false;
  isRefundSaved = false;
  viewRefundRow = false;
  isValidDiscount = true;
  isGenerated = false;
  isAddingGST = false;

  $subscription = new Subscription();
  typeSubscription: Subscription;

  serviceOptions = [
    { label: 'se default', value: 'se default', amount: 0, taxes: [] },
  ];

  defaultServices = [
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
    private servicesService: ServicesService,
    private modalService: ModalService,
    private userService: UserService,
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

      gstData: this.fb.group({
        gstNumber: ['', Validators.required],
        contactName: ['', Validators.required],
        contactNumber: ['', Validators.required],
        email: ['', Validators.required],
        address: ['', Validators.required],
        state: ['', Validators.required],
        city: ['', Validators.required],
        pin: ['', Validators.required]
      }),

      additionalNote: [''],
      tableData: new FormArray([]),

      currentAmount: [0],
      discountedAmount: [0],
      totalDiscount: [0],
      paidAmount: [0],
      dueAmount: [0],

      currency: ['inr'],
      refundAmount: [0],

      cashierName: ['', Validators.required],
      invoiceDate: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      recievedPayment: ['', Validators.required],
      remarks: ['', Validators.required],
      transactionId: ['', Validators.required],
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;
    this.gstForm = this.useForm.get('gstData') as FormGroup;
    this.addNewFieldTableForm('price', 0);
    this.initDetails();
    this.initOptionsConfig();
    this.initFormSubscription();
  }

  /**
   * @function initForm Initialize form
   */
  // initDetails() {
  //   this.tableValue = [{ id: 1 }];
  //   this.invoiceService.getInvoiceData(this.reservationId).subscribe((res) => {
  //     const data = new Invoice().deserialize(res);
  //     const tableData = new TableDataList().deserialize(res.itemList).records;
  //     this.defaultTax = tableData[0].tax;
  //     let taxValues = this.defaultTax.map((item) => item.value);

  //     const addCharges = () => this.addNewCharges();

  //     if (tableData.length > 1) {
  //       Array.from({ length: tableData.length - 1 }, () => addCharges());
  //     }

  //     tableData.forEach((data, i) => {
  //       const rowData: Record<keyof PaymentField, any> = {
  //         description: data.description,
  //         unit: data.unit,
  //         unitValue: data.unitValue,
  //         amount: data.amount,
  //         tax: data.tax,
  //         totalAmount: data.totalAmount,
  //         menu: '',
  //         discount: data.discountValue || '',
  //         discountType: data.discountType || 'off',
  //         type: 'price',
  //         isDisabled: false,
  //         isSaved: false,
  //       };

  // //       this.tableFormArray.controls[i].setValue(rowData);
  // //       this.tableFormArray.controls[i].get('tax').setValue(taxValues);
  // //     });
  // //     this.useForm.patchValue(data);
  // //   });
  // // }

  initDetails() {
    this.tableValue = [{ id: 1 }];
    this.invoiceService.getInvoiceData(this.reservationId).subscribe((res) => {
      const data = new Invoice().deserialize(res);
      const tableData = new TableDataList().deserialize(res.itemList).records;
      console.log(tableData);
      this.defaultTax = tableData[0]?.tax || [{label: '', value: ''}];
      console.log(this.defaultTax);
      // this.tax.push(tableData[0].tax)
      let taxValues = this.defaultTax.map((item) => item?.value || '');

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
    // this.inputControl.discountType.setValue('off');
    let userId = this.userService.getLoggedInUserId();
    this.userService.getUserDetailsById(userId).subscribe((res)=>{
      this.inputControl.cashierName.patchValue(res.firstName);
    });    
  }


  // initDetails() {
  //   this.tableValue = [{ id: 1 }];
  //   this.tableFormArray.clear();
  //   this.invoiceService.getInvoiceData(this.reservationId).subscribe((res) => {
  //     const data = new Invoice().deserialize(res);
  //     const tableData = new TableDataList().deserialize(res.itemList).records;
  //     this.tableLength = tableData.length;
      
  //     tableData.forEach((data, i) => {
  //       let taxValues = this.tax.map((item) => item.value)
  //       this.tableFormArray.at(i).get('tax').patchValue(taxValues);
  //       if (data.discount !== 0 && data.discountType !== '') {
  //         const priceRowData = this.getRowData('price', data);
  //         const discountRowData = this.getRowData('discount', data);
  //         this.tableFormArray.push(this.fb.group(priceRowData));
  //         this.tableFormArray.push(this.fb.group(discountRowData));
  //         this.addNewCharges('discount');
  //       } else {
  //         const rowData = this.getRowData('price', data);
  //         console.log("Row Data", rowData);
  //         this.addNewCharges();
  //         this.tableFormArray.push(this.fb.group(rowData));
  //         console.log("Table Form Array - ", this.tableFormArray)
  //       }
  //       if (data.tax.length) {
  //         let taxes = data.tax.map((item) => ({label: item.label, value: item.value}));
  //         this.tax.push(...taxes);
  //       }
  //     });
  //     this.useForm.patchValue(data);
  //   });
  // }

  // initDetails() {
  //   this.tableValue = [{ id: 1 }];
  //   const newTableFormArray = this.fb.array([]);
  //   this.addNewCharges();
  //   this.invoiceService.getInvoiceData(this.reservationId).subscribe((res) => {
  //     const data = new Invoice().deserialize(res);
  //     const tableData = new TableDataList().deserialize(res.itemList).records;
  //     this.tableLength = tableData.length;
  
  //     const formGroups = tableData.map((data) => {
  //       let taxValues = this.tax.map((item) => item.value);
  //       const rowData = {
  //         description: data.description,
  //         unit: data.unit,
  //         unitValue: data.unitValue,
  //         amount: data.amount,
  //         tax: taxValues,
  //         totalAmount: data.totalAmount,
  //         menu: true,
  //         discount: data.discount,
  //         discountType: data.discountType,
  //         type: data.discount !== 0 && data.discountType !== '' ? 'discount' : 'price',
  //         isDisabled: false,
  //         isSaved: false,
  //       };
  //       return this.fb.group(rowData);
  //     });
  
  //     for (let i = 0; i < formGroups.length; i++) {
  //       const group = formGroups[i];
  //       newTableFormArray.insert(i, group);
  
  //       if (group.value.type === 'discount') {
  //         this.addNewCharges('discount');
  //       } else {
  //         this.addNewCharges();
  //       }
  
  //       if (tableData[i].tax.length) {
  //         let taxes = tableData[i].tax.map((item) => ({ label: item.label, value: item.value }));
  //         this.tax.push(...taxes);
  //       }
  //     }
  
  //     this.tableFormArray = newTableFormArray;
  //     this.useForm.patchValue(data);
  //   });
  // }
  

  getRowData(type, data) {
    switch (type) {
      case 'price':
        const rowData: Record<keyof PaymentField, any> = {
          description: data.description,
          unit: data.unit,
          unitValue: data.unitValue,
          amount: data.amount,
          tax: data.tax,
          totalAmount: data.totalAmount,
          menu: false,
          discount: 0,
          discountType: '',
          type: 'price',
          isDisabled: false,
          isSaved: false,
        };
        return rowData;

      case 'discount':
        const discountRowData: Record<keyof PaymentField, any> = {
          description: '',
          unit: 0,
          unitValue: 0,
          amount: 0,
          tax: [],
          totalAmount: 0,
          menu: true,
          discount: data.discount,
          discountType: data.discountType,
          type: 'discount',
          isDisabled: false,
          isSaved: false,
        };
        return discountRowData;

      default:
        break;
    }
  }

  getServiceOptions(rowIndex) {}

  initFormSubscription() {
    this.getTax();
  }

  /**
   * @function initForm Initialize tax options
   */
  initOptionsConfig() {
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
    return config;
  }

  /**
   * Add new entry in the payment field
   */
  addNewFieldTableForm(type, rowIndex?) {
    const data: Record<keyof PaymentField, any> = {
      description: ['', Validators.required],
      unit: [0],
      unitValue: [0],
      amount: [0],
      tax: [[]],
      totalAmount: [0],
      menu: [true],
      discount: [0],
      discountType: ['PERCENT'],
      type: [''],
      isDisabled: [false],
      isSaved: [false],
    };

    let formGroup;
    if (type === 'discount') {
      formGroup = this.fb.group({
        description: data.description,
        unit: '',
        unitValue: '',
        amount: '',
        menu: true,
        type: 'discount',
        discount: data.discount,
        discountType: data.discountType,
        totalAmount: 0,
        isDisabled: false,
        isSaved: false,
      });
      this.tableFormArray.insert(rowIndex, formGroup);
    } else {
      this.tableFormArray.push(
        this.fb.group({
          ...data,
          menu: false,
          type: 'price',
          discount: 0,
          discountType: '',
          isDisabled: false,
          isSaved: false,
        })
      );
      this.registerUnitPriceChange();
    }
  }

  /**
   * To add new charged
   */
  addNewCharges(type = 'price', rowIndex?) {
    // if (this.useForm.invalid) {
    //   this.useForm.markAllAsTouched();
    //   this.snackbarService.openSnackBarAsText(
    //     'Invalid form: Please fix the errors.'
    //   );
    //   return;
    // }
    if (type === 'discount') {
      this.addNewFieldTableForm(type, rowIndex + 1);
      this.tableValue.push({ id: this.tableValue.length + 1 });
    } else {
      this.addNewFieldTableForm(type);
      this.tableValue.push({ id: this.tableValue.length + 1 });
    }
  }

  onAddDiscount(type, rowIndex) {
    this.addNewCharges(type, rowIndex);
    this.registerDiscountChanges(rowIndex);
  }

  /**
   * @function registerUnitPriceChange To handle changes in new charges
   */
  registerUnitPriceChange() {
    const currentFormGroup = this.tableFormArray.at(
      this.tableFormArray.controls.length - 1
    ) as FormGroup;
    const { description, unit, unitValue, type } = currentFormGroup.controls;

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
    this.listenTableChanges('price');
  }

  listenTableChanges(type, index?) {
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
            if (value.isSaved) {
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

  // /**
  //  * @function registerDiscountChanges To handle changes in discount tab
  //  */
  registerDiscountChanges(index) {
    const currentFormGroup = this.tableFormArray.at(index + 1) as FormGroup;
    const currentTotalAmount = this.tableFormArray.at(index).get('totalAmount');
    const {
      discount,
      discountType,
      totalAmount,
      isDisabled,
    } = currentFormGroup.controls;

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
   * @function registerUnitPriceChange To handle changes in new charges
   */

  onSaveDiscount(index) {
    let currentFormGroup = this.tableFormArray.at(index) as FormGroup;
    let { isDisabled, isSaved } = currentFormGroup.controls;
    isSaved.setValue(true);
    this.listenTableChanges('discount', index);
    isDisabled.setValue(true);
    this.tableFormArray
      .at(index - 1)
      .get('menu')
      .setValue(true);
  }

  onEditDiscount(e, index) {
    let editGroup = this.tableFormArray.at(index + 1) as FormGroup;
    let { isDisabled, isSaved } = editGroup.controls;
    isSaved.setValue(false);
    isDisabled.setValue(false);
    if (e.item.value === 'removeDiscount') this.resetDiscount(index);
  }

  resetDiscount(index) {
    this.tableFormArray.at(index).get('menu').setValue(false);
    let totalAmount = this.tableFormArray.at(index + 1).get('totalAmount')
      .value;
    this.tableFormArray.removeAt(index + 1);
    this.tableValue.splice(index + 1, 1);
    let removedDiscount = this.inputControl.totalDiscount.value - totalAmount;
    this.inputControl.totalDiscount.patchValue(removedDiscount);
    this.inputControl.discountedAmount.patchValue(
      this.inputControl.currentAmount.value -
        this.inputControl.totalDiscount.value
    );
    this.inputControl.dueAmount.patchValue(
      this.inputControl.discountedAmount.value -
        this.inputControl.paidAmount.value
    );
  }

  removeSelectedCharges() {
    const idsToRemove = this.selectedRows.map((row) => row.id);

    // Remove rows in descending order
    for (let i = this.tableValue.length - 1; i >= 0; i--) {
      if (idsToRemove.includes(i + 1)) {
        // Check if the next row is a discount row
        const isNextRowDiscount =
          i < this.tableValue.length - 1 &&
          this.tableFormArray.at(i + 1).get('type').value === 'discount';
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
    this.tableValue.forEach((row, index) => {
      row.id = index + 1;
    });

    this.selectedRows = [];
  }

  registerOnDeleteChanges(index) {
    let currentPriceValue = this.tableFormArray.at(index).get('totalAmount')
      .value;
    let currentDiscountValue =
      this.tableFormArray.at(index + 1).get('discount').value || 0;
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

  removeGST() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    const togglePopupCompRef = this.modalService.openDialog(
      ModalComponent,
      dialogConfig
    );

    togglePopupCompRef.componentInstance.content = {
      heading: 'Remove GST details',
      description: ['Are you sure you want to remove GST details ?'],
    };
    togglePopupCompRef.componentInstance.actions = [
      {
        label: 'No',
        onClick: () => {
          this.modalService.close();
        },
        variant: 'contained',
      },
      {
        label: 'Yes',
        onClick: () => {
          this.gstForm.reset();
        }
      }
    ];  

    togglePopupCompRef.componentInstance.onClose.subscribe(() => {
      this.modalService.close();
    });
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
