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
  ConfigService,
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
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
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
import {
  BillItemFields,
  DescriptionOption,
  UseForm,
} from '../../types/forms.types';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { AddRefundComponent } from '../add-refund/add-refund.component';
import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import * as moment from 'moment';
import { PaymentMethodList } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';

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
  bookingNumber: string;

  tableFormArray: FormArray;
  useForm: FormGroup;
  currentData = new Date();

  selectedServiceIds: Set<string>;

  readonly discountOption = discountOptions;
  readonly addRefundMenu = addRefundMenu;
  readonly editRefund = editRefundMenu;
  readonly addDiscountMenu = addDiscountMenu;
  readonly editDiscountMenu = editDiscountMenu;

  tableLength = 0;
  tax: Option[] = [];

  refundOption: Option[] = [];

  isValidDiscount = true;

  addGST = false;
  addPayment = false;

  isInvoiceGenerated = false;

  $subscription = new Subscription();
  typeSubscription: Subscription;

  serviceOptions: Option[];
  paymentOptions: Option[];

  descriptionOffSet = 0;

  loadingData = false;
  loadingDescription = false;

  noMoreDescription = false;

  selectedSearchIndex = -1;
  descriptionOptions: DescriptionOption[] = [];

  defaultDescriptionOptions: DescriptionOption[] = [];

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
    private modalService: ModalService,
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private configService: ConfigService,
    private manageReservationService: ManageReservationService
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.initPageHeaders();
  }

  get inputControl() {
    return this.useForm.controls as Record<keyof UseForm, AbstractControl>;
  }

  ngOnInit(): void {
    this.hotelId = this.globalFilterService.hotelId;
    this.initForm();
    this.initOptions();
  }

  initOptions() {
    this.configService.$config.subscribe((config) => {
      if (config) {
        this.refundOption = config.currencyConfiguration.map((item) => ({
          label: item.key,
          value: item.value,
        }));
        this.inputControl.currency.setValue(this.refundOption[0].value);
      }
    });
    this.initPaymentOptions();
  }

  initPaymentOptions() {
    this.$subscription.add(
      this.manageReservationService.getPaymentMethod(this.hotelId).subscribe(
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

  /**
   * Initialize page title and navigator
   */
  initPageHeaders() {
    const { title, navRoutes } = invoiceRoutes['invoice'];
    this.pageTitle = title;
    this.navRoutes = navRoutes;
  }

  /**
   * @function initForm Initialize form
   */
  initForm(): void {
    const { firstName, lastName } = this.userService.userDetails;

    this.useForm = this.fb.group({
      invoiceNumber: [],

      guestName: ['', Validators.required],
      companyName: [''],

      gstNumber: ['', Validators.required],
      // contactName: ['', Validators.required],
      // contactNumber: ['', Validators.required],
      email: ['', Validators.required],
      address: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      pin: ['', Validators.required],

      additionalNote: [''],
      tableData: new FormArray([]),

      totalAmount: [0],
      paidAmount: [0],
      dueAmount: [0],

      currency: [''],

      cashierName: [
        { value: `${firstName} ${lastName}`, disabled: true },
        Validators.required,
      ],

      /**
       * PUT A CHECK OF DUE AMOUNT PAYMENT RECIEVED
       */
      // Payment Details
      remarks: [''],
      paymentMethod: [''],
      receivedPayment: [''],
      transactionId: [''],
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;

    this.initFormDetails();

    this.gstValidation(false);
    this.paymentValidation(false);
  }

  /**
   * Patch the initial form values
   */
  initFormDetails() {
    this.$subscription.add(
      this.invoiceService
        .getReservationDetail(this.reservationId)
        .subscribe((res) => {
          const guestData = res.guestDetails.primaryGuest;
          this.inputControl.guestName.patchValue(
            `${guestData.firstName} ${guestData.lastName}`
          );

          this.guestId = guestData.id;
          this.bookingNumber = res.number;
        })
    );

    this.getBillingSummary();
  }

  getBillingSummary() {
    this.loadingData = true;

    const { firstName, lastName } = this.userService.userDetails;

    this.$subscription.add(
      this.invoiceService.getInvoiceData(this.reservationId).subscribe(
        (res) => {
          // saving initial invoice data
          this.invoiceService.initInvoiceData(res);

          const { serviceIds, guestName, ...data } = new Invoice().deserialize(
            res,
            {
              cashierName: `${firstName} ${lastName}`,
              guestName: this.inputControl.guestName.value,
              currency: 'INR',
            }
          );

          this.selectedServiceIds = serviceIds;

          // if GST details is present
          if (data.gstNumber !== '') {
            this.addGST = true;
            this.gstValidation(true);
          }

          // adding new table entry to patch data
          data.tableData.forEach((item, idx) => {
            this.addNewCharges({
              rowIndex: idx,
              isNewEntry: false,
              unit: item.unit,
            });
          });

          this.useForm.patchValue(data, {
            emitEvent: false,
          });

          res.billItems.forEach((item) => {
            this.defaultDescriptionOptions.push({
              label: item.description,
              value: item.id, // billItemId
            });
          });

          // disabling invoice if already generated
          this.isInvoiceGenerated = res.invoiceGenerated;
          if (this.isInvoiceGenerated) {
            this.useForm.disable();
          }

          this.getDescriptionOptions();
        },
        (error) => {
          this.router.navigateByUrl('/pages/efrontdesk');
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }

  handleFocus(index: number) {
    this.selectedSearchIndex = index;
  }

  handleBlur() {
    this.selectedSearchIndex = -1;
  }

  paymentValidation(addValidation: boolean = true) {
    const paymentMethodControl = this.useForm.get('paymentMethod');
    const receivedPaymentControl = this.useForm.get('receivedPayment');
    // const transactionIdControl = this.useForm.get('transactionId');
    // const remarksControl = this.useForm.get('remarks');

    [
      paymentMethodControl,
      receivedPaymentControl,
      // transactionIdControl,
      // remarksControl,
    ].forEach((item) => {
      if (addValidation) {
        item.setValidators([Validators.required]);
        if (item === receivedPaymentControl) {
          item.setValidators([Validators.required, Validators.min(1)]);
        }
      } else {
        item.clearValidators();
        item.updateValueAndValidity();
        item.reset();
      }
    });
  }

  gstValidation(addValidation: boolean = true) {
    const companyNameControl = this.useForm.get('companyName');

    const gstNumberControl = this.useForm.get('gstNumber');
    // const contactNameControl = this.useForm.get('contactName');
    // const contactNumberControl = this.useForm.get('contactNumber');
    const emailControl = this.useForm.get('email');
    const addressControl = this.useForm.get('address');
    const stateControl = this.useForm.get('state');
    const cityControl = this.useForm.get('city');
    const pinControl = this.useForm.get('pin');

    [
      gstNumberControl,
      // contactNameControl,
      // contactNumberControl,
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
      companyNameControl.markAsUntouched();
    } else {
      companyNameControl.clearValidators();
      companyNameControl.updateValueAndValidity();
      companyNameControl.markAsUntouched();
    }
  }

  isTableInvalid(triggerMessage = true) {
    if (this.tableFormArray.invalid) {
      this.markAsTouched(this.tableFormArray);
      if (triggerMessage)
        this.snackbarService.openSnackBarAsText(
          'Please select the previously added item.'
        );
      return true;
    }
    return false;
  }

  /**
   * Handle addition of table entry (New Charges)
   */
  addNewCharges(settings: AddNewChargesSettings = {}) {
    const {
      rowIndex,
      isNewEntry,
      isDebit,
      unit,
      isDisabled,
    }: AddNewChargesSettings = {
      rowIndex: null,
      isNewEntry: true,
      isDebit: true,
      unit: 1,
      isDisabled: false,
      ...settings,
    };

    if (this.tableFormArray.length > 0 && !rowIndex) {
      if (this.isTableInvalid()) return;
    }

    const data: Record<keyof BillItemFields, any> = {
      key: [`${Date.now()}`],
      description: ['', []],
      billItemId: ['', [Validators.required]],
      unit: [unit, [Validators.min(1)]],
      creditAmount: [0],
      debitAmount: [0],
      date: [moment(new Date()).unix() * 1000],
      transactionType: [isDebit ? 'DEBIT' : 'CREDIT'],
      isDisabled: [isDisabled],
      itemId: [null],
      isNew: [isNewEntry],
      taxId: [''],
      isDiscount: [false],
      isRefundOrPayment: [false],
    };

    const formGroup = this.fb.group(data);

    if (rowIndex) {
      this.tableFormArray.insert(rowIndex, formGroup);
    } else this.tableFormArray.push(formGroup);

    this.registerServiceSelection();
    this.listenTableChanges();
  }

  get tableValue() {
    return [...Array(this.tableFormArray.length).keys()].map((i) => i + 1);
    //  Array.from({ length: n }, (_, i) => i + 1)
  }

  get lastBillItem() {
    return this.tableFormArray.at(
      this.tableFormArray.controls.length - 1
    ) as FormGroup;
  }

  /**
   * To handle changes in service charges
   */
  registerServiceSelection() {
    const billItemIdx = this.tableFormArray.controls.length - 1;
    const currentFormGroup = this.tableFormArray.at(billItemIdx) as FormGroup;

    const {
      billItemId,
      unit,
      debitAmount,
      itemId,
    } = currentFormGroup.controls as TableFormItemControl;

    billItemId.valueChanges
      .pipe(startWith(''), pairwise())
      .subscribe(([prevId, currId]) => {
        const selectedService = this.descriptionOptions.find(
          (item) => item.value === currId
        );

        if (!selectedService) return;

        // Adding to selected service ids
        this.selectedServiceIds.add(currId);

        this.addNewDefaultDescription({
          label: selectedService.label,
          value: selectedService.value,
        });

        currentFormGroup.patchValue({
          itemId: selectedService.value,
          description: selectedService.label,
          debitAmount: selectedService.amount,
        });

        unit.patchValue(1, { emitEvent: false });

        const newServiceTax: Partial<
          BillItemFields
        >[] = selectedService.taxes.map((item) => ({
          taxId: item.id,
          itemId: selectedService.value,
          debitAmount: this.adminUtilityService.getEpsilonValue(
            selectedService.amount * (item.taxValue / 100)
          ),
          billItemId: item.id,
          description: `${item.taxType} (${item.taxValue}%) ${selectedService.label}`,
        }));

        newServiceTax.forEach((item) => {
          const { debitAmount, ...data } = item;
          const length = this.tableFormArray.length;
          this.addNewCharges({ isDisabled: true });
          this.tableFormArray.at(length).patchValue(data, { emitEvent: false });
          this.tableFormArray
            .at(length)
            .get('debitAmount')
            .patchValue(debitAmount);

          this.addNewDefaultDescription({
            label: item.description,
            value: item.billItemId,
          });
        });

        if (prevId) this.findAndRemoveItems(prevId);
      });

    let doNotUpdateUnit = false;

    unit.valueChanges
      .pipe(startWith(unit.value), pairwise())
      .subscribe(([prevUnitQuantity, currentUnitQuantity]) => {
        if (prevUnitQuantity === currentUnitQuantity) return;

        if (doNotUpdateUnit) {
          doNotUpdateUnit = false;
          return;
        }
        if (unit.invalid || debitAmount.invalid) return;

        const discountControl = this.hasDiscount(itemId.value);
        const discountValue = discountControl?.value.creditAmount ?? 0;

        const currentDebitAmount = debitAmount.value;
        const newDebitAmount =
          (currentDebitAmount / prevUnitQuantity) * currentUnitQuantity;

        if (discountControl && newDebitAmount < discountValue) {
          doNotUpdateUnit = true;

          this.snackbarService.openSnackBarAsText(
            'To decrease the number of units, please either update or remove the discount for this item.'
          );
          currentFormGroup.patchValue({ unit: prevUnitQuantity });
          return;
        }

        currentFormGroup.patchValue({ debitAmount: newDebitAmount });

        this.updateTax(
          currentDebitAmount - discountValue,
          itemId.value,
          newDebitAmount - discountValue
        );
      });
  }

  /**
   * Find and remove item from the table of same item id
   * @param idToRemove ID of the items you want to remove
   */
  findAndRemoveItems(idToRemove: string) {
    // removing the selected serviceID
    this.selectedServiceIds.delete(idToRemove);

    // Step 1: Filter out items with the same ID
    const itemsToRemove = this.tableFormArray.controls.filter(
      (control: Controls) => control.value.itemId === idToRemove
    );

    // Step 2: Remove each matching item
    itemsToRemove.forEach((item) =>
      this.tableFormArray.removeAt(this.tableFormArray.controls.indexOf(item))
    );
    // Step 3: Adjust the FormArray's length or resize it if necessary
    this.tableFormArray.updateValueAndValidity();
  }

  removeSingleItem(billItemId: string) {
    const itemToRemove = this.tableFormArray.controls.find(
      (control: Controls) => control.value.billItemId === billItemId
    );

    this.tableFormArray.removeAt(
      this.tableFormArray.controls.indexOf(itemToRemove)
    );
    this.tableFormArray.updateValueAndValidity();
  }

  listenTableChanges() {
    this.tableFormArray.valueChanges.subscribe((values: BillItemFields[]) => {
      const updatedAmounts = values.reduce(
        (prev, curr) => {
          if (curr.transactionType === 'DEBIT' && curr.debitAmount) {
            prev.totalAmount = prev.totalAmount + curr.debitAmount;
          }
          if (curr.transactionType === 'CREDIT' && curr.creditAmount) {
            prev.paidAmount = prev.paidAmount + curr.creditAmount;
          }
          return prev;
        },
        {
          totalAmount: 0,
          paidAmount: 0,
        }
      );

      const { totalAmount, paidAmount } = updatedAmounts;
      this.useForm.patchValue(
        {
          totalAmount,
          paidAmount,
          dueAmount: totalAmount - paidAmount,
        },
        { emitEvent: false }
      );

      console.log(updatedAmounts);
    });
  }

  getTableRowFormGroup(index: number) {
    const data = this.tableFormArray.at(index) as FormGroup;
    const formControl = data.controls as Record<
      keyof BillItemFields,
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

    this.addDiscountModal({
      amount: priceControls.debitAmount.value,
      serviceName: priceControls.description.value,
      itemId: priceControls.itemId.value,
      isRemoveDiscount: value === DiscountActionItem.REMOVE_DISCOUNT,
      index,
    });
  }

  removeSelectedCharges() {
    this.selectedRows.forEach((item) => this.findAndRemoveItems(item));
    this.selectedRows = [];

    return;
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

  markAsTouched = (control: AbstractControl) => {
    if (control instanceof FormArray) {
      control.controls.forEach((formGroup: FormGroup) => {
        Object.values(formGroup.controls).forEach((control) =>
          this.markAsTouched(control)
        );
      });
    } else if (control instanceof FormGroup) {
      Object.values(control.controls).forEach((control) =>
        this.markAsTouched(control)
      );
    } else if (control.validator) {
      control.markAsTouched();
    }
  };

  previewAndGenerate(): void {
    // if(!this.inputControl.paidAmount.value){
    //   this.snackbarService.openSnackBarAsText(
    //     'Paid amount is 0: Invoice cannot preview or generate'
    //   )
    //   return;
    // }

    this.router.navigate(['../preview-invoice', this.reservationId], {
      relativeTo: this.route,
    });
  }

  handleSave(): void {
    if (!this.addGST) this.gstValidation(false);

    this.markAsTouched(this.useForm);
    this.markAsTouched(this.tableFormArray);

    if (this.useForm.invalid) {
      this.snackbarService.openSnackBarAsText(
        'Invalid form: Please fix the errors.'
      );
      return;
    }

    const invoiceFormData = this.useForm.getRawValue() as UseForm;
    const data = this.invoiceService.getPostInvoiceData(
      invoiceFormData,
      {
        reservationId: this.reservationId,
        hotelId: this.hotelId,
        guestId: this.guestId,
        currency: 'INR',
      },
      this.defaultDescriptionOptions
    );

    this.$subscription.add(
      this.invoiceService
        .updateInvoice(this.reservationId, data)
        .subscribe((res) => {
          this.snackbarService.openSnackBarAsText(
            'Invoice Updated Successfully',
            '',
            { panelClass: 'success' }
          );
          this.refreshData();
        })
    );
  }

  /**
   * Rest data after save
   */
  refreshData() {
    this.addPayment = false;
    this.paymentValidation(false);
    this.tableFormArray.clear();
    this.tableFormArray.updateValueAndValidity();
    this.useForm.updateValueAndValidity();
    this.getBillingSummary();
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

  get filteredDescriptionOptions() {
    if (!this.selectedServiceIds?.size) return this.descriptionOptions;
    return this.descriptionOptions.filter(
      (item) => !this.selectedServiceIds.has(item.value)
    );
  }

  /**
   * Getting All Services (Description)
   */
  getDescriptionOptions() {
    this.loadingDescription = true;

    this.servicesService
      .getLibraryItems<ServiceListResponse>(this.hotelId, {
        params: `?&type=${LibraryItem.service}&serviceType=PAID&limit=10&offset=${this.descriptionOffSet}&status=true`,
      })
      .subscribe(
        (res) => {
          const data = new ServiceList().deserialize(res).allService;
          this.descriptionOptions = [...this.descriptionOptions, ...data];
          this.noMoreDescription = res.paidPackages.length < 10;
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
              ?.filter(
                (item) => item.active || !this.selectedServiceIds.has(item.id)
              )
              .map((item) => new Service().deserialize(item)) ?? [];

          this.descriptionOptions = serviceListData;
        });
    } else {
      this.descriptionOffSet = 0;

      this.descriptionOptions = [];

      this.getDescriptionOptions();
    }
  }

  /***
   * Navigate to service form
   */
  createService() {
    this.router.navigateByUrl('pages/library/services/create-service');
  }

  /**
   * Handle Invoice download
   */

  /**
   * @function ngOnDestroy to unsubscribe subscription.
   */
  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }

  addNewDefaultDescription(option: DescriptionOption) {
    this.defaultDescriptionOptions = [
      ...this.defaultDescriptionOptions,
      option,
    ];
  }

  hasDiscount(itemId: string) {
    const alreadyHasDiscount: Controls = this.tableFormArray.controls.find(
      (control: Controls) =>
        control.value.itemId === itemId && control.value.isDiscount
    );
    return alreadyHasDiscount;
  }

  addDiscountModal(data: {
    amount: number;
    serviceName: string;
    index: number;
    itemId: string;
    isRemoveDiscount: boolean;
  }) {
    const { amount, serviceName, index, itemId, isRemoveDiscount } = data;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '40%';
    const discountComponentRef = this.modalService.openDialog(
      AddDiscountComponent,
      dialogConfig
    );
    discountComponentRef.componentInstance.originalAmount = amount;
    discountComponentRef.componentInstance.serviceName = serviceName;
    discountComponentRef.componentInstance.isRemove = isRemoveDiscount;
    // discountComponentRef.componentInstance.tax = taxPercentage;

    discountComponentRef.componentInstance.onClose.subscribe(
      (res: { totalDiscount: number }) => {
        this.modalService.close();
        if (!res) return;

        const totalDiscount = res.totalDiscount;
        const alreadyHasDiscount = this.hasDiscount(itemId);
        const taxedAmount =
          amount - (alreadyHasDiscount?.value.creditAmount ?? 0); // Amount to be used for the reversed tax calculation
        const newTaxedAmount = amount - totalDiscount;

        if (!totalDiscount) {
          if (alreadyHasDiscount) {
            this.removeSingleItem(alreadyHasDiscount.value.billItemId);
            this.updateTax(taxedAmount, itemId, newTaxedAmount);
          }
          return;
        }

        if (!alreadyHasDiscount) {
          const value = `DISCOUNT (${serviceName})`;
          this.addNonBillItem({
            amount: totalDiscount,
            itemId: itemId,
            transactionType: 'CREDIT',
            type: 'discount',
            value: value,
            entryIdx: index + 1,
          });
        } else alreadyHasDiscount.patchValue({ creditAmount: totalDiscount });

        this.updateTax(taxedAmount, itemId, newTaxedAmount);
      }
    );
  }

  updateTax(taxedAmount: number, itemId: string, newTaxedAmount: number) {
    this.tableFormArray.controls.forEach((control: Controls) => {
      if (control.value.itemId === itemId && control.value.taxId) {
        const currentTax = control.value.debitAmount;
        const taxFraction = currentTax / taxedAmount;

        const newTax = this.adminUtilityService.getEpsilonValue(
          newTaxedAmount * taxFraction
        );
        control.patchValue({ debitAmount: newTax });
      }
    });

    this.tableFormArray.updateValueAndValidity();
  }

  addNonBillItem(settings: {
    transactionType: BillItemFields['transactionType'];
    amount: number;
    itemId: string;
    value: string;
    entryIdx?: number;
    type: 'discount' | 'refund' | 'other';
  }) {
    const { type, amount, itemId, value, entryIdx, transactionType } = {
      entryIdx: this.tableFormArray.length,
      ...settings,
    };

    this.addNewCharges({
      rowIndex: entryIdx,
      isNewEntry: true,
      isDebit: true,
      isDisabled: true,
    });

    this.addNewDefaultDescription({
      label: value,
      value: value,
    });

    const data = this.invoiceService.generateBillItem({
      creditAmount: transactionType === 'CREDIT' ? amount : 0,
      debitAmount: transactionType === 'DEBIT' ? amount : 0,
      billItemId: value,
      description: value,
      isDiscount: type === 'discount',
      isRefundOrPayment: type === 'refund',
      itemId,
      transactionType: transactionType,
    });

    this.tableFormArray.at(entryIdx).patchValue(data);
  }

  handleRefund() {
    if (this.isTableInvalid()) return;

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '40%';
    const discountComponentRef = this.modalService.openDialog(
      AddRefundComponent,
      dialogConfig
    );

    /**
     * Need to update this with excess amount and need to add also
     */
    discountComponentRef.componentInstance.maxAmount = -this.inputControl
      .dueAmount.value;

    discountComponentRef.componentInstance.onClose.subscribe(
      (res: { refundAmount: number; remarks: string }) => {
        console.log(res);

        if (res) {
          this.addNonBillItem({
            amount: res.refundAmount,
            itemId: `refund-${moment(new Date()).unix() * 1000}`,
            transactionType: 'DEBIT',
            type: 'refund',
            value: 'Paid Out' + `${res.remarks ? ` (${res.remarks})` : ''}`,
          });
        }

        this.modalService.close();
      }
    );
  }
}

export type TableFormItemControl = Record<
  keyof BillItemFields,
  AbstractControl
>;

type AddNewChargesSettings = {
  rowIndex?: number;
  isNewEntry?: boolean;
  isDebit?: boolean;
  unit?: number;
  isDisabled?: boolean;
};

type Controls = Omit<AbstractControl, 'value'> & { value: BillItemFields };
