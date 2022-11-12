import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeViewComponent } from './unsubscribe-view.component';

describe('UnsubscribeViewComponent', () => {
  let component: UnsubscribeViewComponent;
  let fixture: ComponentFixture<UnsubscribeViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnsubscribeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
