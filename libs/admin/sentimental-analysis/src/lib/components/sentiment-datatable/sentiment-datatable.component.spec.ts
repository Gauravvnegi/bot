import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SentimentDatatableComponent } from './sentiment-datatable.component';

describe('SentimentDatatableComponent', () => {
  let component: SentimentDatatableComponent;
  let fixture: ComponentFixture<SentimentDatatableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SentimentDatatableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SentimentDatatableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
