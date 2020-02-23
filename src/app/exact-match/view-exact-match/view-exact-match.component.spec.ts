import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewExactMatchComponent } from './view-exact-match.component';

describe('ViewExactMatchComponent', () => {
  let component: ViewExactMatchComponent;
  let fixture: ComponentFixture<ViewExactMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewExactMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewExactMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
