import { CompanyContributionsReportData, NoShowSummaryReportData } from '../types/analytics-reports.types';
import { ColsData } from '../types/reports.types';

export const companyContributionsReportCols: ColsData<CompanyContributionsReportData> = {
    
}


export const noShowSummaryReportCols: ColsData<NoShowSummaryReportData> = {
    createdOn: {
        header: 'Created On',
        isSortDisabled: true,
    },
    bookingNo: {
        header: 'Booking No',
        isSortDisabled: true,
    },
    guestName: {
        header: 'Guest Name',
        isSortDisabled: true,
    },
    pax: {
        header: 'Pax',
        isSortDisabled: true,
    },
    rooms: {
        header: 'Rooms',
        isSortDisabled: true,
    },
    roomType: {
        header: 'Room Type',
        isSortDisabled: true,
    },
    company: {
        header: 'Company',
        isSortDisabled: true,
    },
    status: {
        header: 'Status',
        isSortDisabled: true,
    },
    checkIn: {
        header: 'Check In',
        isSortDisabled: true,
    },
    checkOut: {
        header: 'Check Out',
        isSortDisabled: true,
    },
    createdBy: {
        header: 'Created By',
        isSortDisabled: true,
    },
    
};

