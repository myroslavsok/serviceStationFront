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

  orders = [];

  searchValue = {
    carInfo: {
      vinCode: ''
    }
  };

  ngOnInit() {
    try {
      this.crudDBService
        .getOrders()
        .subscribe(resp => {
          console.log('get response', resp);
          this.orders = resp;
        });
    } catch(err) {
      alert('Error');
      console.log('Caught error', err);
    }
  }

  changeStatusOfOrder(key) {
    this.crudDBService
    .closeOrder(key)
    .subscribe(resp => console.log('close resp', resp));
    // this.crudDBService.deleteClient(key);
    // this.snackBar.open('Замовлення успішно видалено', 'Зрозуміло', {
    //     duration: 2000,
    // });
  }

}
