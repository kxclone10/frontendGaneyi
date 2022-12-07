import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Pricing } from '../model/Pricing';
import { Observable, of } from 'rxjs';


const httpOptions : Object = {
  Headers: new HttpHeaders(
      {
          'Content-Type' : 'application/json'
      }
  )
}

@Injectable({providedIn: 'root'})
export class PricingService {
  private pricingUrl = 'http://localhost:8081/api/pricings'; 
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  getPricings (): Observable<Pricing[]> {
    return this.http.get<Pricing[]>(this.pricingUrl)
      .pipe(
        tap(achates => this.log(`fetched pricings`)),
        catchError(this.handleError('getMarqs', []))
      );
  }

  getPricingNo404<Data>(id: number): Observable<Pricing> {
    const url = `${this.pricingUrl}/?id=${id}`;
    return this.http.get<Pricing[]>(url)
      .pipe(
        map(pricings => pricings[0]), // returns a {0|1} element array
        tap(h => {
          const result = h ? `fetched` : `did not find`;
          this.log(`${result} pricing id=${id}`);
        }),
        catchError(this.handleError<Pricing>(`getPricings id=${id}`))
      );
  }

  getPricing(id: string): Observable<Pricing> {
    const url = `${this.pricingUrl}/${id}`;
    return this.http.get<Pricing>(url).pipe(
      tap(_ => this.log(`fetched pricing id=${id}`)),
      catchError(this.handleError<Pricing>(`getPricing id=${id}`))
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
    this.messageService.add('PricingService: ' + message);
  }

}
