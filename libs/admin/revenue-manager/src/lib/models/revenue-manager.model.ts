import {
  RoomListResponse,
  RoomTypeListResponse,
  RoomTypeResponse,
} from 'libs/admin/room/src/lib/types/service-response';
import { RoomType } from '../types/revenue-manager.types';

export class RoomTypeList {
  records: RoomType[];
  deserialize(res: RoomTypeListResponse) {
    this.records = res.roomTypes.map((room) => ({
      label: room.name,
      value: room.id,
      price: room.pricingDetails.base,
    }));
    return this;
  }
}
