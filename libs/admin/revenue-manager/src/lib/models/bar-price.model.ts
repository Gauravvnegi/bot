import { RoomType } from 'libs/admin/room/src/lib/models/rooms-data-table.model';

export function makeRoomsData(rooms: RoomType[]) {
  let res = rooms.map((item) => {
    let room = {
      label: item.name,
      value: item.id,
      channels: [],
      price: item.price,
      roomCount: item.roomCount,
      ratePlans:
        item.ratePlans
          ?.filter((ratePlan) => ratePlan.status)
          .map((ratePlan) => ({
            type: ratePlan.label,
            label: ratePlan.label,
            value: ratePlan.id,
            isBase: ratePlan.isBase,
            variablePrice: ratePlan.variablePrice,
            channels: [],
          })) ?? [],
    };
    return room.ratePlans.length ? room : null;
  });
  return res.filter((item) => item);
}
