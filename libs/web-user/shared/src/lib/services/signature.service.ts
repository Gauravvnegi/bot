import { Injectable } from '@angular/core';
import { ApiService } from 'libs/shared/utils/src/lib/services/api.service';
import { Observable } from 'rxjs';
import { FileData } from '../data-models/file';

@Injectable()
export class SignatureService extends ApiService {
  convertTextToImage(data): Observable<FileData> {
    return this.post(`/api/v1/utilities/text-to-image-converter`, data);
  }
}
