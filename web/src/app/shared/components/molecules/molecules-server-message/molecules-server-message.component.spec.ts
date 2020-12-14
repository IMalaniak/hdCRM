import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

import { MoleculesServerMessageComponent } from './molecules-server-message.component';

describe('MoleculesServerMessageComponent', () => {
  let component: MoleculesServerMessageComponent;
  let fixture: ComponentFixture<MoleculesServerMessageComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [MatIconTestingModule],
        declarations: [MoleculesServerMessageComponent],
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
    fixture = TestBed.createComponent(MoleculesServerMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
