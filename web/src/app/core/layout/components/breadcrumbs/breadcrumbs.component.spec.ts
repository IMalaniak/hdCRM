import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';

import { provideMockStore } from '@ngrx/store/testing';
import { Breadcrumb } from './breadcrumb';

import { BreadcrumbsComponent } from './breadcrumbs.component';
import { SharedModule } from '@/shared/shared.module';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  const initialState = {
    router: {
      state: {
        root: {
          children: [
            {
              data: {
                animation: 'PrivateView'
              },
              url: [],
              children: [
                {
                  data: {
                    breadcrumb: 'Planner',
                    animation: 'PlannerPage'
                  },
                  url: [
                    {
                      path: 'planner',
                      parameters: {}
                    }
                  ],
                  children: [
                    {
                      data: {
                        breadcrumb: 'List',
                        animation: 'PlannerListPage',
                        privilege: 'plan-view'
                      },
                      url: [
                        {
                          path: 'list',
                          parameters: {}
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
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
          url: '/home'
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
