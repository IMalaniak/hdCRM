import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';
import { formsStateMock } from '@shared/testing/mocks';

import { OrganismsUserDetailsComponent } from './organisms-user-details.component';

describe('OrganismsUserDetailsComponent', () => {
  let component: OrganismsUserDetailsComponent;
  let fixture: ComponentFixture<OrganismsUserDetailsComponent>;
  const initialState = {
    forms: formsStateMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsUserDetailsComponent],
        imports: [HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
