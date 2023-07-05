import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';
import { FormComponent } from 'libs/admin/shared/src/lib/components/form-component/form.components';
import { Subscription } from 'rxjs';
import { SocialMediaServices } from '../../services/social.media.service';

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
    private socialsMediaService: SocialMediaServices
  ) {
    super(controlContainer);
  }

  ngOnInit(): void {
    this.initForm();
    this.initInputControl();
  }

  initForm(): void {
    this.useForm = this.fb.group({
      socialPlatforms: this.fb.array([]),
    });
    this.socialMediaControl = this.useForm.get('socialPlatforms') as FormArray;
    this.getSocialMediaConfig();
  }

  patchValueToSocialMediaControl(): void {
    if (!!this.inputControl.value.length) {
      this.socialMediaControl.patchValue(this.inputControl.value);
    }
    this.$subscription.add(
      this.inputControl.valueChanges.subscribe((res) => {
        this.socialMediaControl.patchValue(this.inputControl.value, {
          emitEvent: false,
        });
      })
    );
    this.patchValueToParentComponent();
  }

  patchValueToParentComponent(): void {
    this.useForm.valueChanges.subscribe((res) => {
      this.inputControl.patchValue(res.socialPlatforms);
    });
  }

  getSocialMediaConfig() {
    this.$subscription.add(
      this.socialsMediaService.getDefaultSocialConfig().subscribe((res) => {
        res?.forEach((element) => {
          this.socialMediaControl.push(
            this.fb.group({
              name: [element.name],
              imageUrl: [element.imageUrl],
              redirectUrl: [''],
            })
          );
        });
        this.patchValueToSocialMediaControl();
      })
    );
  }

  ngOnDestroy(): void {
    this.$subscription.unsubscribe();
  }
}
