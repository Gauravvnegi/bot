import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { NavRouteOptions, Option } from '@hospitality-bot/admin/shared';
import { manageReservationRoutes } from '../../constants/routes';
import { InvoiceForm } from '../../types/forms.types';
import { cols } from '../../constants/payment';
import { PaymentField } from '../../types/forms.types';

@Component({
  selector: 'hospitality-bot-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  pageTitle: string;
  navRoutes: NavRouteOptions;
  tableFormArray: FormArray;
  useForm: FormGroup;

  taxes: Option[] = [];
  tableValue = [];

  /**Table Variable */
  selectedRows;
  cols = cols;

  constructor(private fb: FormBuilder) {
    this.initPageHeaders();
  }

  get inputControl() {
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
    const { title, navRoutes } = manageReservationRoutes['invoice'];
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
    });

    this.tableFormArray = this.useForm.get('tableData') as FormArray;
    this.addNewFieldTableForm();

    this.initDetails();

    this.useForm.valueChanges.subscribe((res) => {
      console.log(res);
    });
  }

  initDetails() {
    this.tableValue = [{ id: 1 }];
    this.useForm.patchValue({
      tableData: [
        {
          description: 'Room',
          unit: 1,
          unitPrice: 400,
          tax: ['CGST'],
          totalAmount: 442,
        },
      ],
    });
  }

  initOptionsConfig() {
    this.taxes = [
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
  }

  /**
   * To add new charged
   */
  addNewCharges() {
    this.addNewFieldTableForm();
    this.tableValue.push({ id: this.tableValue.length + 1 });
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
