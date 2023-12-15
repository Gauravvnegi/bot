import { Injectable } from '@angular/core';
import {
  AgentFormType,
  GuestFormType,
} from '../../../../agent/src/lib/types/form.types';
import { CompanyFormType } from '../../../../company/src/lib/types/form.types';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
type ComponentTypes = 'agent' | 'company' | 'guest';
type SetFormTypes = AgentFormType | CompanyFormType | GuestFormType;

/**
 * @todo - Rename this Member form service // Not even need to utilise this now
 */
@Injectable({ providedIn: 'root' })
export class FormService {
  companyRedirectRoute = '';
  agentForm: AgentFormType;
  guestForm: GuestFormType;
  companyForm: CompanyFormType;

  companyId = new BehaviorSubject<string>('');

  constructor() {}

  // Reset the entire services inside the reset method
  reset() {
    this.companyRedirectRoute = '';
    this.agentForm = {} as AgentFormType;
    this.guestForm = {} as GuestFormType;
    this.companyForm = {} as CompanyFormType;
  }

  restoreForm(form: FormGroup, type: ComponentTypes) {
    const forms = {
      agent: this.agentForm,
      guest: this.guestForm,
      company: this.companyForm,
    };
    forms[type] && form.patchValue(forms[type]);
    this.reset();
  }

  setForm(formData: SetFormTypes, type: ComponentTypes) {
    const formProperties = {
      agent: 'agentForm',
      guest: 'guestForm',
      company: 'companyForm',
    };
    this[formProperties[type]] = formData;
  }
}
