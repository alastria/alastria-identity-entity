import { TestBed } from '@angular/core/testing';

import { AlastriaLibService } from './alastria-lib.service';

describe('AlastriaLibService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AlastriaLibService = TestBed.get(AlastriaLibService);
    expect(service).toBeTruthy();
  });
});
