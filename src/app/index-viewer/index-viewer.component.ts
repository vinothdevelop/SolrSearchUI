import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { Config } from '../config/config';
import { SolrServiceService } from '../solr-service.service';
import { Pager } from '../interfaces/pager';
import { Column } from '../interfaces/column';

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
  displayedColumns: Array<Column>;
  query: string;
  pageSize: string;
  solrUrl: string;
  solrCores: Array<string>;
  solrCore: string;
  pager: Pager;

  pageSizeChange(event: any) {
    this.pageSize = event;
    this.GetSolrData();
  }

  solrUrlChange(event: KeyboardEvent) {
    this.GetSolrCore();
  }

  setPage(pageNumber: number) {
    this.pager.currentPage = pageNumber;
    this.pager.startIndex = (pageNumber - 1) * Number.parseInt(this.pageSize);
    this.GetSolrData();
  }

  solrCoreChange(event: any) {
    if (this.solrUrl !== '' && this.solrUrl != null && this.solrCore !== '' && this.solrCore != null) {
      this.GetSolrSchema();
    }
  }

  private GetSolrCore() {
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

  queryChange(event: KeyboardEvent) {
    this.apiQuery = '*:*';
    const queryArray = [];
    this.displayedColumns.forEach(column => {
      if (((column.filterType !== '' &&
        column.filterType != null) || (column.type === 'boolean' && column.filterValue !== 'All')) &&
        column.filterValue !== '' &&
        column.filterValue != null) {
        if (column.type === 'boolean') {
          queryArray.push(column.name + ':' + column.filterValue);
        } else if (column.filterType === 'contains') {
          queryArray.push(column.name + ':*' + column.filterValue + '*');
        } else if (column.filterType === 'starts with') {
          queryArray.push(column.name + ':' + column.filterValue + '*');
        } else if (column.filterType === 'ends with') {
          queryArray.push(column.name + ':' + column.filterValue + '*');
        } else if (column.filterType === 'equals') {
          queryArray.push(column.name + ':' + column.filterValue);
        } else if (column.filterType === 'greater than or equal') {
          queryArray.push(column.name + ':{' + column.filterValue + ' TO *}');
        } else if (column.filterType === 'less than or equal') {
          queryArray.push(column.name + ':{* TO ' + column.filterValue + '  }');
        }
      }
    });
    if (queryArray.length > 0) {
      this.apiQuery = queryArray.join(' AND ');
    }

    this.GetSolrData();
  }

  private GetSolrSchema() {
    this.solrService.getSolrSchema(this.solrUrl, this.solrCore).subscribe(data => {
      this.displayedColumns = data.fields;
      this.GetSolrData();
    });
  }

  ngOnInit(): void {
    this.solrUrl = '';
    this.displayedColumns = [];
    this.pageSize = '10';
    this.pager = {} as Pager;
    this.pager.currentPage = 1;
    this.pager.totalPages = 1;
    this.pager.totalResults = 1;
    this.pager.startIndex = 0;
    this.GetConfiguration();
  }

  private GetConfiguration() {
    this.configService.getConfig().subscribe(data => {
      this.config = data;
      this.solrUrl = data.solrUrl;
      this.GetSolrCore();
    });
  }

  private GetSolrData() {
    this.solrService.GetSolrData(this.solrUrl,
      this.url,
      this.solrCore,
      this.apiUrl,
      this.apiQuery,
      this.config.returnFormat,
      this.pageSize,
      this.pager.startIndex)
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
    const parsedData = JSON.parse(data);
    this.dataSource = parsedData.response.docs;
    this.SetPaging(parsedData.response.numFound);
  }

  private SetPaging(totalRecords: number) {
    this.pager.totalResults = totalRecords;
    this.pager.totalPages = Math.ceil(totalRecords / Number.parseInt(this.pageSize));
  }
}
