import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEssayComponent } from './list-essay.component';

describe('ListEssayComponent', () => {
  let component: ListEssayComponent;
  let fixture: ComponentFixture<ListEssayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListEssayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListEssayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
