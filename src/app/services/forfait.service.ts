import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Forfait } from '../model/Forfait'; 
import { Observable, of } from 'rxjs';


const httpOptions : Object = {
  Headers: new HttpHeaders(
      {
          'Content-Type' : 'application/json'
      }
  )
}

@Injectable({providedIn: 'root'})
export class ForfaitService {
  private forfaitsUrl = 'http://localhost:8081/api/forfaits'; 
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  getForfaits(): Observable<Forfait[]> {
    return this.http.get<Forfait[]>(this.forfaitsUrl)
      .pipe(
        tap(forfaits => this.log(`fetched forfaits`)),
        catchError(this.handleError('getMarqs', []))
      );
  }

  getForfaitNo404<Data>(id: string): Observable<Forfait> {
    const url = `${this.forfaitsUrl}/?id=${id}`;
    return this.http.get<Forfait[]>(url)
      .pipe(
        map(forfaits => forfaits[0]), // returns a {0|1} element array
        tap(h => {
          const result = h ? `fetched` : `did not find`;
          this.log(`${result} forfait id=${id}`);
        }),
        catchError(this.handleError<Forfait>(`getForfait id=${id}`))
      );
  }

  getForfait(id: number): Observable<Forfait> {
    const url = `${this.forfaitsUrl}/${id}`;
    return this.http.get<Forfait>(url).pipe(
      tap(_ => this.log(`fetched forfait id=${id}`)),
      catchError(this.handleError<Forfait>(`getForfait id=${id}`))
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

  // Log a ForfaitService message with the MessageService 
  private log(message: string) {
    this.messageService.add('ForfaitService: ' + message);
  }

}
