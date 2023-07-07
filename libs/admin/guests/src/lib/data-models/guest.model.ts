import { FormGroup } from '@angular/forms';
import { GuestType } from '../types/guest.type';

export class GuestFactory {
  static mapFormData(formData) {
    return {
      firstName: formData['firstName'] ?? '',
      lastName: formData['lastName'] ?? '',
      contactDetails: {
        cc: formData['cc'] ?? '',
        contactNumber: formData['phoneNo'] ?? '',
        emailId: formData['email'] ?? '',
      },
      age: +formData['age'] ?? '',
      companyId: formData['company'] ?? '',
      gender: formData['gender'] ?? '',
      dateOfBirth: formData['dateOfBirth'] ?? '',
    } as GuestType;
  }
  static patchEditView(form: FormGroup, input) {
    const contact = input.contactDetails;
    form.patchValue({
      firstName: input?.firstName ?? '',
      lastName: input?.lastName ?? '',
      email: contact?.emailId,
      cc: contact?.cc,
      phoneNo: contact.contactNumber,
      company: input.companyId,
      gender: input.gender ?? '',
      dateOfBirth: input.dob ?? Date.now(),
      age: input?.age ?? '',
    });
  }
}
