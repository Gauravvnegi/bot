import { Component } from '@angular/core';
import { DatatableComponent } from 'libs/admin/shared/src/lib/components/datatable/datatable.component';
import { SpecialAmenitiesService } from '../../services/special-amenities.service';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { Router } from '@angular/router';
import { PackageDetail } from '../../data-models/packageConfig.model';

@Component({
  selector: 'hospitality-bot-package-datatable',
  templateUrl: './package-datatable.component.html',
  styleUrls: ['./package-datatable.component.scss']
})
export class PackageDatatableComponent extends DatatableComponent {

  type: any[];
  statuses: any[];
  packages: PackageDetail[];
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
    private _snackbarService: SnackBarService,
    private _router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.cols = this.amenityCols;
    this.type = [
      {label: 'Complimentary', value: '0'},
      {label: 'Paid', value: '1'},
    ];
    this.statuses = [
      {label: 'Active', value: 'true'},
      {label: 'InActive', value: 'false'}
    ];
  }

  loadInitialData(){
    this._amenitiesService.getAmenityPackages('ca60640a-9620-4f60-9195-70cc18304edd',0,10)
    .subscribe(response =>{
      this.values = response;
      this.dataSource = response;
      this.totalRecords = this.dataSource.length;
      this.mapPackageDetails(response);
    },(error)=>{
      this._snackbarService.openSnackBarAsText('some error occured');
    })
  }

  mapPackageDetails(packages){
    this.packages = new Array<PackageDetail>();
    packages.forEach(amenityPackage =>{
      this.packages.push(new PackageDetail().deserialize(amenityPackage))
    })
    console.log('dfjhsgf',this.packages);
  }
  
  onRowSelect(event){
    this._router.navigate(['/pages/package/amenity',event.id]);
  }

}
