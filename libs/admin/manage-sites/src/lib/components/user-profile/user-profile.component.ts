import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  ConfigService,
  CountryCode,
  CountryCodeList,
  UserData,
  UserService,
} from '@hospitality-bot/admin/shared';
import { Option } from 'libs/admin/shared/src/lib/types/form.type';
import { SnackBarService } from 'libs/shared/material/src/lib/services/snackbar.service';
import { ManageSitesService } from '../../services/manage-sites.service';

@Component({
  selector: 'hospitality-bot-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  useForm: FormGroup;
  code: Option[] = [];
  userId: string;
  userData: UserData;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private configService: ConfigService,
    private snackbarService: SnackBarService,
    private manageSitesService: ManageSitesService
  ) {}

  ngOnInit(): void {
    this.userId = this.userService.getLoggedInUserId();
    this.initForm();
    this.getCountryCode();
  }

  initForm() {
    this.useForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cc: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      profileUrl: [''],
    });

    this.userService.getUserDetailsById(this.userId).subscribe((res) => {
      this.userData = res;
      this.useForm.patchValue({
        firstName: this.userData.firstName,
        lastName: this.userData.lastName,
        email: this.userData.email,
        cc: this.userData.cc,
        phoneNumber: this.userData.phoneNumber,
        profileUrl: this.userData.profileUrl,
      });
    }, this.handleError);
  }

  getCountryCode() {
    this.configService.getCountryCode().subscribe((res) => {
      const data = new CountryCodeList().deserialize(res);
      this.code = data.records;
    });
  }
  handleSave() {
    if (this.useForm.invalid) {
      this.useForm.markAllAsTouched();
      this.snackbarService.openSnackBarAsText('Invalid Login form');
      return;
    }

    const data: UserData = {
      ...this.userData,
      ...this.useForm.getRawValue(),
      parentId: this.userId,
    };

    this.manageSitesService.updateUserDetails(data).subscribe(() => {
      this.snackbarService.openSnackBarAsText(
        'Profile Updated Successfully',
        '',
        { panelClass: 'success' }
      );
    }, this.handleError);
  }

  handleError = ({ error }) => {
    this.snackbarService
      .openSnackBarWithTranslate(
        {
          translateKey: `messages.error.${error?.type}`,
          priorityMessage: error?.message,
        },
        ''
      )
      .subscribe();
  };
}
