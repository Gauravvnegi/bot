import { Injectable } from '@angular/core';
import { LibraryService } from '@hospitality-bot/admin/library';
import { Observable } from 'rxjs/internal/Observable';
import { PackageFormData } from '../types/package';
import { PackageResponse } from '../types/response';

@Injectable()
export class PackagesService extends LibraryService {
  /*refactor*/
  updatePackage(
    entityId: string,
    serviceId: string,
    data: Partial<PackageFormData>
  ): Observable<PackageResponse> {
    // *refactor* api may not be correct
    return this.patch(`/api/v1/library/${serviceId}?libraryType=PACKAGE`, {
      id: serviceId,
      ...data,
    });
  }
}
