import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoleculesUserListSmItemComponent } from './molecules-user-list-sm-item.component';

describe('MoleculesUserListSmItemComponent', () => {
  let component: MoleculesUserListSmItemComponent;
  let fixture: ComponentFixture<MoleculesUserListSmItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoleculesUserListSmItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesUserListSmItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
