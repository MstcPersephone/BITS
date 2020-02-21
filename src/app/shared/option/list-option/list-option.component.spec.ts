import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOptionComponent } from './list-option.component';

describe('ListOptionComponent', () => {
  let component: ListOptionComponent;
  let fixture: ComponentFixture<ListOptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
