import { EntityState, Option } from '@hospitality-bot/admin/shared';
import { AgentFormType } from '../types/form.types';
import { AgentListResponse, AgentTableResponse } from '../types/response';
import { CompanyResponseType } from 'libs/admin/company/src/lib/types/response';
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
      priceModifier: form.commissionType,
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
    };

    return data;
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
