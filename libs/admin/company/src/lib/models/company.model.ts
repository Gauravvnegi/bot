import { EntityState } from '@hospitality-bot/admin/shared';
import { CompanyFormType } from '../types/form.types';
import { CompanyListResponse, CompanyResponseType } from '../types/response';
import { DateService } from '@hospitality-bot/shared/utils';
import { FormGroup } from '@angular/forms';

export class CompanyModel {
  id: string;
  companyName: string;
  companyCode: string;
  contactName: string;
  email: string;
  phoneNumber: string;
  salesPersonName: string;
  salesPersonNumber: string;
  discount: string;
  discountType: string;
  created: number;
  createdString: string;
  status: boolean;

  static mapFormData(form: CompanyFormType) {
    let data: CompanyResponseType = {
      firstName: form.name ?? '',
      contactDetails: {
        cc: form.cc ?? '',
        contactNumber: form.phoneNo ?? '',
        emailId: form.email ?? '',
      },
      address: {
        addressLine1: form.address['formattedAddress'] ?? '',
        city: form.address['city'] ?? '',
        state: form.address['state'] ?? '',
        countryCode: form.address['countryCode'] ?? '',
        postalCode: form.address['postalCode'] ?? '',
      },
      salesPersonName: form.salePersonName ?? '',
      salesPersonPhone: form.salePersonNo ?? '',
      priceModifierType: form.discountType ?? '',
      priceModifierValue: form.discount ?? '',
      priceModifier: 'DISCOUNT',
      status: form.status,
      taxId: form.taxId,
      creditLimit: form.creditLimit,
      marketSegment: form.marketSegment,
      businessSource: form.businessSource,
      billingInstruction: form.billingInstruction,
    };
    return data;
  }

  static updateForm(form: FormGroup, data: CompanyResponseType) {
    const address = data.address;
    form.patchValue({
      packageCode: '#' + data.code,
      name: data.firstName,
      email: data.contactDetails.emailId,
      cc: data.contactDetails.cc,
      phoneNo: data.contactDetails.contactNumber,
      address: {
        formattedAddress: `${address.addressLine1}, ${address.city}, ${address.countryCode}, ${address.postalCode}, ${address.state}`,
        city: address.city,
        state: address.state,
        countryCode: address.countryCode,
        postalCode: address.postalCode,
      },
      salePersonName: data.salesPersonName,
      salePersonNo: data.salesPersonPhone,
      discountType: data?.priceModifierType ?? data?.priceModifier,
      discount: data.priceModifierValue,
      status: data.status,
      taxId: data?.taxId,
      creditLimit: data?.creditLimit,
      marketSegment: data?.marketSegment,
      businessSource: data?.businessSource,
      billingInstruction: data?.billingInstruction,
    });
  }

  deserialize(input: CompanyResponseType) {
    const contact = input['contactDetails'];
    Object.assign(this, {
      id: input.id,
      companyName: input.firstName,
      companyCode: input.code,
      contactName: input.firstName,
      email: contact.emailId,
      phoneNumber: `${contact.cc}-${contact.contactNumber}`,
      salesPersonName: input.salesPersonName,
      salesPersonNumber: `${input['salesPersonCC'] ?? ''}${
        input.salesPersonPhone
      }`,
      discount: input.priceModifierValue,
      discountType: input?.priceModifierType ?? input.priceModifier,
      status: input.status,
      created: input.created,
      createdString: DateService.getDateMDY(input.created),
    });
    return this;
  }
}

export class CompanyResponseModel {
  records: CompanyModel[];
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: CompanyListResponse) {
    this.records =
      input.records?.map((item) => new CompanyModel().deserialize(item)) ?? [];
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    this.totalRecord = input.total;
    return this;
  }
}
