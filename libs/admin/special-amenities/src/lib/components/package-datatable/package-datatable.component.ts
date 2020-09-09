import { Component, OnInit } from '@angular/core';
import { DatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/datatable.component';
import { SpecialAmenitiesService } from '../../services/special-amenities.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';

@Component({
  selector: 'hospitality-bot-package-datatable',
  templateUrl: './package-datatable.component.html',
  styleUrls: ['./package-datatable.component.scss']
})
export class PackageDatatableComponent extends DatatableComponent {

  type: any[];
  cities: any[];
  amenityCols = [
    { field: 'imgUrl', header: 'Package Image' },
    { field: 'amenityName', header: 'Package Name' },
    { field: 'amenityDescription', header: 'Description' },
    { field: 'type', header: 'Type' },
    { field: 'rate', header: 'Amount' },
    { field: 'active', header: 'Status' },
    { field: 'packageCode', header: 'Package Code' }
  ];

  constructor(
    private _amenitiesService: SpecialAmenitiesService,
    private _snackbarService: SnackBarService
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.cols = this.amenityCols;
    this.type = [
      {label: 'Paid', value: 0},
      {label: 'Complimentary', value: 1},
    ];
    this.cities = [
      {name: 'New York', code: 'NY'},
      {name: 'Rome', code: 'RM'},
      {name: 'London', code: 'LDN'},
      {name: 'Istanbul', code: 'IST'},
      {name: 'Paris', code: 'PRS'}
  ];
  }

  loadInitialData(){
    this._amenitiesService.getAmenityPackages('ca60640a-9620-4f60-9195-70cc18304edd',0,10)
    .subscribe(response =>{
      this.values = response;
      this.dataSource = response;
      this.totalRecords = this.dataSource.length;
    },(error)=>{
      this._snackbarService.openSnackBarAsText('some error occured');
    })
  }

}
