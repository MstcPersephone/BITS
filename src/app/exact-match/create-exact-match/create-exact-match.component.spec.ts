import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateExactMatchComponent } from './create-exact-match.component';

describe('CreateExactMatchComponent', () => {
  let component: CreateExactMatchComponent;
  let fixture: ComponentFixture<CreateExactMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateExactMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateExactMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
