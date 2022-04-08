import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-assets',
  templateUrl: './assets.component.html',
  styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements OnInit {

  constructor(private _router:Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }


  openCreateAsset(){
this._router.navigate(['create'],{relativeTo:this.route} )
  }
}
