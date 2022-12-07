import { Client } from "./Client";
import { ProductLicense } from "./ProductLicense";

export interface Product{
    id: number,
    name: string,
    description: string,
    logo: string,
    isActice: boolean,
    apis:{},
    request: Request,
    productLicense: ProductLicense,
    client: Client
}