import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import { ChannelManagerService as CommonChannelManagerService } from 'libs/admin/channel-manager/src/lib/services/channel-manager.service';
import { Observable } from 'rxjs';
import { ConfigResponse } from '../types/rates.type';

@Injectable()
export class ChannelManagerService extends CommonChannelManagerService {
  getConfigType(queryParam: Params): Observable<ConfigResponse> {
    const param = this.makeQueryParams([queryParam]);
    return this.get(`/api/v1/configurations/channel-manager${param}`);
  }
}
