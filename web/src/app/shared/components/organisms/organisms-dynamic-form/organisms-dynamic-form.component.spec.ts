import { HttpClientModule } from '@angular/common/http';
import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganismsDynamicFormComponent } from './organisms-dynamic-form.component';

describe('OrganismsDynamicFormComponent', () => {
  let component: OrganismsDynamicFormComponent;
  let fixture: ComponentFixture<OrganismsDynamicFormComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [OrganismsDynamicFormComponent],
        imports: [HttpClientModule]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganismsDynamicFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
