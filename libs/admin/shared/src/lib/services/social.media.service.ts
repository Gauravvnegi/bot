import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { extend } from 'lodash';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocialMediaServices extends ApiService {
  getDefaultSocialConfig(): Observable<any> {
    return this.get(`/api/v1/config?key=SOCIAL_MEDIA_CONFIGURATION`);
  }
}
