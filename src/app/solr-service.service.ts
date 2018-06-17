import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class SolrServiceService {
  constructor(private httpService: HttpClient) {
  }

  getSolrCores(solrUrl: string): Observable<any> {
    return this.httpService.get(solrUrl + '/solr/admin/cores?action=STATUS&wt=json', { responseType: 'json' });
  }

  getSolrSchema(solrUrl: string, core: string): Observable<any> {
    return this.httpService.get(solrUrl + '/solr/' + core + '/schema/fields', { responseType: 'json' });
  }

  GetSolrData(solrUrl: string,
    url: string,
    solrCore: string,
    apiUrl: string,
    apiQuery: string,
    returnFormat: string,
    pageSize: string,
    startIndex: Number) {
    const solrRequest = solrUrl
      + url
      + solrCore
      + apiUrl
      + apiQuery
      + '&'
      + returnFormat
      + '&rows=' + pageSize
      + '&start=' + startIndex;
    return this.httpService.get(solrRequest, { responseType: 'text' });
  }

}
