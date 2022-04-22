import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalFilterService } from '@hospitality-bot/admin/core/theme';
import { AdminUtilityService } from '@hospitality-bot/admin/shared';
import { ModalService, SnackBarService } from '@hospitality-bot/shared/material';
import { EditContactComponent } from 'libs/admin/listing/src/lib/components/edit-contact/edit-contact.component';
import { ImportContactComponent } from 'libs/admin/listing/src/lib/components/import-contact/import-contact.component';
import { Subscription } from 'rxjs';
import { Topics } from '../../data-models/template.model';
import { TemplateService } from '../../services/template.service';

@Component({
  selector: 'hospitality-bot-edit-template',
  templateUrl: './edit-template.component.html',
  styleUrls: ['./edit-template.component.scss']
})
export class EditTemplateComponent implements OnInit , OnDestroy {
  listFG: FormGroup;
  private $subscription = new Subscription();
  hotelId: string;
  globalQueries = [];
  topicList = [];
  isSaving = false;
  constructor(
    private _fb: FormBuilder,
    private globalFilterService: GlobalFilterService,
    private _modal: ModalService,
    private _snackbarService: SnackBarService,
    private _router: Router,
    private adminUtilityService: AdminUtilityService,
    private templateService :TemplateService
  ) {
    this.initFG();
  }

  ngOnInit(): void {
    this.listenForGlobalFilters();
  }

  initFG(): void {
    this.listFG = this._fb.group({
      name: ['', [Validators.required]],
      topicName: ['', [Validators.required]],
      description: [''],
      marketingContacts: [[]],
      active: [true],
    });
  }

  listenForGlobalFilters(): void {
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];
        this.getHotelId(this.globalQueries);
        this.getTopicList(this.hotelId);
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) this.hotelId = element.hotelId;
    });
  }

  getTopicList(hotelId) {
    const config = {
      queryObj: this.adminUtilityService.makeQueryParams([
        { entityState: 'ACTIVE', limit: 50 },
      ]),
    };
    this.$subscription.add(
      this.templateService.getTopicList(hotelId, config).subscribe(
        (response) =>
          (this.topicList = new Topics().deserialize(response).records),
        ({ error }) => this._snackbarService.openSnackBarAsText(error.message)
      )
    );
  }

  openImportContact(event) {
    event.stopPropagation();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.width = '550';
    const importCompRef = this._modal.openDialog(
      ImportContactComponent,
      dialogConfig
    );

    importCompRef.componentInstance.hotelId = this.hotelId;
    importCompRef.componentInstance.onImportClosed.subscribe((response) => {
      if (response.status) {
        this.listFG.patchValue({ marketingContacts: response.data });
      }
      importCompRef.close();
    });
  }

   createList() {
  }

  updateContactList(event) {
    if (event.add) {
      this.listFG.patchValue({ marketingContacts: event.data });
    }
  }

  goBack(){

  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
