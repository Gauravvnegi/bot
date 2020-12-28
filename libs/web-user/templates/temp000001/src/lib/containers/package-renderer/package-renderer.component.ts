import { AfterViewInit, ChangeDetectorRef, Component, ComponentFactoryResolver, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SubPackageDetailsConfigI } from 'libs/web-user/shared/src/lib/data-models/paidServiceConfig.model';
import { ReservationService } from 'libs/web-user/shared/src/lib/services/booking.service';
import { ButtonService } from 'libs/web-user/shared/src/lib/services/button.service';
import { PaidService } from 'libs/web-user/shared/src/lib/services/paid.service';
import { Subscription } from 'rxjs';
import { AirportFacilitiesComponent } from '../packages/airport-facilities/airport-facilities.component';
import { DefaultAmenityComponent } from '../packages/default-amenity/default-amenity.component';
import { SnackBarService } from 'libs/shared/material/src';
import { TranslateService } from '@ngx-translate/core';

const componentMapping = {
  'AIRPORT P/UP': AirportFacilitiesComponent,
  'AIRPORT DROP': AirportFacilitiesComponent,
};

@Component({
  selector: 'hospitality-bot-package-renderer',
  templateUrl: './package-renderer.component.html',
  styleUrls: ['./package-renderer.component.scss'],
})
export class PackageRendererComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() parentForm: FormGroup;
  @Input() slideData;
  @Output() onPackageUpdate = new EventEmitter();

  @ViewChild('packageMetadata', { read: ViewContainerRef }) packageContainer;
  @ViewChild('saveButton') saveButton;

  private $subscription: Subscription = new Subscription();

  subPackageFieldConfig: SubPackageDetailsConfigI[] = [];
  selectedSubPackageArray = [];
  selectedService = '';
  packageComponentRefObj;

  constructor(
    public dialog: MatDialog,
    private _changeDetectorRef: ChangeDetectorRef,
    private _paidService: PaidService,
    private _reservationService: ReservationService,
    private _resolver: ComponentFactoryResolver,
    private _buttonService: ButtonService,
    private _snackBarService: SnackBarService,
    private _translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.listenForComponentRender();
    this.setSubPackageConfiguration();
    this.selectedSubPackageArray = [];
  }

  ngAfterViewInit() {
    this.clearPackageContainer();
    if (this.packageContainer) {
      this.checkForSelectedPackage();
      this._changeDetectorRef.detectChanges();
    }
  }

  setSubPackageConfiguration() {
    this.subPackages.controls.forEach(() => {
      this.subPackageFieldConfig.push(this.setFieldConfiguration());
    });
  }

  setFieldConfiguration() {
    return this._paidService.setFieldConfigForSubPackageDetails();
  }

  checkForSelectedPackage() {
    this.subPackages.controls.forEach((subPackage) => {
      if (subPackage.get('isSelected').value === true) {
        this.servicePackage(subPackage.get('packageCode').value);
      }
    });
  }

  servicePackage(subPackageCode) {
    this.selectedService = subPackageCode;
    let component = componentMapping[subPackageCode];
    if (component === undefined) {
      component = DefaultAmenityComponent;
    }
    let subPackage;
    this.subPackages.controls.forEach((control) => {
      if (control.get('packageCode').value === subPackageCode) {
        subPackage = control.value;
      }
    });
    this.createComponent(component, subPackage);
  }

  createComponent(component, subPackageData) {
    const factory = this._resolver.resolveComponentFactory(component);
    this.packageComponentRefObj = this.packageContainer.createComponent(
      factory
    );
    this.selectedSubPackageArray.push(subPackageData.packageCode);
    this.addPropsToComponentInstance(subPackageData);
  }

  addPropsToComponentInstance(subPackageData) {
    this.packageComponentRefObj.instance.subPackageForm = this.getSubPackageForm(
      subPackageData.packageCode
    );
    this.packageComponentRefObj.instance.uniqueData = {
      code: subPackageData.packageCode,
      id: subPackageData.id,
    };
    this.packageComponentRefObj.instance.amenityData = this.getAminityData(
      subPackageData.packageCode
    );
    this.packageComponentRefObj.instance.quantity = subPackageData.quantity;
  }

  getSubPackageForm(packageCode) {
    let subPackageForm;
    this.subPackages.controls.forEach((subPackage) => {
      if (subPackage.get('packageCode').value === packageCode) {
        subPackageForm = subPackage;
      }
    });
    return subPackageForm;
  }

  getAminityData(packageCode) {
    let aminityData;
    this.slideData.subPackages.forEach((subPackage) => {
      if (subPackage.packageCode === packageCode) {
        aminityData = subPackage.metaData;
      }
    });
    return aminityData;
  }

  clearPackageContainer() {
    if (this.packageContainer) {
      this.packageContainer.clear();
    }
  }

  onSubPackageStatusChange(data) {
    if (data.currentValue) {
      this.servicePackage(data.formGroup.get('packageCode').value);
    } else {
      this.removeComponentFromContainer(
        data.formGroup.get('packageCode').value
      );
    }
  }

  removeComponentFromContainer(packageCode) {
    let componentIndex = this.selectedSubPackageArray.findIndex(
      (code) => code === packageCode
    );
    if (componentIndex >= 0) {
      this.packageContainer.remove(componentIndex);
      this.selectedSubPackageArray.splice(componentIndex, 1);
    }
  }

  listenForComponentRender() {
    this.$subscription.add(
      this._paidService.isComponentRendered$.subscribe(() => {
        this.getSubPackageForm(this._paidService.uniqueData.code).addControl(
          'metaData',
          this._paidService.amenityForm
        );
      })
    );
  }

  onSaveSubPackages() {
    const status = this._paidService.validatePackageForm(
      this.parentForm
    ) as Array<any>;

    if (status.length) {
      this.performActionIfNotValid(status);
      this._buttonService.buttonLoading$.next(this.saveButton);
      return;
    }

    let packagesToBeAdd = [];
    let packagesToBeRemove = [];
    this.subPackages.controls.forEach((subPackage) => {
      if (subPackage.get('isSelected').value === true) {
        packagesToBeAdd.push(
          this._paidService.mapDataForAminityAddition(subPackage.value)
        );
      } else {
        packagesToBeRemove.push(
          this._paidService.mapDataForAmenityRemoval(subPackage.get('id').value)
        );
      }
    });
    this.updateAmenity({
      packagesToBeAdd: packagesToBeAdd,
      packagesToBeRemove: packagesToBeRemove,
    });
  }

  updateAmenity(data) {
    this.$subscription.add(
      this._paidService
        .updateAmenity(this._reservationService.reservationId, data)
        .subscribe(
          (response) => {
            this._paidService.updateAmenitiesDS(response);
            this._paidService.updateDSForRemovedAmenity(
              data.packagesToBeRemove
            );
            this.resetSubPackageForm(data.packagesToBeRemove);
            this.selectedSubPackageArray = [];
            this.selectedService = '';
            this.onPackageUpdate.emit(true);
            this._translateService
              .get('MESSAGES.SUCCESS.AMENITY_UPDATE_COMPLETE')
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(
                  translatedMsg,
                  '',
                  { panelClass: 'success' }
                );
              });
            this._buttonService.buttonLoading$.next(this.saveButton);
          },
          (error) => {
            this._translateService
              .get(`MESSAGES.ERROR.${error.type}`)
              .subscribe((translatedMsg) => {
                this._snackBarService.openSnackBarAsText(translatedMsg);
              });
            this._buttonService.buttonLoading$.next(this.saveButton);
          }
        )
    );
  }

  resetSubPackageForm(packagesToBeRemove) {
    packagesToBeRemove.forEach((removedPackage) => {
      this.subPackages.controls.forEach((subPackageForm) => {
        if (removedPackage.packageId === subPackageForm.get('id').value) {
          if (subPackageForm.get('metaData')) {
            subPackageForm.get('metaData').reset();
          }
        }
      });
    });
  }

  private performActionIfNotValid(status: any[]) {
    this._translateService
      .get(`VALIDATION.${status[0].code}`)
      .subscribe((translatedMsg) => {
        this._snackBarService.openSnackBarAsText(translatedMsg);
      });
    return;
  }

  ngOnDestroy() {
    if (this.packageComponentRefObj) {
      this.packageComponentRefObj.destroy();
    }
    this.$subscription.unsubscribe();
  }

  get paidAmenities() {
    return (
      this._paidService.paidAmenities &&
      this._paidService.paidAmenities.paidService
    );
  }

  get subPackages(): FormArray {
    return this.parentForm.get('subPackages') as FormArray;
  }

  get checkForUpdatePossibility() {
    let isUpdatePossible = false;
    this.slideData.subPackages.forEach((subPackage) => {
      if (subPackage.isSelected === true) {
        isUpdatePossible = true;
      }
    });

    this.subPackages.controls.forEach((subPackage) => {
      if (subPackage.get('isSelected').value === true) {
        isUpdatePossible = true;
      }
    });
    return isUpdatePossible;
  }
}
