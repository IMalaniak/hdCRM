import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';

import { TemplatesUserProfileComponent } from './templates-user-profile.component';

describe('TemplatesUserProfileComponent', () => {
  let component: TemplatesUserProfileComponent;
  let fixture: ComponentFixture<TemplatesUserProfileComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesUserProfileComponent],
        imports: [RouterTestingModule, BrowserAnimationsModule, SharedModule],
        providers: [
          provideMockStore({}),
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { queryParams: { edit: false } } }
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesUserProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
