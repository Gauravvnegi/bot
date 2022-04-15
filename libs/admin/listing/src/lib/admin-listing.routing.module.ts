import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CreateContactComponent } from './components/create-contact/create-contact.component';
import { CreateListingComponent } from './components/create-listing/create-listing.component';
import { ListingDatatableComponent } from './components/datatable/listing-datatable/listing-datatable.component';
import { EditContactComponent } from './components/edit-contact/edit-contact.component';
import { EditListingComponent } from './components/edit-listing/edit-listing.component';
import { ImportContactComponent } from './components/import-contact/import-contact.component';
import { ListingComponent } from './components/listing/listing.component';
import { ContactDatatableComponent } from './components/datatable/contact-datatable/contact-datatable.component';

const appRoutes: Route[] = [
  { path: '', component: ListingComponent },
  {
    path: 'create',
    component: CreateListingComponent,
  },
  {
    path: 'edit/:id',
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
    CreateContactComponent,
    CreateListingComponent,
    EditListingComponent,
    EditContactComponent,
    ListingDatatableComponent,
    ImportContactComponent,
    ContactDatatableComponent,
  ];
}
