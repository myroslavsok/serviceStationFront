import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { AddClientComponent } from './components/add-client/add-client.component';
import { SearchClientComponent } from './components/search-client/search-client.component';

const routes: Routes = [
  { path: '', redirectTo: 'add-client', pathMatch: 'full' },
  { path: 'add-client', component: AddClientComponent },
  { path: 'search-clients', component: SearchClientComponent },
  { path: '**', redirectTo: 'add-client', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
