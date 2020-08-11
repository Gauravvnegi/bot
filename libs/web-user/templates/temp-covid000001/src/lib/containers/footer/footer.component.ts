import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { HyperlinkElementService } from 'libs/web-user/shared/src/lib/services/hyperlink-element.service';

@Component({
  selector: 'hospitality-bot-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  slides = [
    // {
    //   id: '14b1d7b2-9c97-46cc-9631-c5b9d82acc45',
    //   url: 'https://www.youtube.com/watch?v=9pVy8sRC440',
    //   type: 'VIDEO',
    //   title: 'wash your hands frequently',
    // },
    {
      id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
      url: 'assets/video1.png',
      type: 'IMAGE',
      title: 'Testing of Hotel Staff',
    },
    {
      id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
      url: 'assets/video2.png',
      type: 'IMAGE',
      title: 'Thermal Screening at Checkpoint',
    },
    {
      id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
      url: 'assets/video3.png',
      type: 'IMAGE',
      title: 'Daily Sanitation of Hotel',
    },
    {
      id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
      url:
        'https://images.newscientist.com/wp-content/uploads/2020/02/11165812/c0481846-wuhan_novel_coronavirus_illustration-spl.jpg',
      type: 'IMAGE',
      title: 'Testing of Hotel Staff',
    },
    {
      id: '24b1d7b2-9c97-46cc-9631-c5b9d82acc45',
      url: 'assets/video3.png',
      type: 'IMAGE',
      title: 'Thermal Screening at Checkpoint',
    },
  ];

  slideConfig = {
    slidesToShow: 3,
    slidesToScroll: 1,
    dots: true,
    infinite: true,
    speed: 100,
    autoplay: true,
  };
  @ViewChild("safety") hyperlinkElement: ElementRef;
  $subscriber: Subscription = new Subscription();

  constructor(public _hyperlink: HyperlinkElementService) {}

  ngOnInit(): void {
    this.listenForElementClicked();
  }

  listenForElementClicked() {
    this.$subscriber.add(
      this._hyperlink.$element.subscribe((res) => {
        if(res && res['element'] && res['element'] === 'safety') {
          this.scrollIntoView(this.hyperlinkElement.nativeElement);
        }
      })
    );
  }

  scrollIntoView($element): void {
    $element.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    this._hyperlink.setSelectedElement('');
  }
}
