import { managerFlashReportRows } from '../constant/manager-reports.const';
import {
  ManagerFlashReportData,
  ManagerReportResponse,
} from '../types/manager-reports.types';
import { ReportClass } from '../types/reports.types';

/**
 * @class Default Manager Report class
 * Will be extended in every Manger report
 */
class MangerReport {}

export class ManagerFlashReport extends MangerReport
  implements ReportClass<ManagerFlashReportData, any> {
  records: ManagerFlashReportData[];
  deserialize(mangerReportData: ManagerReportResponse[]) {
    this.records = new Array<ManagerFlashReportData>();

    mangerReportData = mangerReportData.map((item) => {
      const totalRoomMinusOSS =
        item?.totalRooms ?? 0 - item?.outOfServiceRooms ?? 0;
      const availableRooms = totalRoomMinusOSS - item?.occupiedRooms ?? 0;
      const availableRoomsMinusOOSS =
        availableRooms - item?.outOfServiceRooms ?? 0;
      const noOfLettableRooms =
        item?.totalRooms ?? 0 - item?.outOfServiceRooms ?? 0;
      const roomsOccupiedMinusCompAndHouse =
        item?.occupiedRooms ??
        0 - item?.complimentaryRooms ??
        0 - item?.houseUseRooms ??
        0;
      const roomOccupiedMinusHouseUse =
        item?.occupiedRooms ?? 0 - item?.houseUseRooms ?? 0;
      const roomOccupiedMinusComp =
        item?.occupiedRooms ?? 0 - item?.complimentaryRooms ?? 0;
      const revParInclDNR = +(
        item?.roomRevenue / item?.totalRooms ?? 0
      ).toFixed(2);
      const totalRevenue = item?.roomRevenue + item?.inclusionOrAddOn;

      return {
        ...item,
        totalRoomMinusOSS,
        availableRooms,
        availableRoomsMinusOOSS,
        noOfLettableRooms,
        roomsOccupiedMinusCompAndHouse,
        roomOccupiedMinusHouseUse,
        roomOccupiedMinusComp,
        revParInclDNR,
        totalRevenue,
      };
    });

    const dayData =
      mangerReportData.find((item) => item.calenderType === 'DAY') ?? {};
    const monthData =
      mangerReportData.find((item) => item.calenderType === 'MONTH') ?? {};
    const yearData =
      mangerReportData.find((item) => item.calenderType === 'YEAR') ?? {};

    managerFlashReportRows.forEach((item) => {
      this.records.push({
        emptyCell: item.label,
        day: dayData[item.name],
        year: yearData[item.name],
        month: monthData[item.name],
      });
    });

    return this;
  }
}
