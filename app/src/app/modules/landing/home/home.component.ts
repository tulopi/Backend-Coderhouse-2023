import { Component, OnInit } from '@angular/core';
import { Products } from '../../../core/products/products.types';
import { ProductsService } from '../../../core/products/products.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  imports: [
    RouterLink
  ]
})
export class HomeComponent implements OnInit {
  productos: Products[] = [];
  showPaginationButtons = false;

  constructor(
    private _productsService: ProductsService,
    private router:  Router
    ) {}

  ngOnInit(): void {
    this._productsService.getAllProducts().subscribe(
      (data: Products[]) => {
        this.productos = data;
      }
    );
    setTimeout(() => {
      this.showPaginationButtons = true;
    }, 500);
  }

  navigateToDetails(id:string) {
    this.router.navigate(['/product', id]);
  }

  get products(): Products[] {
    return this._productsService.products;
  }
}
