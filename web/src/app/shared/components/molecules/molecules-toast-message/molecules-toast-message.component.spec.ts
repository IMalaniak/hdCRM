import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { SharedModule } from '@/shared/shared.module';
import { MoleculesToastMessageComponent } from './molecules-toast-message.component';

describe('MoleculesServerMessageComponent', () => {
  let component: MoleculesToastMessageComponent;
  let fixture: ComponentFixture<MoleculesToastMessageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatIconTestingModule, SharedModule],
        declarations: [MoleculesToastMessageComponent],
        providers: [
          {
            provide: MatSnackBarRef,
            useValue: {}
          },
          {
            provide: MAT_SNACK_BAR_DATA,
            useValue: {}
          }
        ]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(MoleculesToastMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
