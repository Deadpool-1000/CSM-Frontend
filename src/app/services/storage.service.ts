import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setItemToStorage(item: string, value: string){
    sessionStorage.setItem(item, value);
  }

  getItemFromStorage(item: string){
    return sessionStorage.getItem(item);
  }

  clear(){
    sessionStorage.clear()
  }
}
