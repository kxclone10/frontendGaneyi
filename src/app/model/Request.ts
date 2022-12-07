import { Product } from "./Product"

export interface Request{
    id: string,
    duration: number,
    status: string,
    requestDate: string,
    resultat: null,
    products: Product,
    forfait: null
}