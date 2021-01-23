import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '../base.component';
import { ValidatorService } from '../../services/validator.service';

@Component({
  selector: 'web-user-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [ValidatorService],
})
export class InputComponent extends BaseComponent {
  async openNat() {
    const supported = 'contacts' in navigator && 'ContactsManager' in window;
    console.log('InputComponent -> openNat -> supported', supported);
    if (supported) {
      await this.getContacts();
    }
  }

  //   const props = ['name', 'email', 'tel', 'address', 'icon'];
  // const opts = {multiple: true};

  async getContacts() {
    try {
      const contacts = await navigator['contacts'].select(
        ['name', 'email', 'tel', 'address', 'icon'],
        { multiple: false }
      );
      // handleResults(contacts);
    } catch (ex) {
      // Handle any errors here.
    }
  }
}
