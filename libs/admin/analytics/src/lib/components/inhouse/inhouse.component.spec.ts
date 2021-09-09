import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseComponent } from './inhouse.component';

describe('InhouseComponent', () => {
  let component: InhouseComponent;
  let fixture: ComponentFixture<InhouseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
