import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { ListingDatatableComponent } from './components/datatable/listing-datatable/listing-datatable.component';
import { EditContactComponent } from './components/edit-contact/edit-contact.component';
import { ImportContactComponent } from './components/import-contact/import-contact.component';
import { ListingComponent } from './components/listing/listing.component';
import { ContactDatatableComponent } from './components/datatable/contact-datatable/contact-datatable.component';
import { EditListingComponent } from './components/edit-listing/edit-listing.component';
import { listingRoutes } from './constants/routes';

const appRoutes: Route[] = [
  {
    path: listingRoutes.listing.route,
    component: ListingComponent,
  },
  {
    path: listingRoutes.createListing.route,
    component: EditListingComponent,
  },
  {
    path: listingRoutes.editListing.route,
    component: EditListingComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(appRoutes)],
  exports: [RouterModule],
})
export class AdminListingRoutingModule {
  static components = [
    ListingComponent,
    EditListingComponent,
    EditContactComponent,
    ListingDatatableComponent,
    ImportContactComponent,
    ContactDatatableComponent,
  ];
}
