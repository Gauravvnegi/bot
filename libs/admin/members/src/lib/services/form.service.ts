import { Injectable } from '@angular/core';
import { AgentFormType } from '../../../../agent/src/lib/types/form.types';
import { CompanyFormType } from '../../../../company/src/lib/types/form.types';
import { FormGroup } from '@angular/forms';
type ComponentTypes = 'agent' | 'company';
type SetFormTypes = AgentFormType | CompanyFormType;
@Injectable()
export class FormService {
  companyRedirectRoute = '';
  agentForm: AgentFormType;
  companyForm: CompanyFormType;
  constructor() {}

  // Reset the entire services inside the reset method
  reset() {
    this.companyRedirectRoute = '';
    this.agentForm = {} as AgentFormType;
    this.companyForm = {} as CompanyFormType;
  }

  restoreForm(form: FormGroup, type: ComponentTypes) {
    form.patchValue(type === 'agent' ? this.agentForm : this.companyForm);
  }

  setForm(formData: SetFormTypes, type: ComponentTypes) {
    switch (type) {
      case 'agent':
        this.agentForm = formData as AgentFormType;
        break;
      case 'company':
        this.companyForm = formData as CompanyFormType;
        break;
    }
  }
}
