import { EventEmitter, Injector } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { SocialPlatForms } from '../types/brand.type';
import { Observable } from 'rxjs';

export class SocialMediaService extends ApiService {
  onSubmit = new EventEmitter<boolean>(false);
  /**
   * @function getSocialMediaConfig
   * @description get social media config
   * @returns
   */
  getSocialMediaConfig(): Observable<SocialPlatForms[]> {
    return this.get(`/api/v1/config?key=SOCIAL_MEDIA_CONFIGURATION`);
  }
}
