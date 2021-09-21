import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAccordion, MatExpansionPanel } from '@angular/material/expansion';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { HotelService } from 'libs/web-user/shared/src/lib/services/hotel.service';
import { Observable, Subscription } from 'rxjs';
import { DocumentDetailsConfigI } from './../../../../../../shared/src/lib/data-models/documentDetailsConfig.model';
import { DocumentDetailsService } from './../../../../../../shared/src/lib/services/document-details.service';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';
import { GuestRole } from 'libs/web-user/shared/src/lib/constants/guest';

@Component({
  selector: 'hospitality-bot-documents-details',
  templateUrl: './documents-details.component.html',
  styleUrls: ['./documents-details.component.scss'],
})
export class DocumentsDetailsComponent implements OnInit, OnDestroy {
  @Input() parentForm: FormGroup;
  @Input() reservationData;
  @Input() countries;

  @Output()
  addFGEvent = new EventEmitter();

  @ViewChild('accordian') accordion: MatAccordion;
  @ViewChildren('panel')
  panelList: QueryList<MatExpansionPanel>;
  @Output() isUploading = new EventEmitter();

  documentDetailsForm: FormGroup;

  guestDetailsConfig = {};

  primarydocumentDetailsConfig: DocumentDetailsConfigI;
  secondaryDocumentFieldConfig = [];
  validFileType = ['png', 'jpg', 'jpeg'];
  maxFileSize = '3145728';
  $subscription = new Subscription();
  documentUpload = {
    status: false,
    validSize: false,
  };

  constructor(
    protected _fb: FormBuilder,
    public _documentDetailService: DocumentDetailsService,
    protected _reservationService: ReservationService,
    protected _hotelService: HotelService,
    protected _snackBarService: SnackBarService,
    protected _translateService: TranslateService
  ) {
    this.initDocumentDetailForm();
  }

  /**
   * Initialize form
   */
  initDocumentDetailForm() {
    this.documentDetailsForm = this._fb.group({
      guests: this._fb.array([]),
    });
  }

  ngOnChanges() {
    this.getLovs();
  }

  getLovs() {
    this.getCountriesList();
  }

  setIsUploading(event) {
    this.isUploading.next(event);
  }

  getCountriesList() {
    this.$subscription.add(
      this._documentDetailService.getCountryList().subscribe(
        (countriesList) => {
          this.countries = countriesList.map((country) => {
            //@todo change key
            return {
              key: country.nationality,
              value: country.name,
              id: country.id,
              nationality: country.nationality,
            };
          });

          this.setDocumentDetails();
          this.setDocumentDetailConfigs();
        },
        ({ error }) => {
          this._translateService.get(error.code).subscribe((translatedMsg) => {
            this._snackBarService.openSnackBarAsText(translatedMsg);
          });
        }
      )
    );
  }

  setDocumentDetailConfigs() {
    this._documentDetailService.documentDetailDS.guests.forEach(
      (guest, index) => {
        if (guest.isInternational) {
          let getDropDownDocType$ = this.getDropDownDocTypes(
            guest.nationality
          ) as Observable<any>;

          this.$subscription.add(
            getDropDownDocType$.subscribe((response) => {
              this.guestDetailsConfig[guest.id] = this.setFieldConfiguration([
                'nationality',
              ]);

              this.guestDetailsConfig[guest.id]['documents'] = [];

              if (guest.documents.length == response.documentList.length) {
                let documentFA = this.guestsFA
                  .at(index)
                  .get('documents') as FormArray;

                guest.documents.forEach((document) => {
                  documentFA.push(this.getFileFG());

                  this.guestDetailsConfig[guest.id]['documents'].push(
                    this._documentDetailService.setDocumentFileConfig(
                      guest.isPrimary || guest.role === GuestRole.sharer,
                      document.documentType
                    )
                  );
                });
              } else if (
                guest.documents.length &&
                guest.documents.length < response.documentList.length
              ) {
                let documentFA = this.guestsFA
                  .at(index)
                  .get('documents') as FormArray;

                let uploadedDocs = [];

                guest.documents.forEach((document) => {
                  documentFA.push(this.getFileFG());

                  this.guestDetailsConfig[guest.id]['documents'].push(
                    this._documentDetailService.setDocumentFileConfig(
                      guest.isPrimary || guest.role === GuestRole.sharer,
                      document.documentType
                    )
                  );
                  uploadedDocs.push(document.documentType.toUpperCase());
                });

                let documentTypes = response.documentList.filter(
                  (doc) => !uploadedDocs.includes(doc)
                );

                documentTypes.forEach((documentType) => {
                  let documentFA = this.guestsFA
                    .at(index)
                    .get('documents') as FormArray;

                  let documentTypeIndex = documentFA.controls.length;
                  documentFA.push(this.getFileFG());

                  this.guestDetailsConfig[guest.id]['documents'].push(
                    this._documentDetailService.setDocumentFileConfig(
                      guest.isPrimary || guest.role === GuestRole.sharer,
                      documentType
                    )
                  );

                  documentFA
                    .at(documentTypeIndex)
                    .get('documentType')
                    .patchValue(documentType);
                });
              } else {
                let documentTypes = response.documentList.map((doc) =>
                  doc.toUpperCase()
                );

                documentTypes.forEach((documentType, documentTypeIndex) => {
                  let documentFA = this.guestsFA
                    .at(index)
                    .get('documents') as FormArray;
                  documentFA.push(this.getFileFG());

                  this.guestDetailsConfig[guest.id]['documents'].push(
                    this._documentDetailService.setDocumentFileConfig(
                      guest.isPrimary || guest.role === GuestRole.sharer,
                      documentType
                    )
                  );

                  documentFA
                    .at(documentTypeIndex)
                    .get('documentType')
                    .patchValue(documentType);
                });
              }

              this.documentDetailsForm.patchValue(
                this._documentDetailService.documentDetailDS
              );
            })
          );
        } else {
          // call api to fetch options
          let getDropDownDocType$ = this.getDropDownDocTypes(
            guest.nationality
          ) as Observable<any>;

          this.$subscription.add(
            getDropDownDocType$.subscribe(
              (response) => {
                const documentsList = this._documentDetailService.setDocumentsList(
                  response.documentList
                );

                this.guestDetailsConfig[guest.id] = this.setFieldConfiguration(
                  guest.isPrimary || guest.role === GuestRole.sharer
                    ? ['nationality', 'selectedDocumentType']
                    : [],
                  documentsList
                );

                if (guest.documents.length) {
                  let documentFA = this.guestsFA
                    .at(index)
                    .get('documents') as FormArray;
                  documentFA.push(this.getFileFG());

                  this.guestDetailsConfig[guest.id]['documents'] = [
                    this._documentDetailService.setDocumentFileConfig(
                      guest.isPrimary || guest.role === GuestRole.sharer,
                      guest.selectedDocumentType
                    ),
                  ];
                }

                this.documentDetailsForm.patchValue(
                  this._documentDetailService.documentDetailDS
                );
              },
              (error) => {}
            )
          );
        }
      }
    );
  }

  setConfigIfInternational(guestId, config) {
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormArray;

    guestFG.get('isInternational').patchValue(true);

    let documentTypes = config.dropDownDocumentList; //hardcoded
    const guest = this._documentDetailService.documentDetailDS.guests.filter(
      (guest) => guest.id === guestId
    )[0];
    documentTypes.forEach((documentType, index) => {
      let documentFA = guestFG.get('documents') as FormArray;
      documentFA.push(this.getFileFG());

      this.guestDetailsConfig[guestId]['documents'].push(
        this._documentDetailService.setDocumentFileConfig(
          guest.isPrimary || guest.role === GuestRole.sharer,
          documentType
        )
      );

      documentFA.at(index).get('documentType').patchValue(documentType);
    });
  }

  setConfigIfNotInternational(guestId, config?) {
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormArray;
    const guest = this._documentDetailService.documentDetailDS.guests.filter(
      (guest) => guest.id === guestId
    )[0];

    let documentFA = guestFG.get('documents') as FormArray;
    documentFA.push(this.getFileFG());

    this.guestDetailsConfig[guestId]['documents'].push(
      this._documentDetailService.setDocumentFileConfig(
        guest.isPrimary || guest.role === GuestRole.sharer,
        config.selectedDocumentType
      )
    );

    documentFA
      .at(0)
      .get('documentType')
      .patchValue(config.selectedDocumentType);
  }

  resetDocumentsIfNationalityChanges(guestId, config?) {
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormArray;

    (guestFG.get('documents') as FormArray).clear();

    this.guestDetailsConfig[guestId].documents = [];
  }

  resetIfNationalityChanges(guestId) {
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormArray;

    guestFG.get('isInternational').patchValue(false);
    guestFG.get('selectedDocumentType').reset();
    (guestFG.get('documents') as FormArray).clear();
  }

  resetIfInternationalGuest(guestId, config?) {
    this.resetIfNationalityChanges(guestId);
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormGroup;
    guestFG.get('uploadStatus').patchValue(false);
    this.guestDetailsConfig[guestId].documents = [];
    this.guestDetailsConfig[guestId].selectedDocumentType = {
      ...this.guestDetailsConfig[guestId].selectedDocumentType,
      disable: true,
      options: [],
      required: false,
    };
  }

  resetIfNotInternationalGuest(guestId, config?) {
    this.resetIfNationalityChanges(guestId);
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormGroup;
    const guest = this._documentDetailService.documentDetailDS.guests.filter(
      (guest) => guest.id === guestId
    )[0];
    guestFG.get('uploadStatus').patchValue(false);
    this.guestDetailsConfig[guestId].documents = [];
    this.guestDetailsConfig[guestId].selectedDocumentType = {
      ...this.guestDetailsConfig[guestId].selectedDocumentType,
      disable: false,
      options: this._documentDetailService.setDocumentsList(
        config.dropDownDocumentList
      ),
      required: guest.isPrimary || guest.role === GuestRole.sharer,
    };
  }

  ngOnInit(): void {}

  getDocumentFG(): FormGroup {
    return this._fb.group({
      id: ['', [Validators.required]],
      nationality: ['', [Validators.required]],
      selectedDocumentType: [''],
      isPrimary: ['', [Validators.required]],
      isInternational: ['', Validators.required],
      documents: this._fb.array([]),
      label: [''],
      role: [''],
      Optional: [false],
      uploadStatus: [false],
    });
  }

  setDocumentDetails() {
    if (this.reservationData) {
      this._documentDetailService.documentDetailDS.guests.forEach((guest) => {
        guest.role === GuestRole.kids || guest.role === GuestRole.accompany
          ? this.addOptionalGuestFG()
          : this.addGuestFG();
      });

      this.addFGEvent.next({
        name: 'documentDetail',
        value: this.documentDetailsForm,
      });

      this.documentDetailsForm.patchValue(
        this._documentDetailService.documentDetailDS
      );
    }
  }

  addGuestFG() {
    this.guestsFA.push(this.getDocumentFG());
  }

  addOptionalGuestFG() {
    this.guestsFA.push(
      this._fb.group({
        id: [''],
        nationality: [''],
        selectedDocumentType: [''],
        isPrimary: [''],
        isInternational: [''],
        documents: this._fb.array([]),
        label: [''],
        role: [''],
        Optional: [true],
        uploadStatus: [false],
      })
    );
  }

  setFieldConfiguration(
    isInternational,
    dropDownDocumentList?,
    documentsArray?
  ) {
    return this._documentDetailService.setFieldConfigForDocumentDetails(
      isInternational,
      this.countries,
      dropDownDocumentList,
      documentsArray
    );
  }

  getDropDownDocTypes(nationalityKey) {
    return this._documentDetailService.getDocumentsByNationality(
      this._hotelService.hotelId,
      nationalityKey
    );
  }

  getFileFG(): FormGroup {
    return this._fb.group({
      documentFileFront: [' ', []],
      documentFileBack: [' ', []],
      documentType: [, [Validators.required]],
    });
  }

  saveDocument(event, { guestId, doc_page, doc_type, doc_issue_place }) {
    if (event.status) {
      this.updateDocumentUploadingStatus(guestId, doc_page, doc_type, true);
      let formData = new FormData();
      formData.append('file', event.file);
      formData.append('doc_type', doc_type);
      formData.append('doc_page', doc_page);
      formData.append('doc_issue_place', doc_issue_place);
      this.setIsUploading({ value: true });
      this.$subscription.add(
        this._documentDetailService
          .uploadDocumentFile(
            this._reservationService.reservationId,
            guestId,
            formData
          )
          .subscribe(
            (response) => {
              this.setIsUploading({ value: false });
              let value = event.formGroup;
              this.updateDocumentFG(
                guestId,
                doc_type,
                doc_page,
                response.fileDownloadUrl
              );
              this.updateDocumentUploadingStatus(
                guestId,
                doc_page,
                doc_type,
                false
              );

              this.updateUploadStatus(guestId, true);
              this._translateService
                .get('MESSAGES.SUCCESS.DOCUMENT_UPLOAD_COMPLETE')
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg, '', {
                    panelClass: 'success',
                  });
                });
            },
            ({ error }) => {
              this.updateDocumentFG(guestId, doc_type, doc_page, '');
              this.updateDocumentUploadingStatus(
                guestId,
                doc_page,
                doc_type,
                false
              );
              this._translateService
                .get(`MESSAGES.ERROR.${error.type}`)
                .subscribe((translatedMsg) => {
                  this._snackBarService.openSnackBarAsText(translatedMsg);
                });
            }
          )
      );
    } else {
      this.updateUploadStatus(guestId, false);
      this.updateDocumentFG(guestId, doc_type, doc_page, '');
      this._translateService
        .get('VALIDATION.INVALID_IMAGE')
        .subscribe((translatedMsg) => {
          this._snackBarService.openSnackBarAsText(translatedMsg);
        });
    }
  }

  updateUploadStatus(guestId, status) {
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormGroup;
    if (status) {
      let documents = guestFG.getRawValue().documents;
      for (let i = 0; i < documents.length; i++) {
        if (
          documents[i].documentType === 'VISA' &&
          documents[i].documentFileFront === ' '
        ) {
          guestFG.get('uploadStatus').patchValue(!status);
          break;
        } else if (
          (documents[i].documentFileFront === ' ' ||
            documents[i].documentFileBack === ' ') &&
          documents[i].documentType !== 'VISA'
        ) {
          guestFG.get('uploadStatus').patchValue(!status);
          break;
        } else if (i === documents.length - 1) {
          guestFG.get('uploadStatus').patchValue(status);
        }
      }
    } else {
      guestFG.get('uploadStatus').patchValue(status);
    }
  }

  updateDocumentUploadingStatus(guestId, doc_page, doc_type, isUploading) {
    let documentIndex;
    documentIndex = this.guestDetailsConfig[guestId].documents.findIndex(
      (doc) => doc.documentFileFront.label.split(' ')[0] == doc_type
    );
    if (documentIndex >= 0) {
      Object.keys(
        this.guestDetailsConfig[guestId].documents[documentIndex]
      ).forEach((key) => {
        if (
          this.guestDetailsConfig[guestId].documents[documentIndex][key]
            .type === doc_page
        ) {
          this.guestDetailsConfig[guestId].documents[documentIndex][
            key
          ].isUploading = isUploading;
        }
      });
    }
  }

  updateDocumentFG(guestId, doc_type, doc_page, data) {
    let guestFG = this.guestsFA.at(
      this.guestsFA.controls.findIndex(
        (guestFG: FormGroup) => guestFG.get('id').value == guestId
      )
    ) as FormGroup;

    let documentFG = (guestFG.get('documents') as FormArray).at(
      guestFG
        .get('documents')
        ['controls'].findIndex(
          (documentFG: FormGroup) =>
            documentFG.get('documentType').value == doc_type
        )
    ) as FormGroup;

    documentFG
      .get(doc_page == 'front' ? 'documentFileFront' : 'documentFileBack')
      .patchValue(data);
  }

  onNationalityChange(event, guestId) {
    this.$subscription.add(
      this._documentDetailService
        .getDocumentsByNationality(
          this._hotelService.hotelId,
          event.selectEvent.value
        )
        .subscribe(({ documentList, verifyAllDocuments }) => {
          if (verifyAllDocuments) {
            this.resetIfInternationalGuest(guestId);
            this.setConfigIfInternational(guestId, {
              dropDownDocumentList: documentList,
            });
          } else {
            this.resetIfNotInternationalGuest(guestId, {
              dropDownDocumentList: documentList,
            });
          }
        })
    );
  }

  onSelectedDocumentTypeChange(event, guestId) {
    this.resetDocumentsIfNationalityChanges(guestId);
    this.setConfigIfNotInternational(guestId, {
      selectedDocumentType: event.selectEvent.value,
    });
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }

  get guestsFA(): FormArray {
    return this.documentDetailsForm.get('guests') as FormArray;
  }

  get primaryDocumentsFG(): FormGroup {
    return this.documentDetailsForm.get('primaryGuest') as FormGroup;
  }
}
