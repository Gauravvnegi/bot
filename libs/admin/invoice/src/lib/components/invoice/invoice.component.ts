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
import {
  GlobalFilterService,
  RoutesConfigService,
} from '@hospitality-bot/admin/core/theme';
import { LibraryItem, QueryConfig } from '@hospitality-bot/admin/library';
import {
  AdminUtilityService,
  EntitySubType,
  ModuleNames,
  NavRouteOptions,
  Option,
  UserService,
} from '@hospitality-bot/admin/shared';
import {
  ModalService,
  SnackBarService,
} from '@hospitality-bot/shared/material';
import { PaymentMethodList } from 'libs/admin/manage-reservation/src/lib/models/reservations.model';
import { ManageReservationService } from 'libs/admin/manage-reservation/src/lib/services/manage-reservation.service';
import { ReservationService } from 'libs/admin/reservation/src/lib/services/reservation.service';
import { errorMessages } from 'libs/admin/room/src/lib/constant/form';
import { ServicesService } from 'libs/admin/services/src/lib/services/services.service';
import { ServiceListResponse } from 'libs/admin/services/src/lib/types/response';
import { ModalComponent } from 'libs/admin/shared/src/lib/components/modal/modal.component';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import {
  addDiscountMenu,
  defaultMenu,
  MenuActionItem,
  editDiscountMenu,
  AdditionalChargesType,
  additionalChargesDetails,
} from '../../constants/invoice.constant';

import { cols } from '../../constants/payment';
import { invoiceRoutes } from '../../constants/routes';
import {
  Invoice,
  MenuItemsList,
  Service,
  ServiceList,
} from '../../models/invoice.model';
import { InvoiceService } from '../../services/invoice.service';
import {
  BillItemFields,
  ChargesType,
  DescriptionOption,
  PaymentForm,
  UseForm,
} from '../../types/forms.types';
import { AddDiscountComponent } from '../add-discount/add-discount.component';
import { AddRefundComponent } from '../add-refund/add-refund.component';
import { MenuItemListResponse } from 'libs/admin/all-outlets/src/lib/types/outlet';
import { DetailsComponent } from '@hospitality-bot/admin/reservation';

@Component({
  selector: 'hospitality-bot-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  readonly errorMessages = errorMessages;
  pageTitle: string;
  navRoutes: NavRouteOptions;

  entityId: string;
  reservationId: string;
  guestId: string;
  bookingNumber: string;
  entityType: EntitySubType;

  tableFormArray: FormArray;
  useForm: FormGroup;

  selectedServiceIds: Set<string>;

  tableLength = 0;
  tax: Option[] = [];

  isValidDiscount = true;

  addGST = false;
  addPayment = false;
  addRefund = false;

  isInvoiceGenerated = false;
  pmsBooking = false;
  isInvoiceDisabled = false;
  invoicePrepareRequest = false;

  $subscription = new Subscription();
  typeSubscription: Subscription;

  serviceOptions: Option[];
  paymentOptions: Option[];

  descriptionOffSet = 0;
  loadingDescription = false;
  noMoreDescription = false;

  selectedSearchIndex = -1;
  descriptionOptions: DescriptionOption[] = [];
  defaultDescriptionOptions: DescriptionOption[] = [];
  focusedDescriptionId: string;

  loadingData = false;
  isInitialized = false;

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
    private manageReservationService: ManageReservationService,
    private reservationService: ReservationService,
    private routesConfigService: RoutesConfigService
  ) {
    this.reservationId = this.activatedRoute.snapshot.paramMap.get('id');
    this.initPageHeaders();
  }

  get inputControl() {
    return this.useForm.controls as Record<keyof UseForm, AbstractControl>;
  }

  ngOnInit(): void {
    const paramData = this.route.snapshot.queryParams;
    this.entityId = paramData.entityId
      ? paramData.entityId
      : this.globalFilterService.entityId;
    this.entityType = paramData.type;
    this.initForm();
    this.initOptions();
    this.initNavRoutes();
  }

  initOptions() {
    this.initPaymentOptions();
  }

  initPaymentOptions() {
    this.$subscription.add(
      this.manageReservationService.getPaymentMethod(this.entityId).subscribe(
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

  initNavRoutes() {
    this.routesConfigService.navRoutesChanges.subscribe((navRoutesRes) => {
      this.navRoutes = [...navRoutesRes, ...this.navRoutes];
    });
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
    const { firstName, lastName, id } = this.userService.userDetails;

    this.useForm = this.fb.group({
      invoiceNumber: [],

      guestName: ['', Validators.required],
      companyName: [''],
      arrivalDate: [0],
      departureDate: [0],

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
      discountedAmount: [0],
      netAmount: [0],

      currency: [''],

      cashierName: [
        { value: `${firstName} ${lastName}`, disabled: true },
        Validators.required,
      ],
      cashierId: [id],

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
          this.useForm.patchValue({
            guestName: `${guestData.firstName} ${guestData.lastName}`,
            companyName: guestData?.companyName || '',
            arrivalDate: res.arrivalTime,
            departureDate: res.departureTime,
          });
          this.invoiceService.isPrintRate.next(res?.paymentSummary?.printRate);
          this.guestId = guestData.id;
          this.bookingNumber = res.number;
          this.invoicePrepareRequest = res.invoicePrepareRequest;
          this.pmsBooking = res.pmsBooking;
          if (this.pmsBooking) this.disableInvoice();
          this.isInitialized = true;
        })
    );

    this.getBillingSummary();
  }

  getBillingSummary() {
    this.loadingData = true;

    const { firstName, lastName, id } = this.userService.userDetails;

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
              cashierId: id,
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
          if (this.isInvoiceGenerated) this.disableInvoice();

          this.getDescriptionOptions();
        },
        (error) => {
          this.routesConfigService.navigate({
            subModuleName: ModuleNames.INVOICE,
          });
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }

  disableInvoice() {
    this.useForm.disable();
    this.isInvoiceDisabled = true;
  }

  handleFocus(index: number) {
    this.selectedSearchIndex = index;
    const currId = this.tableFormArray.at(index).get('billItemId').value;
    if (currId) {
      this.focusedDescriptionId = currId;
    }
  }

  handleBlur() {
    this.selectedSearchIndex = -1;
    this.focusedDescriptionId = '';
  }

  getMenu(rowIndex: number) {
    const rowFG: BillItemFields = this.tableFormArray.at(rowIndex).value;
    const dMenu = rowFG.isDiscount || !rowFG.isAddOn ? [] : defaultMenu;

    if (rowFG.isMiscellaneous) {
      return dMenu;
    }
    if (this.hasDiscount(rowFG.itemId)) {
      return [...editDiscountMenu, ...dMenu];
    }
    return [...addDiscountMenu, ...dMenu];
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

    const epochDate = settings?.date
      ? settings.date
      : moment(new Date()).unix() * 1000;

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
      date: [epochDate],
      transactionType: [isDebit ? 'DEBIT' : 'CREDIT'],
      isDisabled: [isDisabled],
      itemId: [null],
      isNew: [isNewEntry],
      taxId: [''],
      isDiscount: [false],
      isNonEditableBillItem: [false],
      isAddOn: [true],
      isMiscellaneous: [false],
      reservationItemId: [null],
      isRefund: [false],
      discountType: [''],
      discountValue: [0],
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
      reservationItemId,
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
          reservationItemId: selectedService.value,
          description: selectedService.label,
          debitAmount: selectedService.amount,
        });

        unit.patchValue(1, { emitEvent: false });

        const newServiceTax: Partial<
          BillItemFields
        >[] = selectedService.taxes.map((item) => ({
          taxId: item.id,
          itemId: selectedService.value,
          reservationItemId: selectedService.value,
          debitAmount: this.adminUtilityService.getEpsilonValue(
            selectedService.amount * (item.taxValue / 100)
          ),
          billItemId: item.id,
          description: `${selectedService.label} ${item.taxType} ${item.taxValue}% `,
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
          reservationItemId.value,
          newDebitAmount - discountValue
        );
      });
  }

  /**
   * Find and remove item from the table of same item id
   * @param idToRemove ID of the items you want to remove
   */
  findAndRemoveItems(idToRemove?: string) {
    // removing the selected serviceID
    this.selectedServiceIds.delete(idToRemove);

    // Step 1: Filter out items with the same ID
    const itemsToRemove = this.tableFormArray.controls.filter(
      (control: Controls) => control.value.reservationItemId === idToRemove
    );

    // Step 2: Remove each matching item
    itemsToRemove.forEach((item) =>
      this.tableFormArray.removeAt(this.tableFormArray.controls.indexOf(item))
    );
    // Step 3: Adjust the FormArray's length or resize it if necessary
    this.tableFormArray.updateValueAndValidity();
  }

  removeDiscountItems(itemId: string) {
    const itemsToRemove = this.tableFormArray.controls.filter(
      (control: Controls) =>
        control.value.itemId === itemId && control.value.isDiscount
    );
    // Step 2: Remove each matching item
    itemsToRemove.forEach((item) =>
      this.tableFormArray.removeAt(this.tableFormArray.controls.indexOf(item))
    );
    this.tableFormArray.updateValueAndValidity();
  }

  listenTableChanges() {
    this.tableFormArray.valueChanges.subscribe((values: BillItemFields[]) => {
      const updatedAmounts = values.reduce(
        (prev, curr) => {
          if (curr.transactionType === 'DEBIT' && curr.debitAmount) {
            prev.totalAmount += curr.debitAmount;
          }
          if (curr.transactionType === 'CREDIT' && curr.creditAmount) {
            if (curr.isDiscount) prev.discountedAmount += curr.creditAmount;
            else prev.paidAmount += curr.creditAmount;
          }

          return prev;
        },
        {
          totalAmount: 0,
          paidAmount: 0,
          discountedAmount: 0,
        }
      );

      const { totalAmount, paidAmount, discountedAmount } = updatedAmounts;
      this.useForm.patchValue(
        {
          totalAmount,
          paidAmount,
          discountedAmount,
          netAmount: totalAmount - discountedAmount,
          dueAmount: totalAmount - discountedAmount - paidAmount,
        },
        { emitEvent: false }
      );
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

  getTableRowValue(index: number) {
    return this.tableFormArray.at(index).value as BillItemFields;
  }

  /**
   * Handle discount flow
   */
  handleMenuAction(
    { item: { value } }: { item: { value: MenuActionItem } },
    index: number
  ) {
    const priceControls = this.getTableRowValue(index);

    /**
     * If delete item action is performed
     */
    if (value === MenuActionItem.DELETE_ITEM) {
      this.findAndRemoveItems(priceControls.reservationItemId);
      return;
    }

    /**
     * To update or add discount
     */
    const itemId = priceControls.itemId;
    const reservationItemId = priceControls.reservationItemId;

    const priceItem = this.getAllItemWithSameItemId(itemId).find(
      (item) => !item.control.value.taxId && !item.control.value.isDiscount
    );

    this.addDiscountModal({
      amount: priceItem.control.value.debitAmount,
      serviceName: priceItem.control.value.description,
      index,
      itemId,
      reservationItemId,
      discountAction: value,
    });
  }

  removeSelectedCharges() {
    this.selectedRows.forEach((item) => {
      this.findAndRemoveItems(item);
    });
    this.selectedRows = [];

    return;
  }

  getAllItemWithSameItemId(itemId: string) {
    const res = this.tableFormArray.controls
      .map((control: Controls, index) => ({ index, control }))
      .filter((item) => item.control.value.itemId === itemId);

    return res;
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
    this.router.navigate(['../preview-invoice', this.reservationId], {
      relativeTo: this.route,
    });
  }

  prepareInvoice() {
    this.$subscription.add(
      this.reservationService.prepareInvoice(this.reservationId).subscribe(
        (_) => {
          this.invoicePrepareRequest = true;
          this.snackbarService.openSnackBarAsText(
            'Ticket raised for invoice.',
            '',
            { panelClass: 'success' }
          );
        },
        ({ error }) => {}
      )
    );
  }

  handleSave(): void {
    // Commenting it as GST Code is commented as of now
    // if (!this.addGST) this.gstValidation(false);

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
        entityId: this.entityId,
        guestId: this.guestId,
        currency: 'INR',
      },
      this.defaultDescriptionOptions,
      this.addPayment
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
    this.addRefund = false;
    this.paymentValidation(false);
    this.tableFormArray.clear();
    this.tableFormArray.updateValueAndValidity();
    this.resetPaymentForm();
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

  resetPaymentForm() {
    const paymentConfig: PaymentForm = {
      remarks: '',
      paymentMethod: '',
      receivedPayment: null,
      transactionId: '',
    };
    this.useForm.patchValue(paymentConfig);
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
    this.addRefund = false;
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

  onAddRefund() {
    this.addPayment = false;
    if (this.addRefund) {
      this.removeDetails(
        'Remove Payment Details',
        'Are you sure you want to remove payment details?',
        () => {
          this.addRefund = false;
          this.paymentValidation(false);
        }
      );
    } else {
      this.addRefund = true;
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
      (item) =>
        !this.selectedServiceIds.has(item.value) ||
        item.value === this.focusedDescriptionId
    );
  }

  /**
   * Getting All Services (Description)
   */
  getDescriptionOptions() {
    this.loadingDescription = true;

    if (this.entityType === EntitySubType.RESTAURANT) {
      this.manageReservationService.getMenuList(this.entityId).subscribe(
        (items: MenuItemListResponse) => {
          const data = new MenuItemsList().deserialize(items).menuItems;
          this.descriptionOptions = [...this.descriptionOptions, ...data];
          this.noMoreDescription = items.records.length < 10;
          this.loadingDescription = false;
        },
        (err) => {
          this.loadingDescription = false;
        }
      );
    } else {
      this.servicesService
        .getLibraryItems<ServiceListResponse>(this.entityId, {
          params: `?&type=${LibraryItem.service}&serviceType=PAID&limit=10&offset=${this.descriptionOffSet}&status=true&raw=true`,
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
        .searchLibraryItem(this.entityId, {
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
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.SERVICES,
      additionalPath: 'create-service',
      queryParams: {
        entityId: this.entityId,
      },
    });
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
    reservationItemId: string;
    discountAction: MenuActionItem;
  }) {
    const {
      amount,
      serviceName,
      index,
      itemId,
      reservationItemId,
      discountAction,
    } = data;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '40%';
    const discountComponentRef = this.modalService.openDialog(
      AddDiscountComponent,
      dialogConfig
    );
    discountComponentRef.componentInstance.originalAmount = amount;
    discountComponentRef.componentInstance.serviceName = serviceName;
    discountComponentRef.componentInstance.discountAction = discountAction;
    // discountComponentRef.componentInstance.tax = taxPercentage;

    discountComponentRef.componentInstance.onClose.subscribe(
      (res: { discountType: string; totalDiscount: number }) => {
        this.modalService.close();
        if (!res) return;
        const totalDiscount = res.totalDiscount;
        const alreadyHasDiscount = this.hasDiscount(itemId);
        const taxedAmount =
          amount - (alreadyHasDiscount?.value.creditAmount ?? 0); // Amount to be used for the reversed tax calculation
        const newTaxedAmount = amount - totalDiscount;

        const reservationItem = this.getAllItemWithSameItemId(itemId).filter(
          (item) => !item.control.value.taxId && !item.control.value.isDiscount
        );

        const discountItem = this.getAllItemWithSameItemId(itemId).filter(
          (item) => item.control.value.isDiscount
        );

        // Update each discountItem with the total discount
        discountItem.forEach((item) => {
          item.control.patchValue({ creditAmount: totalDiscount });
        });

        if (!totalDiscount) {
          if (alreadyHasDiscount) {
            this.removeDiscountItems(discountItem[0].control.value.itemId);
            reservationItem.forEach((item) => {
              this.updateTax(
                taxedAmount,
                item.control.value.billItemId,
                newTaxedAmount
              );
            });
          }
          return;
        }

        if (!alreadyHasDiscount) {
          const value = `DISCOUNT (${serviceName})`;
          reservationItem.forEach((item, index) => {
            this.addNonBillItem({
              amount: totalDiscount,
              itemId: itemId,
              reservationItemId: reservationItemId,
              transactionType: 'CREDIT',
              type: 'discount',
              value: value,
              entryIdx: item.index + 1 + index,
              date: item.control.value.date,
              discountType: res.discountType,
              discountValue: totalDiscount,
            });
          });
        } else alreadyHasDiscount.patchValue({ creditAmount: totalDiscount });
        reservationItem.forEach((item) => {
          this.updateTax(
            taxedAmount,
            item.control.value.billItemId,
            newTaxedAmount
          );
        });
      }
    );
  }

  updateTax(taxedAmount: number, itemId: string, newTaxedAmount: number) {
    const itemsToUpdate = this.tableFormArray.controls.filter(
      (control: Controls) => {
        return (
          (control.value.reservationItemId === itemId ||
            control.value.itemId === itemId) &&
          control.value.taxId
        );
      }
    );

    itemsToUpdate.forEach((itemToUpdate: Controls) => {
      const currentTax = itemToUpdate.value.debitAmount;
      const taxFraction = currentTax / taxedAmount;
      const newTax = this.adminUtilityService.getEpsilonValue(
        newTaxedAmount * taxFraction
      );

      itemToUpdate.patchValue({ debitAmount: newTax });
    });
    this.tableFormArray.updateValueAndValidity();
  }

  addNonBillItem(settings: {
    transactionType: BillItemFields['transactionType'];
    amount: number;
    itemId: string;
    reservationItemId: string;
    value: string;
    entryIdx?: number;
    date?: number;
    type: ChargesType;
    discountType?: string;
    discountValue?: number;
  }) {
    const {
      type,
      amount,
      itemId,
      reservationItemId,
      value,
      transactionType,
      discountType,
      discountValue,
    } = {
      ...settings,
    };

    const entryIdx =
      settings.entryIdx || settings.entryIdx === 0
        ? settings.entryIdx
        : this.tableFormArray.length;

    this.addNewCharges({
      rowIndex: entryIdx,
      isNewEntry: true,
      isDebit: true,
      isDisabled: true,
      date: settings?.date,
    });

    this.addNewDefaultDescription({
      label: value,
      value: value,
    });

    const baseData = this.invoiceService.generateBillItem({
      creditAmount: transactionType === 'CREDIT' ? amount : 0,
      debitAmount: transactionType === 'DEBIT' ? amount : 0,
      billItemId: value,
      description: value,
      isDiscount: type === 'discount',
      isNonEditableBillItem: type === 'refund' || type === 'miscellaneous',
      isMiscellaneous: type === 'miscellaneous',
      itemId,
      reservationItemId,
      transactionType: transactionType,
      date: settings.date ? settings.date : moment(new Date()).unix() * 1000,
    });
    
    // Add discountType and discountValue only when type is 'discount'
    const data: BillItemFields = {
      ...baseData,
      ...settings,
      ...(settings.type === 'discount'
        ? {
            discountType: discountType, // Replace with your actual value
            discountValue: discountValue, // Replace with your actual value
          }
        : {}),
    };

    this.tableFormArray.at(entryIdx).patchValue(data);
  }

  viewDetails() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '100%';
    const detailCompRef = this.modalService.openDialog(
      DetailsComponent,
      dialogConfig
    );

    detailCompRef.componentInstance.bookingId = this.reservationId;
    detailCompRef.componentInstance.tabKey = 'guest_details';
    this.$subscription.add(
      detailCompRef.componentInstance.onDetailsClose.subscribe((res) => {
        detailCompRef.close();
      })
    );
  }

  editReservation() {
    this.routesConfigService.navigate({
      subModuleName: ModuleNames.ADD_RESERVATION,
      additionalPath: `edit-reservation/${this.reservationId}`,
      queryParams: { entityId: this.entityId },
    });
  }

  handleRefund() {
    this.handleAdditionalCharges(AdditionalChargesType.REFUND);
  }

  handleMiscellaneous() {
    this.handleAdditionalCharges(AdditionalChargesType.MISCELLANEOUS);
  }

  handleAdditionalCharges(chargesType: AdditionalChargesType) {
    if (this.isTableInvalid()) return;
    const additionalChargeDetails = additionalChargesDetails[chargesType];

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.width = '40%';
    const discountComponentRef = this.modalService.openDialog(
      // Rename this component to Additional Charge Component
      AddRefundComponent,
      dialogConfig
    );

    /**
     * Need to update this with excess amount and need to add also
     */
    if (chargesType === AdditionalChargesType.REFUND)
      discountComponentRef.componentInstance.maxAmount = -this.inputControl
        .dueAmount.value;
    discountComponentRef.componentInstance.heading = `Add ${additionalChargeDetails.label} Amount`;

    discountComponentRef.componentInstance.onClose.subscribe(
      (res: { refundAmount: number; remarks: string }) => {
        if (res) {
          this.addNonBillItem({
            amount: res.refundAmount,
            itemId: `${additionalChargeDetails.value}-${
              moment(new Date()).unix() * 1000
            }`,
            reservationItemId: `${additionalChargeDetails.value}-${
              moment(new Date()).unix() * 1000
            }`,
            transactionType: additionalChargeDetails.transactionType,
            type: additionalChargeDetails.type,
            value:
              additionalChargesDetails[chargesType].value +
              `${res.remarks ? ` (${res.remarks})` : ''}`,
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
  date?: number;
};

type Controls = Omit<AbstractControl, 'value'> & { value: BillItemFields };
