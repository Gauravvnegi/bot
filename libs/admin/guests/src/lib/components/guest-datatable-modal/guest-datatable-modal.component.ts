import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { AdminUtilityService } from 'libs/admin/shared/src/lib/services/admin-utility.service';
import { FeedbackService } from 'libs/admin/shared/src/lib/services/feedback.service';
import { SnackBarService } from 'libs/shared/material/src';
import { ModalService } from 'libs/shared/material/src/lib/services/modal.service';
import { Observable } from 'rxjs';
import { GuestTable } from '../../data-models/guest-table.model';
import { GuestTableService } from '../../services/guest-table.service';
import { GuestDatatableComponent } from '../guest-datatable/guest-datatable.component';

@Component({
  selector: 'hospitality-bot-guest-datatable-modal',
  templateUrl: './guest-datatable-modal.component.html',
  styleUrls: ['./guest-datatable-modal.component.scss']
})
export class GuestDatatableModalComponent extends GuestDatatableComponent implements OnInit {

  @Input() callingMethod:string;
  @Output() onModalClose = new EventEmitter();
  constructor(
    public fb: FormBuilder,
    protected _guestTableService: GuestTableService,
    protected _adminUtilityService: AdminUtilityService,
    protected _globalFilterService: GlobalFilterService,
    protected _snackbarService: SnackBarService,
    protected _modal: ModalService,
    public feedbackService: FeedbackService
  ) {
    super(
      fb,
      _guestTableService,
      _adminUtilityService,
      _globalFilterService,
      _snackbarService,
      _modal,
      feedbackService
    );
  }

  ngOnInit(): void {
    this.registerListeners();
  }

  fetchDataFrom(
    queries,
    defaultProps = { offset: this.first, limit: this.rowsPerPage }
  ): Observable<any> {
    this.resetRowSelection();
    queries.push(defaultProps);
    const config = {
      queryObj: this._adminUtilityService.makeQueryParams(queries),
    };

    return this._guestTableService[this.callingMethod](config);
  }

  closeModal() {
    this.onModalClose.emit(true);
  }

}
