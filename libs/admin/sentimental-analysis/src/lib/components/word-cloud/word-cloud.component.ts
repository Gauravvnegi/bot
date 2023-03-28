import { Component, OnInit } from '@angular/core';
import { Sentiment } from '../../constants/sentiment';
import { MockData } from '../../constants/sentimental-mock-data';

@Component({
  selector: 'hospitality-bot-word-cloud',
  templateUrl: './word-cloud.component.html',
  styleUrls: ['./word-cloud.component.scss'],
})
export class WordCloudComponent implements OnInit {
  tabFilterItems = Sentiment.tabFilterItems;
  tabFilterIdx = 0;
  data = MockData.wordCloud;
  wordCloudImg = this.data.imgSrcPositive;
  isDropdownActive = false;
  topicsSelected = [];
  menuItems = Sentiment.menuItems;
  constructor() {}

  ngOnInit(): void {
    this.topicsSelected = this.menuItems
      .map((item) => item.value)
      .filter((item) => item != 'ALL');
  }

  onSelectedTabFilterChange(event): void {
    this.wordCloudImg = event.index
      ? this.data.imgSrcNegative
      : this.data.imgSrcPositive;
  }

  handleDropdownClick(event): void {
    event.stopPropagation();
    this.isDropdownActive = !this.isDropdownActive;
  }

  selectTopic(e): void {
    if (e.event.target) {
      this.handleTopicSelection(e.item);
      e.event.target.classList.toggle('selected');
    }
  }

  handleTopicSelection(item): void {
    if (item.value === 'ALL') {
      this.topicsSelected =
        this.topicsSelected.length == this.menuItems.length - 1
          ? []
          : this.menuItems
              .map((item) => item.value)
              .filter((item) => item != 'ALL');
    } else if (this.topicsSelected.includes(item.value)) {
      this.topicsSelected.splice(this.topicsSelected.indexOf(item.value), 1);
    } else {
      this.topicsSelected.push(item.value);
    }
  }
}
