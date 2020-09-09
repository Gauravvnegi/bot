import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'admin-profile-dropdown',
  templateUrl: './profile-dropdown.component.html',
  styleUrls: ['./profile-dropdown.component.scss']
})
export class ProfileDropdownComponent implements OnInit {


  @Input() items=[];

  constructor() { }

  ngOnInit(): void {
  }

}
