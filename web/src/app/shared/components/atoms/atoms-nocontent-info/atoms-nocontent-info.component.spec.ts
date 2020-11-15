import { CONSTANTS } from '@/shared/constants';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AtomsNocontentInfoComponent } from './atoms-nocontent-info.component';

describe('AtomsNocontentInfoComponent', () => {
  let component: AtomsNocontentInfoComponent;
  let fixture: ComponentFixture<AtomsNocontentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AtomsNocontentInfoComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AtomsNocontentInfoComponent);
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
    expect(text.textContent).toEqual(CONSTANTS.NO_CONTENT_INFO);
  });
});
