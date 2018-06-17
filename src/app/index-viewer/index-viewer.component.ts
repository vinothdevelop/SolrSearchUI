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
  allColumns: Array<Column>;
  displayedColumns: Array<Column>;
  removedColumns: Array<Column>;
  query: string;
  pageSize: string;
  solrUrl: string;
  solrCores: Array<string>;
  solrCore: string;
  pager: Pager;
  alertMessage: string;

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
    this.alertMessage = '';
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
      },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.ShowAlert('Client-side error occured.');
          } else {
            this.ShowAlert('Server-side error occured.');
          }
        });
    }
  }

  queryChange(event: KeyboardEvent) {
    this.GenerateFilterCondition();
  }

  private GenerateFilterCondition() {
    this.apiQuery = '*:*';
    const queryArray = [];
    this.displayedColumns.forEach(column => {
      if (((column.filterType !== '' &&
        column.filterType != null) || (column.type === 'boolean' && column.filterValue !== 'All')) &&
        column.filterValue !== '' &&
        column.filterValue != null) {
        column.validFilter = true;
        if (column.type === 'boolean') {
          queryArray.push(column.name + ':' + column.filterValue);
          column.filterType = 'equals';
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

  validFilteredColumns(itemList: Column[]): Column[] {
    const result: Column[] = [];
    this.displayedColumns.forEach(column => {
      if (column.validFilter) {
        result.push(column);
      }
    });
    return result;
  }

  clearFilter(column: Column) {
    column.filterType = null;
    column.filterValue = null;
    column.validFilter = false;
    this.GenerateFilterCondition();
  }

  removeField(column: Column) {
    this.removedColumns.push(column);
    const index = this.displayedColumns.indexOf(column);
    this.displayedColumns.splice(index, 1);
    this.removedColumns = this.sortFields(this.removedColumns);
  }

  addField(column: Column) {
    this.displayedColumns.push(column);
    const index = this.removedColumns.indexOf(column);
    this.removedColumns.splice(index, 1);
    this.displayedColumns = this.sortFields(this.displayedColumns);
  }

  sortFields(columnList: Column[]): Column[] {
    return columnList.sort(function (a, b) {
      return (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : (a.name.toLowerCase() > b.name.toLowerCase()) ? 1 : 0;
    });
  }

  private GetSolrSchema() {
    this.alertMessage = '';
    this.solrService.getSolrSchema(this.solrUrl, this.solrCore).subscribe(data => {
      this.allColumns = data.fields;
      this.displayedColumns = data.fields;
      this.GetSolrData();
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.ShowAlert('Client-side error occured.');
        } else {
          this.ShowAlert('Server-side error occured.');
        }
      });
  }

  ngOnInit(): void {
    this.solrUrl = '';
    this.allColumns = [];
    this.displayedColumns = [];
    this.removedColumns = [];
    this.pageSize = '10';
    this.pager = {} as Pager;
    this.pager.currentPage = 1;
    this.pager.totalPages = 1;
    this.pager.totalResults = 1;
    this.pager.startIndex = 0;
    this.alertMessage = '';
    this.GetConfiguration();
  }

  private GetConfiguration() {
    this.alertMessage = '';
    this.configService.getConfig().subscribe(data => {
      this.config = data;
      this.solrUrl = data.solrUrl;
      this.GetSolrCore();
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.ShowAlert('Client-side error occured.');
        } else {
          this.ShowAlert('Server-side error occured.');
        }
      });
  }

  private GetSolrData() {
    this.alertMessage = '';
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
            this.ShowAlert('Client-side error occured.');
          } else {
            this.ShowAlert('Server-side error occured.');
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

  private ShowAlert(message: string) {
    this.alertMessage = message;
  }
}
