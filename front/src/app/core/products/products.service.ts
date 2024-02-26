import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  GetProductsResponse,
  GetProductByIdResponse,
  Products,
} from './products.types';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private baseUrl = 'http://localhost:8080/api/products/';
  private _productos: Products[] = [];


  constructor(private _httpClient: HttpClient) {}
  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Getter for products
   */

  get products(): Products[] {
    return this._productos;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  //

  /**
   * Get all products
   *
   *
   */
  getAllProducts(): Observable<Products[]> {
    return this._httpClient.get<GetProductsResponse>(`${this.baseUrl}`).pipe(
      map(response => {
        this._productos = response.message
        return response.message
      })
    )
  }
}
