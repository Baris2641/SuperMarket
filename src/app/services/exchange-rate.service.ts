import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ExchangeRateService {
  private apiUrl = 'https://api.frankfurter.app/latest?from=EUR';  // Döviz API URL

  constructor(private http: HttpClient) {}

  // Döviz kurlarını almak için API çağrısı
  getExchangeRates(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // Her 30 saniyede bir API'den yeni döviz kurlarını almak için interval kullanıyoruz
  getRatesWithAutoRefresh(): Observable<any> {
    return interval(30000).pipe(
      switchMap(() => this.getExchangeRates())
    );
  }
}
