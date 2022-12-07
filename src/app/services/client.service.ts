import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Client } from '../model/Client';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';

const httpOptions = {
  Headers: new HttpHeaders(
      {
          'Content-Type' : 'application/json'
      }
  )
}
@Injectable({providedIn: 'root'})
export class ClientService {

  private clientsUrl = "http://localhost:8081/api/clients"

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getClients(): Observable<Client[]>{
    return this.http.get<Client[]>(this.clientsUrl).pipe(
      tap(clients => this.log(`fetched clients`)),
      catchError(this.handleError('getClients',[]))
    );
  }

  getClientNo404<Data>(id: string): Observable<Client> {
    const url = `${this.clientsUrl}/?id=${id}`;
    return this.http.get<Client[]>(url)
      .pipe(
        map(clientes => clientes[0]),
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} client id=${id}`);
        }),
        catchError(this.handleError<Client>(`getClient id=${id}`))
      );
  }

  getClient(id: string): Observable<Client> {
    const url = `${this.clientsUrl}/${id}`;
    return this.http.get<Client>(url).pipe(
      tap(_ => this.log(`fetched client id=${id}`)),
      catchError(this.handleError<Client>(`getClient id=${id}`))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      console.error(error);

      this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  
  private log(message: string) {
    this.messageService.add('ClientService: ' + message);
  }
}
