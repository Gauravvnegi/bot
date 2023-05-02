import { Injectable } from '@angular/core';
import { LibraryService } from '@hospitality-bot/admin/library';

@Injectable({
  providedIn: 'root'
})
export class BookingSourceService extends LibraryService {}
