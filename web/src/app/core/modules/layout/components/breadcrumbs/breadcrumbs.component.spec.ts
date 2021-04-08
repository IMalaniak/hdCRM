import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';

import { SharedModule } from '@/shared/shared.module';
import { routerStoreMock } from '@/shared/testing/mocks';
import { ROUTING } from '@/shared/constants';
import { Breadcrumb } from './breadcrumb';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  const initialState = {
    router: routerStoreMock
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [BreadcrumbsComponent],
        imports: [RouterTestingModule, MatIconTestingModule, SharedModule],
        providers: [provideMockStore({ initialState })]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have breadcrumbs', () => {
    component.breadcrumbs$.subscribe((breadcrumbs: Breadcrumb[]) =>
      expect(breadcrumbs).toEqual([
        {
          keyString: 'home',
          url: ROUTING.ROUTE_HOME
        },
        {
          keyString: 'Planner',
          url: '/planner'
        },
        {
          keyString: 'List',
          url: '/planner/list'
        }
      ])
    );
  });
});
