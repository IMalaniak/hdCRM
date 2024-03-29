import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { initialIntegrationsState } from '@core/store/integration/integration.reducer';
import { SharedModule } from '@shared/shared.module';

import { OrganismsUserIntegrationsComponent } from './organisms-user-integrations.component';

describe('OrganismsUserIntegrationsComponent', () => {
  let component: OrganismsUserIntegrationsComponent;
  let fixture: ComponentFixture<OrganismsUserIntegrationsComponent>;
  const initialState = {
    integrations: initialIntegrationsState
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsUserIntegrationsComponent],
        imports: [HttpClientModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserIntegrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
