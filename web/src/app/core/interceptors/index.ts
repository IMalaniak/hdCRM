﻿import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ApiPrefixInterceptor } from './api-prefix.interceptor';
import { ErrorInterceptor } from './error.interceptor';
import { JwtInterceptor } from './jwt.interceptor';

export const httpInterceptorsProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: ApiPrefixInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
];
