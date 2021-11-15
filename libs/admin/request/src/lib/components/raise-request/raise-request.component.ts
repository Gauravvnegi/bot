import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { SnackBarService } from 'libs/shared/material/src';
import { DateService } from 'libs/shared/utils/src/lib/date.service';
import { Subscription } from 'rxjs';
import { RequestService } from '../../services/request.service';

@Component({
  selector: 'hospitality-bot-raise-request',
  templateUrl: './raise-request.component.html',
  styleUrls: ['./raise-request.component.scss'],
})
export class RaiseRequestComponent implements OnInit, OnDestroy {
  @Output() onRaiseRequestClose = new EventEmitter();
  requestFG: FormGroup;
  hotelId: string;
  $subscription = new Subscription();
  cmsServices = [];
  priorityList = [
    // { label: 'Low', value: 'LOW' },
    { label: 'Medium', value: 'MEDIUM' },
    { label: 'High', value: 'HIGH' },
    { label: 'ASAP', value: 'ASAP' },
  ];
  constructor(
    private fb: FormBuilder,
    private _globalFilterService: GlobalFilterService,
    private _snackbarService: SnackBarService,
    private _requestService: RequestService
  ) {}

  ngOnInit(): void {
    this.listenForGlobalFilters();
    this.initFG();
  }

  listenForGlobalFilters() {
    this.$subscription.add(
      this._globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.getHotelId([
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ]);
        this.initItemList();
      })
    );
  }

  getHotelId(globalQueries): void {
    //todo

    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  initFG() {
    this.requestFG = this.fb.group({
      roomNo: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      itemName: ['', Validators.required],
      itemCode: ['', Validators.required],
      priority: ['', Validators.required],
      jobDuration: [''],
      remarks: [''],
      quantity: [1],
    });
  }

  initItemList() {
    this.$subscription.add(
      this._requestService.getCMSServices(this.hotelId).subscribe(
        (response) => {
          this.cmsServices = response.cms_services;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
        }
      )
    );
  }

  handleItemNameChange(event) {
    const service = this.cmsServices.filter(
      (d) => d.itemName === event.value
    )[0];
    this.requestFG.get('itemCode').setValue(service.itemCode);
    this.requestFG.get('jobDuration').setValue(parseInt(service.duration));
  }

  raiseRequest() {
    if (this.requestFG.invalid) {
      this._snackbarService.openSnackBarAsText('Please fill all details.');
      this.requestFG.markAllAsTouched();
      return;
    }

    const data = {
      ...this.requestFG.getRawValue(),
      systemDateTime: DateService.currentDate('DD-MMM-YYYY HH:mm:ss'),
      sender: 'KIOSK',
      propertyID: '1',
    };

    this.$subscription.add(
      this._requestService.createRequest(this.hotelId, data).subscribe(
        (response) => {
          this._snackbarService.openSnackBarAsText('Request created.', '', {
            panelClass: 'success',
          });
          this.close(true);
        },
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  close(status = false) {
    this.onRaiseRequestClose.emit(status);
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
