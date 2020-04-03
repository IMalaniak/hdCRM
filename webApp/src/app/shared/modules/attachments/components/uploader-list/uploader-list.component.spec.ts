import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UploaderListComponent } from './uploader-list.component';

describe('UploaderListComponent', () => {
  let component: UploaderListComponent;
  let fixture: ComponentFixture<UploaderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UploaderListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UploaderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
