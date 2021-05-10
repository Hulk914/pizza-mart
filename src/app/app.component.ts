import { DataStoreService } from './data-store.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'pizza-mart';
  constructor(public _dataStore: DataStoreService, private router: Router) {}

  checkout() {
    if (this._dataStore.productsFormGroup.invalid) {
      this._dataStore.openSnackBar('Please change qty to proceed!');
      return;
    }
    this.router.navigate(['/checkout']);
  }
}
