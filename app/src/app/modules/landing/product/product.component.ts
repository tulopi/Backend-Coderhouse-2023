import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../core/products/products.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './product.component.html',
})
export class ProductComponent implements OnInit {

  product: any = [];

  constructor(
    private _productsService: ProductsService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const productId = params['id'];
      this._productsService.getProductDetail(productId).subscribe(
        (data) => {
          this.product = data;
        }
      );
    });
  }
}
