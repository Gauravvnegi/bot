import { Injectable } from '@angular/core';
import { ApiService } from '@hospitality-bot/shared/utils';
import { InvoiceForm } from '../types/forms.types';
import { Observable } from 'rxjs';

@Injectable()
export class InvoiceService extends ApiService {
    createInvoice(reservationId: string, data): Observable<any>{
        return this.put(`/api/v1/reservation/${reservationId}/prepare-invoice?format=json&source=BOTSHOT_ADMIN`, data)
    }

    updateInvoice(reservationId: string, data):Observable<any>{
        return this.patch(`/api/v1/reservation/${reservationId}/invoice?source=BOTSHOT_ADMIN`, data)
    }

    getInvoiceData(reservationId: string): Observable<any>{
        return this.get(`/api/v1/reservation/${reservationId}/invoice?format=json&source=BOTSHOT_ADMIN`);
    }

    mapInvoiceData(formValue){
        const invoiceData = new InvoiceForm();
        invoiceData.adults = formValue.adults;
        invoiceData.guestName = formValue.guestName;
        invoiceData.companyName = formValue.companyName;
        invoiceData.invoiceDate = formValue.invoiceDate;
        invoiceData.arrivalDate = formValue.arrivalDate;
        invoiceData.tableData = formValue.tableData;
        invoiceData.departureDate = formValue.departureDate;
        invoiceData.roomNumber = formValue.roomNumber;
        invoiceData.roomType = formValue.roomType;
        invoiceData.children = formValue.children;
        invoiceData.currentAmount = formValue.currentAmount;
        invoiceData.discountedAmount = formValue.discountedAmount;
        invoiceData.paidAmount = formValue.paidAmount;
        invoiceData.dueAmount = formValue.dueAmount;
        invoiceData.discountType = formValue.discountType;
        invoiceData.discount = formValue.discount;
        invoiceData.paidValue = formValue.paidValue;
        invoiceData.paid = formValue.paid;
        return invoiceData;
    }
}
