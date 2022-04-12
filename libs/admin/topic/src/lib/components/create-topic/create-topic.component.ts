import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';

@Component({
  selector: 'hospitality-bot-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {

  createTopicFG: FormGroup;

  constructor(private _fb:FormBuilder, private _snackbarService:SnackBarService,
    private location:Location) { }

  initFG() :void{
    this.createTopicFG=this._fb.group({
      name:['',[Validators.required, Validators.pattern(Regex.NAME)]],
      description:[''],
      active:[false,[Validators.required]]
    });
  }

  ngOnInit(): void {
    this.initFG();
  }

  createTopic(){
    if(this.createTopicFG.invalid){
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    const data=this.createTopicFG.getRawValue();
    //api call with data
    console.log(data);
  }

  redirectToTable(){
    this.location.back();
  }

}
