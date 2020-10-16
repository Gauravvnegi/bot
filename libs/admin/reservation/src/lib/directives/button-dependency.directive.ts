import { Directive, Input, HostListener } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SnackBarService } from 'libs/shared/material/src';

@Directive({ selector: '[button-dependency]' })
export class ButtonDependencyDirective {
  @Input() context;
  @Input() parentForm: FormGroup;
  @Input('data') detailsData;
  @Input() handler;
  @Input() id;

  isDependencySet = false;

  dependencyDS = {
    generateCheckinLink: {
      dependencies: [],
      msgs: [],
    },
    confirmAllDocs: {
      dependencies: [],
      msgs: [],
    },
    acceptPayment: {
      dependencies: [],
      msgs: [],
    },
    downloadInvoice: {
      dependencies: [],
      msgs: [],
    },
    confirmAndNotifyCheckin: {
      dependencies: [],
      msgs: [],
    },
  };

  @HostListener('click', ['$event'])
  clickEvent(event) {
    if (!this.id) {
      console.log('Please provide a id to this button');
      return;
    }

    if (!this.dependencyDS[this.id]) {
      console.log('No dependencies. So no need to use this directive.');
      return;
    }
    let isIndexFound = false;
    let errorIndex = -1;

    let { status } = this.dependencyDS[this.id].dependencies.reduce(
      (acc, curr, index) => {
        let status = acc.status && curr;
        if (!status && !isIndexFound) {
          isIndexFound = true;
          errorIndex = index;
        }
        return { status, errorIndex };
      },
      { status: true, index: -1 }
    );

    if (!status) {
      this._snackBarService.openSnackBarAsText(
        this.dependencyDS[this.id].msgs[errorIndex]
      );
      return;
    }

    if (this.handler && this.handler.fn_name) {
      this.context[this.handler.fn_name].apply(this.context, [
        ...this.handler.args,
      ]);
    }
  }

  constructor(private _snackBarService: SnackBarService) {}

  ngOnChanges() {
    this.setDependecyDS();
  }

  setDependecyDS() {
    this.parentForm.valueChanges.subscribe((data) => {
      this.dependencyDS = {
        generateCheckinLink: {
          dependencies: [],
          msgs: [],
        },
        confirmAllDocs: {
          dependencies: [
            this.parentForm.get('healthCardDetails').get('status').value ==
              'COMPLETED',
          ],
          msgs: ['Please verify health card first'],
        },
        acceptPayment: {
          dependencies: [
            this.parentForm.get('healthCardDetails').get('status').value ==
              'COMPLETED',
            this.parentForm.get('documentStatus').get('status').value ==
              'COMPLETED',
          ],
          msgs: [
            'Please verify health card first',
            'Please verify guests documents',
          ],
        },
        downloadInvoice: {
          dependencies: [...this.dependencyDS['acceptPayment'].dependencies],
          msgs: [
            ...this.dependencyDS['acceptPayment'].msgs,
            'Please accept payment first to download invoice',
          ],
        },
        confirmAndNotifyCheckin: {
          dependencies: [...this.dependencyDS['acceptPayment'].dependencies],
          msgs: [...this.dependencyDS['acceptPayment'].msgs],
        },
        // downloadInvoiceFolio:['after my accpet payment'],
        // confirmAndNtifyCheckin:[accpetpayment]
      };
    });
  }
}
