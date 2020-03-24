import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTrueFalseComponent } from './create-true-false.component';

describe('CreateTrueFalseComponent', () => {
  let component: CreateTrueFalseComponent;
  let fixture: ComponentFixture<CreateTrueFalseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateTrueFalseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateTrueFalseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
