import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Request } from '../model/Request'; 
import { Observable, of } from 'rxjs';


const httpOptions : Object = {
  Headers: new HttpHeaders(
      {
          'Content-Type' : 'application/json'
      }
  )
}

@Injectable({providedIn: 'root'})
export class RequestService {
  private requestUrl = 'http://localhost:8081/api/requests'; 
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }
  getRequests (): Observable<Request[]> {
    return this.http.get<Request[]>(this.requestUrl)
      .pipe(
        tap(requests => this.log(`fetched requests`)),
        catchError(this.handleError('getMarqs', []))
      );
  }

  getRequestNo404<Data>(id: number): Observable<Request> {
    const url = `${this.requestUrl}/?id=${id}`;
    return this.http.get<Request[]>(url)
      .pipe(
        map(requests => requests[0]), // returns a {0|1} element array
        tap(h => {
          const result = h ? `fetched` : `did not find`;
          this.log(`${result} request id=${id}`);
        }),
        catchError(this.handleError<Request>(`getRequest id=${id}`))
      );
  }

  getRequest(id: number): Observable<Request> {
    const url = `${this.requestUrl}/${id}`;
    return this.http.get<Request>(url).pipe(
      tap(_ => this.log(`fetched request id=${id}`)),
      catchError(this.handleError<Request>(`getRequest id=${id}`))
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

  // Log a RequestService message with the MessageService 
  private log(message: string) {
    this.messageService.add('RequestService: ' + message);
  }

}
