import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UnsubscribeFeatureComponent } from './unsubscribe-feature.component';

describe('UnsubscribeFeatureComponent', () => {
  let component: UnsubscribeFeatureComponent;
  let fixture: ComponentFixture<UnsubscribeFeatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnsubscribeFeatureComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeFeatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
