import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { IndexViewerComponent } from './index-viewer/index-viewer.component';
import { HttpModule } from '@angular/http';
import { SearchTablePipe } from './search-table.pipe';
import { FormsModule } from '@angular/forms';
import { ConfigService } from './config/config.service';
import { SolrServiceService } from './solr-service.service';


@NgModule({
  declarations: [
    AppComponent,
    IndexViewerComponent,
    SearchTablePipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    HttpModule,
    FormsModule
  ],
  providers: [ConfigService, SolrServiceService ],
  bootstrap: [AppComponent],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
})
export class AppModule { }
