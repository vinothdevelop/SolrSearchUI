import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Config } from '../config/config';
import { SolrServiceService } from '../solr-service.service';

@Component({
  selector: 'app-index-viewer',
  templateUrl: './index-viewer.component.html',
  styleUrls: ['./index-viewer.component.css']
})
export class IndexViewerComponent implements OnInit {
  config: Config;
  constructor(private http: HttpClient, private configService: ConfigService, private solrService: SolrServiceService) {
  }
  url = '/solr/';
  apiUrl = '/select?indent=on&q=';
  apiQuery = '*:*';
  dataSource: any;
  displayedColumns: any;
  query: string;
  queryArray: any;
  pageSize: string;
  solrUrl: string;
  solrCores: Array<string>;
  solrCore: string;

  pageSizeChange(event: any) {
    this.pageSize = event;
    this.GetSolrData();
  }

  solrUrlChange(event: KeyboardEvent) {
    console.log(this.solrUrl);
    if (this.solrUrl !== '' && this.solrUrl != null) {
      this.solrService.getSolrCores(this.solrUrl).subscribe(data => {
        this.solrCores = [];
        Object.keys(data.status).map(key => {
          this.solrCores.push(key);
          if (this.solrCores.length === 1) {
            this.solrCore = key;
            this.GetSolrSchema();
          }
        });
      });
    }
  }

  solrCoreChange(event: any) {
    if (this.solrUrl !== '' && this.solrUrl != null && this.solrCore !== '' && this.solrCore != null) {
      this.GetSolrSchema();
    }
  }

  queryChange(event: KeyboardEvent) {
    this.apiQuery = '*:*';
    for (const v in this.queryArray) {
      if (this.queryArray[v] !== '' && this.queryArray[v] != null) {
        if (this.apiQuery !== '*:*') {
          this.apiQuery = this.apiQuery + ' AND ' + v + ':' + '*' + this.queryArray[v] + '*';
        } else {
          this.apiQuery = v + ':' + '*' + this.queryArray[v] + '*';
        }
      }
    }
    this.GetSolrData();
  }

  private GetSolrSchema() {
    this.solrService.getSolrSchema(this.solrUrl, this.solrCore).subscribe(data => {
      this.displayedColumns = data.fields.filter(function (i, n) {
        return i.name.indexOf('_') !== 0;
      });
      this.GetSolrData();
    });
  }

  ngOnInit(): void {
    this.solrUrl = '';
    this.displayedColumns = [];
    this.queryArray = {};
    this.pageSize = '10';
    this.configService.getConfig().subscribe(data => {
      this.config = data;
    });
  }

  private GetSolrData() {
    this.solrService.GetSolrData(this.solrUrl, this.url, this.solrCore, this.apiUrl, this.apiQuery, this.config.returnFormat, this.pageSize)
      .subscribe(data => {
        this.ParseData(data);

      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            console.log('Client-side error occured.');
          } else {
            console.log('Server-side error occured.');
          }
        });
  }

  private ParseData(data: string) {
    this.dataSource = JSON.parse(data).response.docs;
    // tslint:disable-next-line:forin
    for (const v in this.dataSource[0]) {
      this.displayedColumns.push(v);
    }
  }
}
