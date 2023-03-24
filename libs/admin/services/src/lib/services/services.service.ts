import { Injectable } from '@angular/core';
import { LibraryService } from '@hospitality-bot/admin/library';
import { BehaviorSubject } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { TableValue } from '../constant/data-table';
import { ServiceResponse } from '../types/response';
import { ServiceData } from '../types/service';

@Injectable()
export class ServicesService extends LibraryService {
  /**
   * Currently Selected Services table
   * It can either be 'ALL' | 'PAID' | 'COMPLIMENTARY'
   */
  selectedTable = new BehaviorSubject<TableValue>(TableValue.ALL);
}
