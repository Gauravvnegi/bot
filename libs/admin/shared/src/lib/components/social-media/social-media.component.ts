import { Component, Input, OnInit } from '@angular/core';
import { FormComponent } from '../form-component/form.components';
import { ControlContainer, FormGroup } from '@angular/forms';

@Component({
  selector: 'hospitality-bot-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss']
})
export class SocialMediaComponent implements OnInit {
@Input() parentFG: FormGroup;
  

  ngOnInit(): void {

  }

}
