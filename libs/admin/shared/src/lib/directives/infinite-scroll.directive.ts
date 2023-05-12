import { Directive } from '@angular/core';
import { ScrollPagination } from 'apps/admin/src/app/core/theme/src/lib/directives/scroll-pagination.directive';

@Directive({ selector: '[infiniteScroll]' })
export class InfiniteScroll extends ScrollPagination {}
