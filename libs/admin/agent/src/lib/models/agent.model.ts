import { EntityState, Option } from '@hospitality-bot/admin/shared';
import { AgentFormType } from '../types/form.types';
import { AgentListResponse, AgentTableResponse } from '../types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { DateService } from '@hospitality-bot/shared/utils';
import { FormGroup } from '@angular/forms';
export class AgentModel {
  id: string;
  agencyName: string;
  code: number;
  verified: boolean;
  salesPersonName: string;
  creditLimit: number;
  creditLimitUsed: number;
  iataNo: number;
  email: string;
  phoneNo: string;
  commissionType: string;
  commission: string;
  status: boolean;
  created: number;
  createdString: string;
  taxId: string;

  static mapFormData(form: AgentFormType) {
    let data: AgentTableResponse = {
      firstName: form.agencyName ?? '',
      lastName: '',
      contactDetails: {
        cc: form.cc,
        contactNumber: form.phoneNo,
        emailId: form.email,
      },
      nationality: form?.address['country'] ?? '',
      type: 'AGENT',
      priceModifier: 'COMMISSION',
      priceModifierType: form.commissionType,
      priceModifierValue: form.commission?.toString(),
      iataNumber: form.iataNo,
      isVerified: form.iataNo.length > 0 ? true : false,
      address: {
        addressLine1: form?.address['formattedAddress'] ?? '',
        city: form?.address['city'] ?? '',
        state: form?.address['state'] ?? '',
        countryCode: form?.address['country'] ?? '',
        postalCode: form?.address['postalCode'] ?? '',
      },
      salesPersonName: form?.salesPersonName,
      creditLimit: form?.creditLimit,
      status: form.status,
      marketSegment: form.marketSegment,
      businessSource: form.businessSource,
      billingInstructions: form.billingInstructions,
      taxId: form?.taxId,
    };

    return data;
  }

  static updateForm(form: FormGroup, data: AgentTableResponse) {
    const address = data.address;
    form.patchValue({
      packageCode: '#' + data.code,
      agencyName: data.firstName,
      email: data.contactDetails.emailId,
      cc: data.contactDetails.cc,
      phoneNo: data.contactDetails.contactNumber,
      iataNo: data.iataNumber,
      salesPersonName: data?.salesPersonName,
      creditLimit: data?.creditLimit,
      address: {
        formattedAddress: `${address.addressLine1 ?? ''}`,
        city: address.city,
        state: address.state,
        countryCode: address.countryCode,
        postalCode: address.postalCode,
      },
      commissionType: data.priceModifierType,
      commission: data.priceModifierValue,
      status: data.status,
      marketSegment: data.marketSegment,
      businessSource: data.businessSource,
      billingInstructions: data.billingInstructions,
      taxId: data?.taxId,
    });
  }

  static resetForm(form: FormGroup) {
    form.patchValue({
      agencyName: '',
      email: '',
      phoneNo: '',
      iataNo: '',
      salesPersonName: '',
      company: '',
      address: {},
      commission: '',
    });
  }

  deserialize(input: AgentTableResponse) {
    const contact = input.contactDetails;
    Object.assign(this, {
      id: input.id,
      agencyName: input?.firstName,
      code: input.code,
      verified: input.isVerified,
      iataNo: input.iataNumber,
      email: contact.emailId,
      phoneNo: `${contact.cc}-${contact.contactNumber}`,
      commissionType: input.priceModifierType,
      salesPersonName: input?.salesPersonName,
      creditLimit: input.creditLimit,
      commission: input.priceModifierValue,
      status: input.status,
      created: input?.created,
      creditLimitUsed: input?.creditLimitUsed,
      createdString: DateService.getDateMDY(input?.created),
      taxId: input?.taxId,
    });
    return this;
  }

  static getCompanyList(input: CompanyResponseType[]) {
    let options: Option[] = input.map((item) => {
      return {
        label: item.firstName,
        value: item.id,
      };
    });
    return options;
  }
}

export class AgentResponseModel {
  records: AgentModel[];
  entityTypeCounts: EntityState<string>;
  entityStateCounts: EntityState<string>;
  totalRecord: number;

  deserialize(input: AgentListResponse) {
    this.records =
      input.records?.map((item) => new AgentModel().deserialize(item)) ?? [];
    this.entityStateCounts = input?.entityStateCounts;
    this.entityTypeCounts = input?.entityTypeCounts;
    this.totalRecord = input.total;
    return this;
  }
}
