import { Component, OnInit } from '@angular/core';
import { FormControl} from '@angular/forms';

import { crudDBService } from '../../shared/services/crudDB.service';

@Component({
  selector: 'app-search-client',
  templateUrl: './search-client.component.html',
  styleUrls: ['./search-client.component.scss']
})
export class SearchClientComponent implements OnInit {

  constructor(private crudDBService: crudDBService) {
  }

  clients = []

  ngOnInit() {
    this.crudDBService.getClientsArr(() => {
      this.clients = this.crudDBService.clients;
      console.log('clients', this.clients);
    });
  }

  

}
