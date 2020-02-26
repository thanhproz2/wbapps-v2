import { Injectable } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, ActivatedRouteSnapshot, Params, PRIMARY_OUTLET } from "@angular/router";

export interface IRoutePart {
  title: string,
  breadcrumb: string,
  params?: Params,
  url: string,
  urlSegments: any[]
}

@Injectable({
  providedIn: 'root'
})
export class RoutePartsService {
  public routeParts: IRoutePart[];
  constructor(private router: Router) {};

  generateRouteParts(snapshot: ActivatedRouteSnapshot): IRoutePart[] {
    var routeParts = <IRoutePart[]>[];
    if (snapshot) {
      if (snapshot.firstChild) {
        routeParts = routeParts.concat(this.generateRouteParts(snapshot.firstChild));
      }
      if (snapshot.url.length) {
        routeParts.push({
          title: snapshot.data['title'], 
          breadcrumb: snapshot.data['breadcrumb'], 
          url: snapshot.url[0].path,
          urlSegments: snapshot.url,
          params: snapshot.params
        });
      }
    }
    return routeParts;
  }
}