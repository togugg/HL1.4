import { TestBed } from '@angular/core/testing';

import { PdfMakerService } from './pdf-maker.service';

describe('PdfMakerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PdfMakerService = TestBed.get(PdfMakerService);
    expect(service).toBeTruthy();
  });
});
