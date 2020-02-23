import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExactMatchComponent } from './edit-exact-match.component';

describe('EditExactMatchComponent', () => {
  let component: EditExactMatchComponent;
  let fixture: ComponentFixture<EditExactMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditExactMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExactMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
