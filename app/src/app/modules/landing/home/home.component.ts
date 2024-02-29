import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Products } from '../../../core/products/products.types';
import { HttpClientModule } from '@angular/common/http';
import { ProductsService } from '../../../core/products/products.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [
    CommonModule,
    RouterLink
  ],
  standalone: true
})
export class HomeComponent {

    /**
     * Constructor
     */
    constructor(
      private _productsService: ProductsService
    ) {}

  ngOnInit(): void {
    this._productsService.getAllProducts
  }

  get products(): Products[] {
    return this._productsService.products;
  }
}
