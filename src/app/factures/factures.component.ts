import { Component, OnInit } from '@angular/core';
import { FactureService } from '../services/facture.service';
import { ProductService } from '../services/product.service';
import { ClientService } from '../services/client.service';
import { PricingService } from '../services/pricing.service';
import { ProductLicenseService } from '../services/product-license.service';
import { RequestService } from '../services/request.service';
import { ForfaitService } from '../services/forfait.service';

import { Facture } from '../model/Facture';
import { Client } from '../model/Client';
import { Product } from '../model/Product';
import { Pricing } from '../model/Pricing';
import { Request } from '../model/Request';
import { Forfait } from '../model/Forfait';



@Component({
  selector: 'facture',
  templateUrl: './factures.component.html',
  styleUrls: ['./factures.component.css'],
})
export class FacturesComponent implements OnInit {

  factures: Facture[] = [];
  clients:  Client[] = [];
  products: Product[] = [];
  pricings: Pricing[] = [];
  forfaits: Forfait[] = [];
  requests: Request[] = [];

  facture = new Facture;
  client = new Client;
  price = new Pricing;



  constructor(private factureService : FactureService,
    private clientService : ClientService,
    private produitService : ProductService,
    private productLicenseService: ProductLicenseService,
    private pricingService: PricingService,
    private forfaitService: ForfaitService,
    private requestService: RequestService
    ){}

  ngOnInit(): void {
    //this.getFactures();
    
    this.getFacture("637656d873ae6765949f9aa1");    // Avec l'id de la facture en question
    this.getFactureProducts();

    this.facture.sousTotal = 0;
    this.facture.tva = 0;
    this.facture.rabais = 0;
    this.facture.total = 0;

    this.computeTotalBill();
  }



  getFacture(id: string):void{
    this.factureService.getFacture(id).subscribe(
      facture => this.facture = facture
    );
    console.log(this.facture);
  }


  getProductPrice(p: Product):number{ 
    this.pricingService.getPricings().subscribe(
      pricings => this.pricings = pricings
    );
    const prix = this.pricings.find(pr => pr.productLicense.id === p.productLicense.id);
    return prix ? Number.parseFloat(prix.value.toString()): 0;
  }

  getProductRequestDuration(p: Product): number{
    this.requestService.getRequests().subscribe(
      requests => this.requests = requests
    );
    const requete = this.requests.find(req => req.products.id === p.id)
    return requete ? Number.parseFloat(requete.duration.toString()) : 0;
  }

  getProductPriceHt(p: Product): number{
    const priceHt = this.getProductPrice(p) * this.getProductRequestDuration(p);
    return priceHt;
  }

  getClient(id: string): void{
    this.clientService.getClient(id).subscribe(client => {
      this.client = client;
    });
  }

  getClientFirstName(id: string): string{
    this.getClient(id);
    return this.client.firstName;
  }

  
  getClientAddress(id: string): string{
    this.getClient(id);
    return this.client.address;
  }


  getFactureProducts():void{
      this.produitService.getProducts().subscribe(
        products => this.products = products
      );
      this.products = this.products.filter(c => c.client.id === this.facture.client.id);
  }

  getFactureForfaits():void{
    this.forfaitService.getForfaits().subscribe(
      forfaits => this.forfaits = forfaits
    )
    this.forfaits = this.forfaits.filter(f => f.client.id === this.facture.client.id)
  }

  computeTotalBill(): void{
    if(this.products){
      this.products.forEach(product =>{             // each product price should be computed with the duration of request
        if(this.getProductPrice(product))
          this.facture.sousTotal += (Number.parseFloat(this.getProductPrice(product).toString())
            * Number.parseFloat(this.getProductRequestDuration(product).toString())
          );
      });
    }

    if(this.forfaits){
      this.forfaits.forEach(forfait =>{               // each forfait has already a defined price
        this.facture.sousTotal += forfait.price;
      });
    }

    this.facture.tva = (Number.parseFloat(this.facture.sousTotal.toString())*20)/100;
    this.facture.rabais = (Number.parseFloat(this.facture.sousTotal.toString())*20)/100;
    this.facture.total = ( Number.parseFloat(this.facture.sousTotal.toString())
      - this.facture.tva + this.facture.rabais
    );
  }

}



