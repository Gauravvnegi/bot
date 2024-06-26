import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AdminSharedModule } from '@hospitality-bot/admin/shared';
import { CategoryComponent } from './components/category/category.component';
import { LibraryService } from './services/library.service';

/**
 * Need to refactor this module
 */
@NgModule({
  imports: [CommonModule, AdminSharedModule],
  declarations: [CategoryComponent],
  exports: [CategoryComponent],
  providers: [LibraryService],
})
export class AdminLibraryModule {}
