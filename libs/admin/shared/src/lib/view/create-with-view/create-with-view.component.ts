import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'hospitality-bot-create-with-view',
  templateUrl: './create-with-view.component.html',
  styleUrls: ['./create-with-view.component.scss'],
})
export class CreateWithViewComponent implements OnInit {
  @Input() isLoaded: boolean;
  @Input() onboardingUrl: string;
  $subscription = new Subscription();

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.$subscription.add(
      this.route.url.subscribe((url) => {
        this.onboardingUrl =
          this.onboardingUrl + '/' + url.map((item) => item.path).join('/');
      })
    );
  }

  ngOnDestroy() {
    this.$subscription.unsubscribe();
  }
}
