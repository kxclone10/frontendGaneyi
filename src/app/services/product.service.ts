import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';
import { Product } from '../model/Product';


const httpOptions = {
  Headers: new HttpHeaders(
      {
          'Content-type' : 'application/json'
      }
  )
}

@Injectable({providedIn: 'root'})
export class ProductService {

  private produitsUrl = 'http://localhost:8081/api/products';

  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  getProducts (): Observable<Product[]> {
    return this.http.get<Product[]>(this.produitsUrl)
      .pipe(
        tap(products => this.log(`fetched products`)),
        catchError(this.handleError('getProducts', []))
      );
  }

  getProduitNo404<Data>(id: number): Observable<Product> {
    const url = `${this.produitsUrl}/?id=${id}`;
    return this.http.get<Product[]>(url)
      .pipe(
        map(produites => produites[0]), 
        tap(h => {
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} product id=${id}`);
        }),
        catchError(this.handleError<Product>(`getProduct id=${id}`))
      );
  }

  getProduct(id: number): Observable<Product> {
    const url = `${this.produitsUrl}/${id}`;
    return this.http.get<Product>(url).pipe(
      tap(_ => this.log(`fetched product id=${id}`)),
      catchError(this.handleError<Product>(`getProduct id=${id}`))
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

  // Log a ProductService message with the MessageService 
  private log(message: string) {
    this.messageService.add('ProductService: ' + message);
  }
}
