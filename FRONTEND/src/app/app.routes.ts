import { Routes } from '@angular/router';
import { CatalogComponent } from '../components/catalog/catalog.component';
import { AccountFormComponent } from '../components/account-form/account-form.component';
import { AccountDetailComponent } from '../components/account-detail/account-detail.component';
import { CartComponent } from '../components/cart/cart.component';
import { CheckoutComponent } from '../components/checkout/checkout.component';
import { LoginComponent } from '../components/login/login.component';
import { RegisterComponent } from '../components/register/register.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'catalog', component: CatalogComponent },
  { path: 'account-form', component: AccountFormComponent },
  { path: 'account-detail', component: AccountDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'register', component: RegisterComponent },
  { path: '**', redirectTo: '' }
];