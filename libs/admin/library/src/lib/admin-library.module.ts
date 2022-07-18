import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminLibraryRoutingModule } from './admin-library.routing.module';

@NgModule({
  imports: [CommonModule, AdminLibraryRoutingModule],
  declarations: [...AdminLibraryRoutingModule.components],
})
export class AdminLibraryModule {}
