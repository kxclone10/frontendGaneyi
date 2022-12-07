import { Client } from "./Client";
import { Facture } from "./Facture";
import { Request } from "./Request";

export interface Forfait{
    id: string,
    nom: string,
    description: string,
    numberOfQueries: number,
    price: number,
    periode: string,
    actif: boolean,
    requests: Request,
    facture: Facture,
    client: Client
}