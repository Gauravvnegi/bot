import { FormGroup } from '@angular/forms';

export class GuestFactory {
  static patchEditView(form: FormGroup, input) {
    //TODO: change it after getting api of guest
    const contact = input.contactDetails;
    form.patchValue({
      firstName: input?.firstName ?? '',
      lastName: input?.lastName ?? '',
      email: contact?.emailId,
      cc: contact?.cc,
      phoneNo: contact.contactNumber,
      companyName: '',
      gender: input.gender ?? '',
      dateOfBirth: input.dob ?? Date.now(),
      age: input?.age ?? '',
    });
  }
}
