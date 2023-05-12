import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { AdminLibraryRoutingModule } from './admin-library.routing.module';
import { CategoryComponent } from './components/category/category.component';
import { LibraryService } from './services/library.service';

@NgModule({
  imports: [CommonModule, AdminLibraryRoutingModule, AdminSharedModule],
  declarations: [...AdminLibraryRoutingModule.components, CategoryComponent],
  exports: [CategoryComponent],
  providers: [LibraryService],
})
export class AdminLibraryModule {}
