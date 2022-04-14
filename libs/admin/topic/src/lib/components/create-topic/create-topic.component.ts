import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfigService } from '@hospitality-bot/admin/shared';
import { SnackBarService } from '@hospitality-bot/shared/material';
import { Regex } from 'libs/web-user/shared/src/lib/data-models/regexConstant';
import { Subscription } from 'rxjs';
import { TopicService } from '../../services/topic.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GlobalFilterService } from 'apps/admin/src/app/core/theme/src/lib/services/global-filters.service';
import { TopicDetail } from '../../data-models/topicConfig.model';

@Component({
  selector: 'hospitality-bot-create-topic',
  templateUrl: './create-topic.component.html',
  styleUrls: ['./create-topic.component.scss']
})
export class CreateTopicComponent implements OnInit {


  private $subscription: Subscription = new Subscription();

  topicForm: FormGroup;
  hotelTopic: TopicDetail;
  topicId: string;
  hotelId: string;
  isSavingTopic = false;
  globalQueries = [];

  constructor(private _fb:FormBuilder, private _snackbarService:SnackBarService,
    private location:Location,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private globalFilterService: GlobalFilterService,
    private topicService: TopicService,
    private configService: ConfigService) { 
    }

  initFG() :void{
    this.topicForm=this._fb.group({
      name:['',[Validators.required, Validators.pattern(Regex.NAME)]],
      description:['',[Validators.required]],
      active:[false]
    });
  }

  ngOnInit(): void {
    this.initFG();
    this.listenForGlobalFilters();
  }
  listenForGlobalFilters(): void {
    debugger;
    this.$subscription.add(
      this.globalFilterService.globalFilter$.subscribe((data) => {
        //set-global query everytime global filter changes
        this.globalQueries = [
          ...data['filter'].queryValue,
          ...data['dateRange'].queryValue,
        ];

        this.getHotelId(this.globalQueries);
        // this.getConfig();
        // this.getCategoriesList(this.hotelId);
        // this.getPackageId();
      })
    );
  }

  getHotelId(globalQueries): void {
    globalQueries.forEach((element) => {
      if (element.hasOwnProperty('hotelId')) {
        this.hotelId = element.hotelId;
      }
    });
  }

  createTopic(){
    if(this.topicForm.invalid){
      this._snackbarService.openSnackBarAsText('Invalid Form.');
      return;
    }
    const data=this.topicForm.getRawValue();
    //api call with data
    console.log(data);
    this.addTopic();
  }

  addTopic(){
    this.isSavingTopic = true;
    let data = this.topicService.mapTopicData(
      this.topicForm.getRawValue(),
      this.hotelId
    );
    this.$subscription.add(
      this.topicService.addTopic(this.hotelId, data).subscribe(
        (response) => {
          this.hotelTopic = new TopicDetail().deserialize(response);
          this.topicForm.patchValue(this.hotelTopic.amenityTopic);
          this._snackbarService.openSnackBarAsText(
            'Topic added successfully',
            '',
            { panelClass: 'success' }
          );
          // this.router.navigate([
          //   '/pages/topic/edit',
          //   this.hotelTopic.amenityTopic.id,
          // ]);
          this.isSavingTopic = false;
        },
        ({ error }) => {
          this._snackbarService.openSnackBarAsText(error.message);
          this.isSavingTopic = false;
        }
      )
    );
  }

  redirectToTable(){
    this.location.back();
  }

}
