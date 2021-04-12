// import { TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BS_ICON, ICON } from '@/shared/constants';

import { IconsService } from './icons.service';

describe('IconsService', () => {
  let service: IconsService;
  let matIconRegistrySpy: jasmine.SpyObj<MatIconRegistry>;
  let domSanitizerSpy: jasmine.SpyObj<DomSanitizer>;

  const icons = [ICON.SOCIAL_Email, BS_ICON.Building];

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
      `../../../assets/images/icons/${ICON.SOCIAL_Email.toString()}.svg`
    );
    expect(domSanitizerSpy.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      `../../../assets/images/bs-icons/${BS_ICON.Building.toString()}.svg`
    );
  });
});
