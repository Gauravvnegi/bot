import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateWithViewComponent } from './create-with-view.component';

describe('CreateWithViewComponent', () => {
  let component: CreateWithViewComponent;
  let fixture: ComponentFixture<CreateWithViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateWithViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateWithViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
