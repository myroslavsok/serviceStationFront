import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//Models
import { Car } from '../models/car';
import { CarNgListElem } from '../models/carNgListElem';

@Injectable({
  providedIn: 'root'
})
export class crudDBService {

  constructor(private http: HttpClient) {}

  ordersUrl = 'http://localhost:8080/orders';
  clientsUrl = 'http://localhost:8080/clients';
  // tasksUrs = 'http://localhost:8080/tasks';

  // Order
  getOrders(): any {
    return this.http.get(this.ordersUrl);
  }

  addOrder(order) {
    return this.http.post(this.ordersUrl, order);
  }

  closeAndOpenOrder(key, status): any {
    return this.http.patch(`${this.ordersUrl}/close-open/order/${key}`, status);
  }

  // Client
  // addClient(client) {
  //   return this.http.post(this.clientsUrl, {
  //     name: client.name,
  //     phoneNumber: client.phoneNumber
  //   });
  // }

  

  // // Lists
  // getLists() {
  //   return this.http.get(this.listsUrl);
  // }

  // addList(listName) {
  //   return this.http.post(this.listsUrl, {
  //     name: listName,
  //     pin: false
  //   });
  // }

  // deleteList(targetList) {
  //   return this.http.delete(this.listsUrl + `/${targetList.id}`);
  // }

  // pinList(targetList) {
  //   return this.http.patch(this.listsUrl + `/${targetList.id}`, {
  //     name: targetList.name,
  //     pin: targetList.pin
  //   });
  // }

  // // Tasks
  // getTasksFromSelectedList(selectedListId) {
  //   return this.http.get(this.tasksUrs + `/list/${selectedListId}`);
  // }

  // addTaskToselectedList(body) {
  //   return this.http.post(this.tasksUrs, {
  //     listId: body.listId,
  //     name: body.name,
  //     done: false,
  //   });
  // }

  // deleteTaskFromSelectedList(targetTaskId) {
  //   return this.http.delete(this.tasksUrs + `/${targetTaskId}`);
  // }

  // changeTaskFields(targetTask) {
  //   console.log('change sevice', targetTask);
  //   return this.http.patch(this.tasksUrs, {
  //     id: targetTask.id,
  //     name: targetTask.name,
  //     done: targetTask.done,
  //     listId: targetTask.listId
  //   });
  // }

  private handleError(error) {
    console.log(error);
    alert('Помилка відправки-отримання інформації з серверу: ' +  error);
  }

}
