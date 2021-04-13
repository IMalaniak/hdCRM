import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '@/shared/shared.module';

import { OrganismsUserListSmComponent } from './organisms-user-list-sm.component';

describe('OrganismsUserListSmComponent', () => {
  let component: OrganismsUserListSmComponent;
  let fixture: ComponentFixture<OrganismsUserListSmComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [SharedModule],
        declarations: [OrganismsUserListSmComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserListSmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
