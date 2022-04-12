import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { Location } from '@angular/common';
@Component({
  selector: 'hospitality-bot-create-assets',
  templateUrl: './create-assets.component.html',
  styleUrls: ['./create-assets.component.scss'],
})
export class CreateAssetsComponent implements OnInit {
  createAssetFG: FormGroup;

  constructor(
    private _location: Location,
    private _fb: FormBuilder,
    private _snakbarService: SnackBarService
  ) {}

  ngOnInit(): void {
    this.initFg();
  }

  initFg(): void {
    this.createAssetFG = this._fb.group({
      name: ['', [Validators.required, Validators.pattern(Regex.NAME)]],
      type: ['', [Validators.required]],
      description: [''],
      Image: ['', [Validators.required]],
      active: [false, [Validators.required]],
    });
  }

  createAsset() {
    if (this.createAssetFG.invalid) {
      this._snakbarService.openSnackBarAsText('Invalid form.', '');
      return;
    }
    const data = this.createAssetFG.getRawValue();
    //api call with data
    console.log(data);
  }

  redirectToAssets() {
    this._location.back();
  }
}
