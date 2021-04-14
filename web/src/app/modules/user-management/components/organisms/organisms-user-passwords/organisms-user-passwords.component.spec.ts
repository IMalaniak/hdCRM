import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';

import { OrganismsUserPasswordsComponent } from './organisms-user-passwords.component';

describe('OrganismsUserPasswordsComponent', () => {
  let component: OrganismsUserPasswordsComponent;
  let fixture: ComponentFixture<OrganismsUserPasswordsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsUserPasswordsComponent],
        imports: [RouterTestingModule, BrowserAnimationsModule, MatIconTestingModule, SharedModule],
        providers: [provideMockStore({})]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsUserPasswordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
