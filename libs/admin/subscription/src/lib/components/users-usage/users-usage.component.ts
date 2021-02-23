import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'hospitality-bot-users-usage',
  templateUrl: './users-usage.component.html',
  styleUrls: ['./users-usage.component.scss'],
})
export class UsersUsageComponent implements OnInit {
  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {}

  openRolesPermission(event) {
    event.stopPropagation();
    this.router.navigate(['/pages/roles-permissions']);
  }
}
