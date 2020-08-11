import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialCommentsComponent } from './special-comments.component';

describe('SpecialCommentsComponent', () => {
  let component: SpecialCommentsComponent;
  let fixture: ComponentFixture<SpecialCommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialCommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
