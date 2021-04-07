import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopCardsComponent } from './top-cards.component';

describe('TopCardsComponent', () => {
  let component: TopCardsComponent;
  let fixture: ComponentFixture<TopCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
