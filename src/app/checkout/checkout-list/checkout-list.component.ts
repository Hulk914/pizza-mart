import { DataStoreService } from './../../data-store.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-list',
  templateUrl: './checkout-list.component.html',
  styleUrls: ['./checkout-list.component.scss'],
})
export class CheckoutListComponent implements OnInit {
  displayedColumns: string[] = ['item', 'qty', 'unitPrice', 'cost'];
  transactions = [];
  totalPrice = 0;
  constructor(private _dataStore: DataStoreService, private router: Router) {}

  ngOnInit(): void {
    if (!this._dataStore.productsFormGroup) {
      this.transactions = [];
      this.totalPrice = 0;
      return;
    }
    this.transactions = this._dataStore.productsFormGroup.get(
      'productsFormArray'
    ).value;
    if (this.transactions.length > 0) {
      this.transactions = this.transactions.filter(
        (trnx) => trnx.selectedQty > 0
      );
      this.totalPrice = this.transactions.reduce(
        (sum, product) => sum + product.price * product.selectedQty,
        0
      );
    } else {
      this.totalPrice = 0;
    }
  }

  payment() {
    this._dataStore.cartQty = 0;
    this._dataStore.productList = this._dataStore.productsFormGroup
      .get('productsFormArray')
      .value.map((product) => {
        return {
          id: product.id,
          name: product.name,
          imageURL: product.imageURL,
          price: product.price,
          availableQty: product.availableQty - product.selectedQty,
        };
      });
    this._dataStore.openSnackBar('Order Successful!');
    this.router.navigate(['/products']);
  }
}
