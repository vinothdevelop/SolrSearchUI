import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Config } from './config';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ConfigService implements OnInit {
  config: Config;
  ngOnInit(): void {
    
  }
  constructor(private httpService: HttpClient) {
   
   
     }

   getConfig(): Observable<any> {
    return this.httpService.get('../assets/config.json');
   }

}
