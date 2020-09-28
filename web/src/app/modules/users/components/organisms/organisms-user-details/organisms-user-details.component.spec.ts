import { initialFormsState } from '@/core/reducers/dynamic-form/dynamic-form.reducer';
import { SharedModule } from '@/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { OrganismsUserDetailsComponent } from './organisms-user-details.component';

describe('OrganismsUserDetailsComponent', () => {
  let component: OrganismsUserDetailsComponent;
  let fixture: ComponentFixture<OrganismsUserDetailsComponent>;
  const initialState = {
    forms: initialFormsState
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
