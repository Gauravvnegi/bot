import { EntityState } from '@hospitality-bot/admin/shared';
import { CompanyFormType } from '../types/form.types';
import { CompanyListResponse, CompanyResponseType } from '../types/response';

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
  status: true;

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
        countryCode: form.address['country'] ?? '',
        postalCode: form.address['postalCode'] ?? '',
      },
      salesPersonName: form.salePersonName ?? '',
      salesPersonPhone: form.salePersonNo ?? '',
      priceModifier: form.discountType ?? '',
      priceModifierValue: form.discount ?? '',
    };
    return data;
  }

  deserialize(input: CompanyResponseType) {
    const contact = input['contactDetails'];
    Object.assign(this, {
      id: input.id,
      companyName: input.firstName,
      companyCode: input?.id,
      contactName: input.firstName,
      email: contact.emailId,
      phoneNumber: `${contact.cc}-${contact.contactNumber}`,
      salesPersonName: input.salesPersonName,
      salesPersonNumber: input.salesPersonPhone,
      discount: input.priceModifierValue,
      discountType: input.priceModifier,
      status: input.status,
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
