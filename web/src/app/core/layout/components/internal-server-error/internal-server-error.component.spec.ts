import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { SharedModule } from '@/shared/shared.module';
import { InternalServerErrorComponent } from './internal-server-error.component';

describe('InternalServerErrorComponent', () => {
  let component: InternalServerErrorComponent;
  let fixture: ComponentFixture<InternalServerErrorComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatIconTestingModule, SharedModule],
        declarations: [InternalServerErrorComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalServerErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
