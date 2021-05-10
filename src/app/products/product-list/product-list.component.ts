import { MatSnackBar } from '@angular/material/snack-bar';
import { DataStoreService } from './../../data-store.service';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productList = [];
  isAdmin = false;
  constructor(
    public _dataStore: DataStoreService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.isAdmin = this.route.snapshot.params.isAdmin;
    this.productList = this._dataStore.productList;
    this._dataStore.cartQty = 0;
    this._dataStore.productsFormGroup = this.formBuilder.group({
      productsFormArray: this.formBuilder.array(
        this.productList.map((prod) => this.createProductFormGroup(prod))
      ),
    });
    if (!this.isAdmin) {
      this.productsFormArray.valueChanges.subscribe((products) => {
        this._dataStore.cartQty = products.reduce((sum, product) => {
          return (
            sum +
            (product.selectedQty > product.availableQty
              ? product.availableQty
              : product.selectedQty)
          );
        }, 0);
      });
    }
  }

  createProductFormGroup(product): FormGroup {
    if (this.isAdmin) {
      return this.formBuilder.group({
        id: [product.id],
        name: [product.name, Validators.required],
        imageURL: [product.imageURL],
        price: [product.price, [Validators.required, Validators.min(0)]],
        availableQty: [
          product.availableQty,
          [Validators.required, Validators.min(0)],
        ],
      });
    }
    return this.formBuilder.group({
      id: [product.id],
      name: [product.name],
      imageURL: [product.imageURL],
      price: [product.price],
      availableQty: [product.availableQty],
      selectedQty: [
        0,
        [Validators.min(0), Validators.max(product.availableQty)],
      ],
    });
  }

  get productsFormArray(): FormArray {
    return this._dataStore.productsFormGroup.get(
      'productsFormArray'
    ) as FormArray;
  }

  addItem(index) {
    const selectQtyCtrl = this._dataStore.productsFormGroup
      .get('productsFormArray')
      .get(index.toString())
      .get('selectedQty');
    selectQtyCtrl.markAsTouched();
    selectQtyCtrl.setValue(selectQtyCtrl.value + 1);
  }

  removeItem(index) {
    const selectQtyCtrl = this._dataStore.productsFormGroup
      .get('productsFormArray')
      .get(index.toString())
      .get('selectedQty');
    selectQtyCtrl.markAsTouched();
    if (selectQtyCtrl.value === 0) {
      return;
    }
    this._dataStore.cartQty;
    selectQtyCtrl.setValue(selectQtyCtrl.value - 1);
  }

  checkout() {
    if (this._dataStore.productsFormGroup.invalid) {
      this._dataStore.openSnackBar('Please change qty to proceed!');
      return;
    }
    this.router.navigate(['/checkout']);
  }

  // admin methods
  saveAdminUpdates() {
    if (this.productsFormArray.invalid) {
      Object.keys(this.productsFormArray.controls).forEach((formInd) => {
        const FormArrayElement = this.productsFormArray.get(
          formInd.toString()
        ) as FormGroup;
        Object.keys(FormArrayElement.controls).forEach((ctrlKey) => {
          FormArrayElement.get(ctrlKey).markAsTouched();
        });
      });
      this._dataStore.openSnackBar('Please fix errors before proceeding!');
      return;
    }
    // in real scenario this would be an api call, here datastore is service so updating the same
    this._dataStore.productList = this.productsFormArray.value;
    this._dataStore.openSnackBar('Changes Saved Successfully!');
    this.router.navigate(['/products']);
  }

  addProduct() {
    const newProdGrp = this.createProductFormGroup({
      id: Math.random(), // can apply any timestamp related logic or get from db when saving in real scenario
      name: '',
      imageURL: 'assets/product.jpg',
      price: 0,
      availableQty: 0,
    });
    this.productsFormArray.push(newProdGrp);
  }

  deleteItem(index) {
    this.productsFormArray.removeAt(index);
  }
}
