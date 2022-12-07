import { Client } from "./Client";

export class Facture {
    id: string;
    rabais: number;
    tva: number;
    sousTotal: number;
    total: number;
    typeFacturation: string;
    status: string;
    reference: string;
    date: string;
    forfait: {};
    client: Client;
    payment: {};
}