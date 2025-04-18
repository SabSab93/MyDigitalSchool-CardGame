import { Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppModalService {
  openModal(viewContainerRef: ViewContainerRef, component: any) {
    return viewContainerRef.createComponent(component);
  }
}