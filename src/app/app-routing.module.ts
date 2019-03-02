import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// components
import { AddClientComponent } from './components/add-client/add-client.component';
import { SearchClientComponent } from './components/search-client/search-client.component';

const routes: Routes = [
  { path: 'add-client', component: AddClientComponent },
  { path: 'search-clients', component: SearchClientComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
