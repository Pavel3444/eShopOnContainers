import { Component, OnInit }    from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { catchError }           from 'rxjs/operators';

import { CatalogService }       from './catalog.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { ICatalog }             from '../shared/models/catalog.model';
import { ICatalogItem }         from '../shared/models/catalogItem.model';
import { ICatalogType }         from '../shared/models/catalogType.model';
import { ICatalogBrand }        from '../shared/models/catalogBrand.model';
import { IPager }               from '../shared/models/pager.model';
import { BasketWrapperService}  from '../shared/services/basket.wrapper.service';
import { SecurityService }      from '../shared/services/security.service';

@Component({
    selector: 'esh-catalog .esh-catalog .mb-5',
    styleUrls: ['./catalog.component.scss'],
    templateUrl: './catalog.component.html'
})
export class CatalogComponent implements OnInit {
    brands: ICatalogBrand[];
    types: ICatalogType[];
    catalog: ICatalog;
    brandSelected: number;
    typeSelected: number;
    paginationInfo: IPager;
    authenticated: boolean = false;
    authSubscription: Subscription;
    errorReceived: boolean;
    minPriceFilter: number | null = null;
    maxPriceFilter: number | null = null;
    countryCode: string | null = null; 

    constructor(private service: CatalogService, private basketService: BasketWrapperService, private configurationService: ConfigurationService, private securityService: SecurityService) {
        this.authenticated = securityService.IsAuthorized;
    }

    ngOnInit() {

        // Configuration Settings:
        if (this.configurationService.isReady) 
            this.loadData();
        else
            this.configurationService.settingsLoaded$.subscribe(x => {
                this.loadData();
            });

        // Subscribe to login and logout observable
        this.authSubscription = this.securityService.authenticationChallenge$.subscribe(res => {
            this.authenticated = res;
        });
    }

    loadData() {
        this.getBrands();
        this.getCatalog(12, 0);
        this.getTypes();
    }

    onFilterApplied(event: any) {
        event.preventDefault();
        
        this.brandSelected = this.brandSelected && this.brandSelected.toString() != "null" ? this.brandSelected : null;
        this.typeSelected = this.typeSelected && this.typeSelected.toString() != "null" ? this.typeSelected : null;
        this.minPriceFilter = this.minPriceFilter && this.minPriceFilter.toString() !== "null" ? this.minPriceFilter : null;
        this.maxPriceFilter = this.maxPriceFilter  && this.maxPriceFilter.toString() !== "null" ? this.maxPriceFilter : null;
        this.countryCode = this.countryCode  && this.countryCode.toString() !== "null" ? this.countryCode : null;
        this.paginationInfo.actualPage = 0;
        this.getCatalog(this.paginationInfo.itemsPage, this.paginationInfo.actualPage, this.brandSelected, this.typeSelected, this.minPriceFilter, this.maxPriceFilter, this.countryCode);
    }

    onBrandFilterChanged(event: any, value: number) {
        event.preventDefault();
        this.brandSelected = value;
    }

    onTypeFilterChanged(event: any, value: number) {
        event.preventDefault();
        this.typeSelected = value;
    }
    onInputPriceValidate(event: any) {
        
        let value: string = event.target.value;
        
        value = value.replace(/[^0-9.]/g, '');

        const firstDotIndex = value.indexOf('.');
        
        if (firstDotIndex !== -1) {
            value = value.substring(0, firstDotIndex + 1) + value.substring(firstDotIndex + 1).replace(/\./g, '');
            const parts = value.split('.');
            if (parts[1] && parts[1].length > 2) {
                parts[1] = parts[1].substring(0, 2);
                value = parts.join('.');
            }
        }
        
        return value ? parseFloat(value) : null;
    }
    
    onMinPriceChanged(event: any): void {
        const res = this.onInputPriceValidate(event);
        
        event.target.value = res;
        this.minPriceFilter = res;
    }
    
    onMaxPriceChanged(event: any): void {
        const res = this.onInputPriceValidate(event);
        
        event.target.value = res;
        this.maxPriceFilter =res;
    }
    
    onCountryChanged(event:any): void {
        this.countryCode = event.target.value;
    }
    
    onPageChanged(value: any) {
        console.log('catalog pager event fired' + value);
        event.preventDefault();
        this.paginationInfo.actualPage = value;
        this.getCatalog(this.paginationInfo.itemsPage, value);
    }

    addToCart(item: ICatalogItem) {
        if (!this.authenticated) {
            return;
        }
        this.basketService.addItemToBasket(item);
    }

    getCatalog(pageSize: number, pageIndex: number, brand?: number, type?: number, minPrice?: number, maxPrice?: number, countryCode?: string) {
        this.errorReceived = false;
        this.service.getCatalog(pageIndex, pageSize, brand, type, minPrice, maxPrice, countryCode)
            .pipe(catchError((err) => this.handleError(err)))
            .subscribe(catalog => {
                this.catalog = catalog;
                this.paginationInfo = {
                    actualPage : catalog.pageIndex,
                    itemsPage : catalog.pageSize,
                    totalItems : catalog.count,
                    totalPages: Math.ceil(catalog.count / catalog.pageSize),
                    items: catalog.pageSize
                };
        });
    }

    getTypes() {
        this.service.getTypes().subscribe(types => {
            this.types = types;
            let alltypes = { id: null, type: 'All' };
            this.types.unshift(alltypes);
        });
    }

    getBrands() {
        this.service.getBrands().subscribe(brands => {
            this.brands = brands;
            let allBrands = { id: null, brand: 'All' };
            this.brands.unshift(allBrands);
        });
    }

    private handleError(error: any) {
        this.errorReceived = true;
        return Observable.throw(error);
    }
}

