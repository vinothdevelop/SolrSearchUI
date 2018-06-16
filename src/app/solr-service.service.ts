import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class SolrServiceService {
  constructor(private httpService: HttpClient) {
  }

  getSolrCores(solrUrl: string): Observable<any> {
    return this.httpService.get(solrUrl + '/solr/admin/cores?action=STATUS&wt=json');
  }

  getSolrSchema(solrUrl: string, core: string): Observable<any> {
    return this.httpService.get(solrUrl + '/solr/' + core + '/schema/fields');
  }

  GetSolrData(solrUrl: string,
    url: string,
    solrCore: string,
    apiUrl: string,
    apiQuery: string,
    returnFormat: string,
    pageSize: string) {
    const solrRequest = solrUrl
      + url
      + solrCore
      + apiUrl
      + apiQuery
      + '&'
      + returnFormat
      + '&rows=' + pageSize;
    return this.httpService.get(solrRequest, { responseType: 'text' });
  }

}
