import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { CommonConstants } from '@/shared/constants';
import { AtomsNoContentInfoComponent } from './atoms-no-content-info.component';

describe('AtomsNocontentInfoComponent', () => {
  let component: AtomsNoContentInfoComponent;
  let fixture: ComponentFixture<AtomsNoContentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtomsNoContentInfoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsNoContentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no content text', () => {
    const debugElement: DebugElement = fixture.debugElement;
    const textDe = debugElement.query(By.css('p'));
    const text: HTMLElement = textDe.nativeElement;
    expect(text.textContent).toEqual(CommonConstants.NO_CONTENT_INFO);
  });
});
