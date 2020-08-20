import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'admin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public backgroundColor: string;
  constructor() {}

  ngOnInit(): void {
    this.backgroundColor = 'rgb(216, 11, 11)';
  }
}
