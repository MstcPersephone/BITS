import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListExactMatchComponent } from './list-exact-match.component';

describe('ListExactMatchComponent', () => {
  let component: ListExactMatchComponent;
  let fixture: ComponentFixture<ListExactMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListExactMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListExactMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
