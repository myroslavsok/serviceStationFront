import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { crudDBService } from '../../shared/services/crudDB.service';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.scss']
})
export class SearchClientComponent implements OnInit {

  constructor(
    private crudDBService: crudDBService,
    private snackBar: MatSnackBar
  ) {}

  clients = [];

  ngOnInit() {
    this.crudDBService.getClientsArr(() => {
      this.clients = this.crudDBService.clients;
      console.log('clients', this.clients);
    });
  }

  deleteClient(key) {
    this.crudDBService.deleteClient(key);
    this.snackBar.open('Успішно видалено', 'Зрозуміло', {
        duration: 2000,
      });
  }

}
