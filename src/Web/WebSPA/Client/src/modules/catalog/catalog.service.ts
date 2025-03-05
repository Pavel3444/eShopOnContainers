import { Injectable } from '@angular/core';

import { DataService } from '../shared/services/data.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ICatalog } from '../shared/models/catalog.model';
import { ICatalogBrand } from '../shared/models/catalogBrand.model';
import { ICatalogType } from '../shared/models/catalogType.model';

import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CatalogService {
    private catalogUrl: string = '';
    private brandUrl: string = '';
    private typesUrl: string = '';
  
    constructor(private service: DataService, private configurationService: ConfigurationService) {
        this.configurationService.settingsLoaded$.subscribe(x => {
            this.catalogUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/items';
            this.brandUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/catalogbrands';
            this.typesUrl = this.configurationService.serverSettings.purchaseUrl + '/c/api/v1/catalog/catalogtypes';
        });
    }

    getCatalog(pageIndex: number, pageSize: number, brand: number, type: number, minPrice: number, maxPrice: number, countryCode: string): Observable<ICatalog> {
        let url = `${this.catalogUrl}?pageIndex=${pageIndex}&pageSize=${pageSize}`;
        
        let params = {
            pageIndex,
            pageSize,
        };
        
        if (brand) {
            url += `&catalogBrandId=${brand}`;
        }
        
        if (type) {
            url += `&catalogTypeId=${type}`;
        }
        
        if (minPrice != null) {
            url += `&minPrice=${minPrice}`;
        }
        
        if (maxPrice != null) {
            url += `&maxPrice=${maxPrice}`;
        }
        
        if (countryCode != null) {
            url += `&countryCode=${countryCode}`;
        }
        
        return this.service.get(url, params).pipe<ICatalog>(tap((response: any) => {
            return response;
        }));
    }

    getBrands(): Observable<ICatalogBrand[]> {
        return this.service.get(this.brandUrl).pipe<ICatalogBrand[]>(tap((response: any) => {
            return response;
        }));
    }

    getTypes(): Observable<ICatalogType[]> {
        return this.service.get(this.typesUrl).pipe<ICatalogType[]>(tap((response: any) => {
            return response;
        }));
    };
}
