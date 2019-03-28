import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('group') group: ElementRef;

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

  changeStatusOfOrder(key, status) {
    if (status === 'closed') {
      status = 'new';
    } else {
      status = 'closed'
    }
    this.crudDBService
    .closeAndOpenOrder(key, status)
    .subscribe(resp => {
      console.log('close resp', resp);
      this.orders.forEach(order => {
        if (order.key === key) {
          order.status = resp.status;
        }
      });      
    });
    // this.crudDBService.deleteClient(key);
    // this.snackBar.open('Замовлення успішно видалено', 'Зрозуміло', {
    //     duration: 2000,
    // });
  }

}
