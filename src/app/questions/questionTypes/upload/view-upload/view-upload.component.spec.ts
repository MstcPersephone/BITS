import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewUploadComponent } from './view-upload.component';

describe('ViewUploadComponent', () => {
  let component: ViewUploadComponent;
  let fixture: ComponentFixture<ViewUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
