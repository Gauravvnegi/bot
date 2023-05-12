import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { set } from 'lodash';
import { SocialMediaService } from '../../services/social-media.service';

@Component({
  selector: 'hospitality-bot-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
})
export class SocialMediaComponent extends FormComponent implements OnInit {
  useForm: FormGroup;
  socialMediaControl: FormArray;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    public controlContainer: ControlContainer,
    private socialMediaService: SocialMediaService
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.initForm();
    this.patchValueToSocialMediaControl();
    this.patchValue();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      socialPlatforms: this.fb.array([]),
    });
    this.socialMediaControl = this.useForm.get('socialPlatforms') as FormArray;
    this.getSocailMediaConfig();
  }

  patchValue(): void {
    this.socialMediaService.onSubmit.subscribe((res) => {
      console.log(res);
      if (res) {
        this.inputControl?.patchValue(this.socialMediaControl.value);
      }
    });
  }

  patchValueToSocialMediaControl(): void {
    console.log(this.inputControl?.value);
    setTimeout(() => {
      if (this.inputControl?.value)
        this.socialMediaControl.patchValue(this.inputControl?.value);
    }, 1000);
  }

  getSocailMediaConfig() {
    this.socialMediaService.getSocialMediaConfig().subscribe((res) => {
      res?.forEach((element) => {
        this.socialMediaControl.push(
          this.fb.group({
            name: [element.name],
            imageUrl: [element.imageUrl],
            redirectUrl: [''],
          })
        );
      });
    });
  }
}
