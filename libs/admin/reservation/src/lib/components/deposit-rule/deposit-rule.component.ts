import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-deposit-rule',
  templateUrl: './deposit-rule.component.html',
  styleUrls: ['./deposit-rule.component.scss'],
})
export class DepositRuleComponent implements OnInit, OnDestroy {
  @Input('data') detailsData;
  @Input() parentForm;

  depositRuleForm: FormGroup;

  guaranteeTypes = [
    {
      label: 'Guarantee',
      value: 'GUARANTEE',
    },
    {
      label: 'Deposit',
      value: 'DEPOSIT',
    },
    {
      label: 'Pre Payment',
      value: 'PREPAYMENT',
    },
  ];

  amountTypes = [
    {
      label: 'Flat',
      value: 'FLAT',
    },
    {
      label: 'Percent',
      value: 'PERCENT',
    },
  ];

  $subscription = new Subscription();

  constructor(private _fb: FormBuilder) {}

  ngOnInit(): void {
    this.initDepositRuleForm();
    this.registerListeners();
    this.pushDataToForm();
  }

  pushDataToForm() {
    this.depositRuleForm.patchValue(
      this.detailsData.paymentDetails.depositRules
    );
  }

  registerListeners() {
    this.listenForAmountType();
    this.listenForAmountChanges();
  }

  listenForAmountType() {
    this.$subscription.add(
      this.depositRuleForm.get('amountType').valueChanges.subscribe((type) => {
        const amount = this.depositRuleForm.get('amount').value;
        if (type == 'FLAT') {
          this.depositRuleForm.get('amountPayable').setValue(+amount);
        } else if (type == 'PERCENT') {
          this.depositRuleForm
            .get('amountPayable')
            .setValue(
              (amount * this.detailsData.paymentDetails.totalAmount) / 100
            );
        }
      })
    );
  }

  listenForAmountChanges() {
    this.$subscription.add(
      this.depositRuleForm.get('amount').valueChanges.subscribe((amount) => {
        const amountType = this.depositRuleForm.get('amountType').value;
        if (amountType == 'FLAT') {
          this.depositRuleForm.get('amountPayable').setValue(+amount);
        } else if (amountType == 'PERCENT') {
          this.depositRuleForm
            .get('amountPayable')
            .setValue(
              (amount * this.detailsData.paymentDetails.totalAmount) / 100
            );
        }
      })
    );

    //this.detailsData.paymentDetails.totalAmount
  }

  initDepositRuleForm() {
    this.depositRuleForm = this._fb.group({
      guaranteeType: ['', Validators.required],
      amountType: ['', Validators.required],
      amount: [''],
      amountPayable: [0],
    });

    this.payementDetailsFG.addControl(
      'depositRuleDetails',
      this.depositRuleForm
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get payementDetailsFG() {
    return this.parentForm.get('paymentDetails') as FormGroup;
  }
}
