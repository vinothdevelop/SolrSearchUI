import { TestBed, inject } from '@angular/core/testing';

import { SolrServiceService } from './solr-service.service';

describe('SolrServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SolrServiceService]
    });
  });

  it('should be created', inject([SolrServiceService], (service: SolrServiceService) => {
    expect(service).toBeTruthy();
  }));
});
