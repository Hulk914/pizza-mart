import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { timer } from 'rxjs';

@Injectable()
export class DataStoreService {
  // Actual scenario this would come from api call.
  productList = [
    {
      id: 1,
      name: 'Chicken Tikka',
      imageURL: 'assets/product.jpg',
      price: 500,
      availableQty: 5,
    },
    {
      id: 2,
      name: 'Veggie Supreme',
      imageURL: 'assets/product.jpg',
      price: 400,
      availableQty: 5,
    },
  ];

  cartQty = 0;
  productsFormGroup: FormGroup;
  constructor(private _snackBar: MatSnackBar) {}

  openSnackBar(message: string, action = 'dismiss') {
    const snackBarRef = this._snackBar.open(message, action);
    timer(3000).subscribe(() => snackBarRef.dismiss());
  }
}
