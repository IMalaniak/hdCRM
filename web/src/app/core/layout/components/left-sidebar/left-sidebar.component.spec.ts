import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LeftSidebarComponent } from './left-sidebar.component';
import { authStateMock } from '@/shared/testing/mocks';
import { provideMockStore } from '@ngrx/store/testing';

describe('LeftSidebarComponent', () => {
  let component: LeftSidebarComponent;
  let fixture: ComponentFixture<LeftSidebarComponent>;
  const initialState = {
    auth: authStateMock
  }

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [LeftSidebarComponent],
        imports: [RouterTestingModule],
        providers: [provideMockStore({initialState})]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
