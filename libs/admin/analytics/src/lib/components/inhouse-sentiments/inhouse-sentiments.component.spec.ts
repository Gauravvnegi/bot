import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InhouseSentimentsComponent } from './inhouse-sentiments.component';

describe('InhouseSentimentsComponent', () => {
  let component: InhouseSentimentsComponent;
  let fixture: ComponentFixture<InhouseSentimentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InhouseSentimentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InhouseSentimentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
