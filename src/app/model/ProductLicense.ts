import { Pricing } from "./Pricing"
import { Product } from "./Product"

export interface ProductLicense{
    id: string,
    accessKey: string,
    startDate: string,
    endDate: string,
    isActive: boolean,
    products: Product,
    pricings: Pricing
}