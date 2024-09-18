import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Market } from '../models/market.model';
import { Product } from '../models/product.model';
import { Reyon } from '../models/reyon.model';
import { HttpClientModule } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private marketsSubject = new BehaviorSubject<Market[]>([
    {
      id: '1',
      name: 'Market A',
      reyonlar: [
        { id: 'R1', name: 'R1', type: 'Gıda', products: [{ id: '1', name: 'Pirinç', type: 'Gıda' }] },
        { id: 'R2', name: 'R2', type: 'Temizlik', products: [{ id: '2', name: 'Bez', type: 'Temizlik' }] }
      ]
    },
    {
      id: '2',
      name: 'Market B',
      reyonlar: [
        { id: 'R1', name: 'R1', type: 'Gıda', products: [{ id: '3', name: 'Ekmek', type: 'Gıda' }] }
      ]
    }
  ]);

  getMarkets(): Observable<Market[]> {
    return this.marketsSubject.asObservable();
  }

  deleteProduct(marketId: string, reyonId: string, productId: string): Observable<void> {
    const currentMarkets = this.marketsSubject.value;
    const market = currentMarkets.find(m => m.id === marketId);
    
    if (market) {
      const reyon = market.reyonlar.find(r => r.id === reyonId);
      
      if (reyon) {
        // Ürünü reyondan sil
        reyon.products = reyon.products.filter(p => p.id !== productId);
        this.updateMarkets(currentMarkets); // Güncellenen marketleri kaydet
      }
    }
    return of();
  }

  addProduct(marketId: string, reyonId: string, newProduct: Product): Observable<void> {
    const currentMarkets = this.marketsSubject.value;
    const market = currentMarkets.find(m => m.id === marketId);
    if (market) {
      const reyon = market.reyonlar.find(r => r.id === reyonId);
      if (reyon) {
        // Ürün ekleniyor
        reyon.products.push(newProduct);
        this.updateMarkets(currentMarkets);
      }
    }
    return of();  // Observable döndürmemiz gerekiyor
  }

 addReyon(marketId: string, reyonType: string): Observable<void> {
  const currentMarkets = this.marketsSubject.value;
  const market = currentMarkets.find(m => m.id === marketId);
  if (market) {
    const newReyonId = `R${market.reyonlar.length + 1}`;
    const newReyon = {
      id: newReyonId,
      name: newReyonId,
      type: reyonType,
      products: []
    };
    market.reyonlar.push(newReyon);
    this.updateMarkets(currentMarkets);
  }
  return of(); // Observable dön
}

  deleteReyon(marketId: string, reyonId: string): Observable<void> {
    const currentMarkets = this.marketsSubject.value;
    const market = currentMarkets.find(m => m.id === marketId);
    if (market) {
      market.reyonlar = market.reyonlar.filter(r => r.id !== reyonId);
      this.updateMarkets(currentMarkets);
    }
    return of(); 
  }

  getExchangeRates() {
    return {
      USDTRY: '33.7870',
      EURTRY: '37.6571'
    };
  }

  searchProduct(query: string): Observable<Market[]> {
    const currentMarkets = this.marketsSubject.value;
    const filteredMarkets = currentMarkets.map(market => ({
      ...market,
      reyonlar: market.reyonlar.map(reyon => ({
        ...reyon,
        products: reyon.products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      })).filter(reyon => reyon.products.length > 0)
    })).filter(market => market.reyonlar.length > 0);
  
    return of(filteredMarkets);
  }

  updateMarkets(updatedMarkets: Market[]): void {
    this.marketsSubject.next(updatedMarkets);
  }
}
