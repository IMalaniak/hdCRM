import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@shared/shared.module';

import { TemplatesUserDetailsComponent } from './templates-user-details.component';

describe('TemplatesUserDetailsComponent', () => {
  let component: TemplatesUserDetailsComponent;
  let fixture: ComponentFixture<TemplatesUserDetailsComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [TemplatesUserDetailsComponent],
        imports: [SharedModule, MatIconTestingModule],
        providers: [provideMockStore({})]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplatesUserDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
