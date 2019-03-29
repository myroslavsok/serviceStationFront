import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { AddClientComponent } from './components/add-client/add-client.component';
import { SearchClientComponent } from './components/search-client/search-client.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  // { path: '', redirectTo: 'add-client', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'add-client', component: AddClientComponent },
  { path: 'search-clients', component: SearchClientComponent },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
