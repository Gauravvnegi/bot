import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { BrandService } from '../../services/brand.service';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';

@Component({
  selector: 'hospitality-bot-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
})
export class SocialMediaComponent extends FormComponent implements OnInit {
  useForm: FormGroup;
  socialMediaControl: FormArray;
  total: number = 0;

  constructor(
    private fb: FormBuilder,
    private brandService: BrandService,
    public controlContainer: ControlContainer
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initForm();
    this.initInputControl();
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
    console.log(this.inputControl);
    this.useForm.valueChanges.subscribe((res) => { 
            this.inputControl.setValue(res.socialPlatforms);
    });
  }

  getSocailMediaConfig() {
    this.brandService.getSocialMediaConfig().subscribe((res) => {
      this.total = res.length;
      res.forEach((element) => {
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
