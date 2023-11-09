import { EntityState, Option } from '@hospitality-bot/admin/shared';
import { AgentFormType } from '../types/form.types';
import { AgentListResponse, AgentTableResponse } from '../types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
import { DateService } from '@hospitality-bot/shared/utils';
import { FormGroup } from '@angular/forms';
export class AgentModel {
  id: string;
  name: string;
  code: number;
  verified: boolean;
  company: string;
  companyId: string;
  iataNo: number;
  email: string;
  phoneNo: string;
  commissionType: string;
  commission: string;
  status: boolean;
  created: number;
  createdString: string;

  static mapFormData(form: AgentFormType) {
    const name = form.name.split(' ');
    let data: AgentTableResponse = {
      firstName: name[0] ?? '',
      lastName: name[1] ?? '',
      contactDetails: {
        cc: form.cc,
        contactNumber: form.phoneNo,
        emailId: form.email,
      },
      nationality: form.address['country'],
      type: 'AGENT',
      priceModifier: 'COMMISSION',
      priceModifierType: form.commissionType,
      priceModifierValue: form.commission?.toString(),
      iataNumber: form.iataNo,
      isVerified: form.iataNo.length > 0 ? true : false,
      address: {
        addressLine1: form.address['formattedAddress'] ?? '',
        city: form.address['city'] ?? '',
        state: form.address['state'] ?? '',
        countryCode: form.address['country'] ?? '',
        postalCode: form.address['postalCode'] ?? '',
      },
      companyId: form.company,
      status: form.status,
      marketSegment: form.marketSegment,
      businessSource: form.businessSource,
      billingInstructions: form.billingInstructions,
    };

    return data;
  }

  static updateForm(form: FormGroup, data: AgentTableResponse) {
    const address = data.address;
    form.patchValue({
      packageCode: '#' + data.code,
      name: data.firstName,
      email: data.contactDetails.emailId,
      cc: data.contactDetails.cc,
      phoneNo: data.contactDetails.contactNumber,
      iataNo: data.iataNumber,
      company: data.companyId,
      address: {
        formattedAddress: `${address.addressLine1}, ${address.city}, ${address.countryCode}, ${address.postalCode}, ${address.state}`,
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
    });
  }

  static resetForm(form: FormGroup) {
    form.patchValue({
      name: '',
      email: '',
      phoneNo: '',
      iataNo: '',
      company: '',
      address: {},
      commission: '',
    });
  }

  deserialize(input: AgentTableResponse) {
    const contact = input.contactDetails;
    Object.assign(this, {
      id: input.id,
      name: input.firstName,
      code: input.code,
      verified: input.isVerified,
      iataNo: input.iataNumber,
      email: contact.emailId,
      phoneNo: `${contact.cc}-${contact.contactNumber}`,
      commissionType: input.priceModifier,
      company: input.company?.firstName,
      commission: input.priceModifierValue,
      status: input.status,
      companyId: input.company?.id,
      created: input?.created,
      createdString: DateService.getDateMDY(input?.created),
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
