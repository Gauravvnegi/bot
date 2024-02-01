import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServiceItemComponent } from './create-service-item.component';

describe('CreateServiceItemComponent', () => {
  let component: CreateServiceItemComponent;
  let fixture: ComponentFixture<CreateServiceItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServiceItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServiceItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
