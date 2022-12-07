import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { ProductLicense } from '../model/ProductLicense'; 
import { Observable, of } from 'rxjs';


const httpOptions : Object = {
  Headers: new HttpHeaders(
      {
          'Content-Type' : 'application/json'
      }
  )
}

@Injectable({providedIn: 'root'})
export class ProductLicenseService {
  private productLicenseUrl = 'http://localhost:8081/api/product-licenses'; 
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  getProductLicenses(): Observable<ProductLicense[]> {
    return this.http.get<ProductLicense[]>(this.productLicenseUrl)
      .pipe(
        tap(productLicenses => this.log(`fetched ProductLicenses`)),
        catchError(this.handleError('getMarqs', []))
      );
  }

  getProductLicenseNo404<Data>(id: number): Observable<ProductLicense> {
    const url = `${this.productLicenseUrl}/?id=${id}`;
    return this.http.get<ProductLicense[]>(url)
      .pipe(
        map(productlicenses => productlicenses[0]), // returns a {0|1} element array
        tap(h => {
          const result = h ? `fetched` : `did not find`;
          this.log(`${result} productLicenses id=${id}`);
        }),
        catchError(this.handleError<ProductLicense>(`getProductLicense id=${id}`))
      );
  }

  getProductLicense(id: number): Observable<ProductLicense> {
    const url = `${this.productLicenseUrl}/${id}`;
    return this.http.get<ProductLicense>(url).pipe(
      tap(_ => this.log(`fetched productLicense id=${id}`)),
      catchError(this.handleError<ProductLicense>(`getProductLicense id=${id}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  // Log a AchatService message with the MessageService 
  private log(message: string) {
    this.messageService.add('ProductLicenseService: ' + message);
  }

}
