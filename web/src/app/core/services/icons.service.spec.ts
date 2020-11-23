// import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { BS_ICONS, ICONS } from '@/shared/constants';
import { IconsService } from './icons.service';

describe('IconsService', () => {
  let service: IconsService;
  let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  const icons = [ICONS.SOCIAL_Email, BS_ICONS.Building];

  beforeEach(() => {
    domSanitizerSpy = jasmine.createSpyObj('DomSanitizer', ['bypassSecurityTrustResourceUrl']);
    matIconRegistrySpy = jasmine.createSpyObj('MatIconRegistry', ['addSvgIcon']);
    service = new IconsService(matIconRegistrySpy, domSanitizerSpy);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register different types of icons', () => {
    service.registerIcons([...icons]);
    expect(matIconRegistrySpy.addSvgIcon).toHaveBeenCalledTimes(2);
    expect(domSanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      `../../../assets/images/icons/${ICONS.SOCIAL_Email.toString()}.svg`
    );
    expect(domSanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      `../../../assets/images/bs-icons/${BS_ICONS.Building.toString()}.svg`
    );
  });
});
