import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  
import { Observable } from 'rxjs';
import { DataService } from './services/data.service'; 
import { Market } from './models/market.model';
import { NgIf, NgFor, CommonModule } from '@angular/common';


// Bootstrap'ı global olarak tanımlıyoruz
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NgIf, NgFor]  
})
export class AppComponent implements OnInit {
  markets$: Observable<Market[]> = new Observable(); 
  searchQuery: string = ''; 
  exchangeRates: any;
  selectedReyonType: string = '';  
  selectedMarketId: string = '';  
  productId: string = '';  
  productName: string = '';  
  selectedReyonId: string = '';
  reyonlar: any[] = []; 

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.markets$ = this.dataService.getMarkets(); 
    this.getExchangeRates(); 
  }

  getExchangeRates() {
    this.exchangeRates = this.dataService.getExchangeRates();
  }

  // Reyon Modal'ı açma işlemi
  openReyonModal(marketId: string) {
    this.selectedMarketId = marketId;
    const offcanvasElement = document.getElementById('offcanvasReyonEkle');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  // Ürün Modal'ı açma işlemi
  openProductModal(marketId: string, reyonId: string) {
    this.selectedMarketId = marketId;
    this.selectedReyonId = reyonId;
    const offcanvasElement = document.getElementById('offcanvasUrunEkle');
    const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
    offcanvas.show();
  }

  // Ürün ekleme işlemi
  onAddProduct() {
    if (this.productId && this.productName && this.selectedMarketId && this.selectedReyonId) {
      this.dataService.getMarkets().subscribe((markets) => {
        const selectedMarket = markets.find(market => market.id === this.selectedMarketId);
        if (selectedMarket) {
          const selectedReyon = selectedMarket.reyonlar.find(reyon => reyon.id === this.selectedReyonId);
          if (selectedReyon) {
            // Mevcut ürünlerin arasında aynı ID'ye sahip bir ürün olup olmadığını kontrol ediyoruz
            const existingProduct = selectedReyon.products.find(product => product.id === this.productId);
            if (!existingProduct) {
              // Reyonun tipini alıyoruz
              const reyonType = selectedReyon.type;
  
              // Ürünü reyonun tipine göre ekliyoruz
              this.dataService.addProduct(this.selectedMarketId, this.selectedReyonId, {
                id: this.productId,
                name: this.productName,
                type: reyonType  // Reyonun tipine göre ekleme yapıyoruz
              }).subscribe(() => {
                console.log(`Ürün Eklendi: ${this.productName}, Reyon Türü: ${reyonType}`);
                this.clearProductForm();
              });
            } else {
              console.warn(`Bu ID'ye sahip bir ürün zaten mevcut: ${this.productId}`);
            }
          }
        }
      });
    }
  }

  // Ürün formunu temizleme ve modalı kapatma işlemi
  clearProductForm() {
    this.productId = '';
    this.productName = '';
    this.selectedReyonId = '';
    const modalElement = document.getElementById('productModal');
    if (modalElement) {
      const productModal = new bootstrap.Modal(modalElement);
      productModal.hide();
    }
  }

  // Reyon ekleme işlemi
  onAddReyon() {
    if (this.selectedReyonType && this.selectedMarketId) {
      this.dataService.addReyon(this.selectedMarketId, this.selectedReyonType).subscribe(() => {
        console.log(`Reyon Eklendi: ${this.selectedReyonType}`);
        this.clearReyonForm();
      });
    }
  }

  // Reyon formunu temizleme ve modalı kapatma işlemi
  clearReyonForm() {
    this.selectedReyonType = '';
    this.selectedMarketId = '';
    const modalElement = document.getElementById('reyonModal');
    if (modalElement) {
      const reyonModal = new bootstrap.Modal(modalElement);
      reyonModal.hide();
    }
  }

  // Ürün arama işlemi
  searchProduct() {
    if (this.searchQuery.length > 0) {
      this.markets$ = this.dataService.searchProduct(this.searchQuery);
    } else {
      // Arama kutusu boşsa tüm marketleri göster
      this.markets$ = this.dataService.getMarkets();
    }
  }

  // Ürün silme işlemi
  deleteProduct(marketId: string, reyonId: string, productId: string) {
    this.dataService.deleteProduct(marketId, reyonId, productId).subscribe(() => {
      console.log(`Ürün silindi: ${productId}`);
    });
  }

  // Reyon silme işlemi
  deleteReyon(marketId: string, reyonId: string) {
    this.dataService.deleteReyon(marketId, reyonId).subscribe(() => {
      console.log(`Reyon silindi: ${reyonId}`);
    });
  }
}