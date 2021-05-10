import { CheckoutRoutingModule } from './checkout-routing.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CheckoutListComponent } from './checkout-list/checkout-list.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CheckoutListComponent],
  imports: [
    CommonModule,
    CheckoutRoutingModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class CheckoutModule {}
