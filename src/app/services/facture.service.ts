import { Facture } from "../model/Facture";
import { catchError, map, Observable, of, tap } from "rxjs";
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { MessageService } from "./message.service";


const httpOptions = {
    Headers: new HttpHeaders(
        {
            'Content-Type' : 'application/json'
        }
    )
}

@Injectable(
    {
        providedIn: 'root'
    }
)

export class FactureService{
    private facturesUrl = 'http://localhost:8081/api/factures';

    constructor(
      private http: HttpClient,
      private messageService: MessageService
      ){}

    getFactures() : Observable<Facture[]>{

        return this.http.get<Facture[]>(this.facturesUrl).pipe(
          tap(factures => this.log(`Factures reçues avec succes`)),
          catchError(this.handleError('getFacture',[]))
          );
        
    }

    // Rechercher la facture par id et retourner `undefined` quand l'id n'est pas trouvé

    getFactureNo404<Data>(id: string): Observable<Facture>{
      const url = `${this.facturesUrl}/?id=${id}`;
      return this.http.get<Facture[]>(url).pipe(
        map(factures=>factures[0]),               //returns a {0|1} element array
        tap(h=>{
          const outcome = h ? `fetched` : `did not find`;
          this.log(`${outcome} facture id=${id}`);
        }),
        catchError(this.handleError<Facture>(`getFacture id=${id}`))
      );
    }

    // Rechercher la facture en utilisant l'id. Elle va afficher 404 si l'id n'est pas trouvé
    // Normally we should get facture by using the ref

    getFacture(id:string): Observable<Facture>{
      const url = `${this.facturesUrl}/${id}`;
      return this.http.get<Facture>(url).pipe(
        tap(_ => this.log(`fetched facture id=${id}`)),
        catchError(this.handleError<Facture>(`getFacture id=${id}`))
      );
    }

    private log(message : string){
      this.messageService.add('FactureService: '+ message);
    }

    private handleError<T>(operation = 'operation', result?:T){
      return (error: any): Observable<T> => {
        console.error(error);  //log to console instead.

        this.log(`${operation} failed: ${error.message}`);

        //Let the app keep running by returning an empty result.
        return of(result as T);
      }
    }

}