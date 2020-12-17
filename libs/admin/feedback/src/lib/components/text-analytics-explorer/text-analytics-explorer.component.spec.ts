import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAnalyticsExplorerComponent } from './text-analytics-explorer.component';

describe('TextAnalyticsExplorerComponent', () => {
  let component: TextAnalyticsExplorerComponent;
  let fixture: ComponentFixture<TextAnalyticsExplorerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextAnalyticsExplorerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAnalyticsExplorerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
