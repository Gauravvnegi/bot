import { FormGroup } from '@angular/forms';
import { GuestMemberForm, GuestType } from '../types/guest.type';

export class GuestFactory {
  static mapFormData(formData: GuestMemberForm) {
    return {
      firstName: formData.firstName ?? '',
      lastName: formData.lastName ?? '',
      contactDetails: {
        cc: formData.cc ?? '',
        contactNumber: formData.phoneNo ?? '',
        emailId: formData.email ?? '',
      },
      age: formData.age ?? '',
      companyId: formData.company ?? '',
      gender: formData.gender ?? '',
      dateOfBirth: formData.dateOfBirth ?? '',
      address: {
        addressLine1: formData?.address?.formattedAddress ?? '',
        city: formData?.address?.city ?? '',
        state: formData?.address?.state ?? '',
        countryCode: formData?.address?.countryCode ?? '',
        postalCode: formData?.address?.postalCode ?? '',
      },
      type: formData?.type,
    };
  }
  static patchEditView(form: FormGroup, input: GuestType) {
    const contact = input.contactDetails;
    form.patchValue({
      firstName: input?.firstName ?? '',
      lastName: input?.lastName ?? '',
      email: contact?.emailId,
      cc: contact?.cc,
      phoneNo: contact.contactNumber,
      company: input.companyId,
      gender: input.gender ?? '',
      dateOfBirth: input.dateOfBirth ?? Date.now(),
      age: input?.age ?? '',
      address: {
        formattedAddress: `${input.address?.addressLine1 ?? ''}`,
        city: input.address?.city ?? '',
        state: input.address?.state ?? '',
        countryCode: input.address?.countryCode ?? '',
        postalCode: input.address?.postalCode ?? '',
      },
    });
  }
}
