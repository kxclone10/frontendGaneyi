import { TestBed } from '@angular/core/testing';

import { ProductLicenseService } from './product-license.service';

describe('ProductLicenseService', () => {
  let service: ProductLicenseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductLicenseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
