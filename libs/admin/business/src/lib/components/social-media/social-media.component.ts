import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { Subscription } from 'rxjs';
import { BusinessService } from '../../services/business.service';

@Component({
  selector: 'hospitality-bot-social-media',
  templateUrl: './social-media.component.html',
  styleUrls: ['./social-media.component.scss'],
})
export class SocialMediaComponent extends FormComponent implements OnInit {
  useForm: FormGroup;
  socialMediaControl: FormArray;
  $subscription = new Subscription();
  @Input() isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public controlContainer: ControlContainer,
    private businessService: BusinessService
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initInputControl();
    this.initForm();
    this.patchValueToSocialMediaControl();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      socialPlatforms: this.fb.array([]),
    });
    this.socialMediaControl = this.useForm.get('socialPlatforms') as FormArray;
    this.getSocailMediaConfig();
  }

  patchValueToSocialMediaControl(): void {
    this.$subscription.add(
      this.inputControl.valueChanges.subscribe((res) => {
        this.socialMediaControl.patchValue(res);
      })
    );
  }

  getSocailMediaConfig() {
    this.businessService.getSocialMediaConfig().subscribe((res) => {
      res?.forEach((element) => {
        this.socialMediaControl.push(
          this.fb.group({
            name: [element.name],
            imageUrl: [element.imageUrl],
            redirectUrl: [''],
          })
        );
      });
      this.businessService.onSubmit.subscribe((res) => {
        if (res) {
          this.inputControl?.patchValue(this.socialMediaControl.value);
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
