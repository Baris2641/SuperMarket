import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { DataService } from './services/data.service';
import { Market } from './models/market.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgIf, NgFor, CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

// Bootstrap'ı global olarak tanımlıyoruz
declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule, NgIf, NgFor]
})
export class AppComponent implements OnInit {
  markets$: Observable<Market[]> = of([]); // Başlangıçta boş bir observable
  searchQuery: string = '';
  selectedReyonType: string = '';
  selectedMarketId: string = '1';
  productId: string = '';
  productName: string = '';
  selectedReyonId: string = '';

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.markets$ = this.dataService.getMarkets();
  }



  searchProduct() {
    if (this.searchQuery.length > 0) {
      this.markets$ = this.dataService.searchProduct(this.searchQuery);
    } else {
      this.markets$ = this.dataService.getMarkets();
    }
  }

  openProductModal(marketId: string, reyonId: string) {
    this.selectedMarketId = marketId;
    this.selectedReyonId = reyonId;
    const modalElement = document.getElementById('offcanvasUrunEkle') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement, { backdrop: false, keyboard: false });
    modal.show();
  }

  openReyonModal(marketId: string) {
    this.selectedMarketId = marketId;
    const modalElement = document.getElementById('offcanvasReyonEkle') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement, { backdrop: false, keyboard: false });
    modal.show();
  }
  // Ürün ekleme işlemi
  onAddProduct() {
    console.log(this);
    if (this.productId && this.productName && this.selectedMarketId && this.selectedReyonId) {
      this.dataService.addProduct(this.selectedMarketId, this.selectedReyonId, {
        id: this.productId,
        name: this.productName,
        type: this.selectedReyonType
      }).subscribe({
        next: () => {
          console.log(`Ürün Eklendi: ${this.productName}`);
          this.clearProductForm();
        },
        error: (err) => {
          console.error('Ürün eklenirken hata:', err);
        }
      });
    }
  }
  onAddProductModal() {
    const modalElement = document.getElementById('offcanvasUrunEkleOne');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: true, // Modalın arka planı (backdrop)
        keyboard: true, // Escape tuşu ile kapatılabilir
      });
      modal.show();
    } else {
      console.error('Modal bulunamadı!');
    }

    document.querySelectorAll('.modal-backdrop.fade.show').forEach(function (element) {
      element.remove();
    });
  }

  // Ürün formunu temizleme ve modalı kapatma işlemi
  clearProductForm() {
    this.productId = '';
    this.productName = '';
    const modalElement = document.getElementById('offcanvasUrunEkle') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.hide();
  }

  // Reyon ekleme işlemi
  onAddReyon() {
    if (this.selectedReyonType && this.selectedMarketId) {
      this.dataService.addReyon(this.selectedMarketId, this.selectedReyonType).subscribe({
        next: () => {
          console.log(`Reyon Eklendi: ${this.selectedReyonType}`);
          this.clearReyonForm();
        },
        error: (err) => {
          console.error('Reyon eklenirken hata:', err);
        }
      });
    }
  }

  onAddReyonModal() {
    const modalElement = document.getElementById('offcanvasReyonEkleOne');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement, {
        backdrop: true, // Modalın arka planı (backdrop)
        keyboard: true, // Escape tuşu ile kapatılabilir
      });
      modal.show();
    } else {
      console.error('Modal bulunamadı!');
    }

    document.querySelectorAll('.modal-backdrop.fade.show').forEach(function (element) {
      element.remove();
    });
  }

  // Reyon formunu temizleme ve modalı kapatma işlemi
  clearReyonForm() {
    this.selectedReyonType = '';
    const modalElement = document.getElementById('offcanvasReyonEkle') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.hide();
  }
  closeModal() {
    const modalElement = document.getElementById('productModal') as HTMLElement;
    const modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
      modal.hide();  // Modal'ı gizle
    }
  }

  // Reyon silme işlemi
  deleteReyon(marketId: string, reyonId: string) {
    this.dataService.deleteReyon(marketId, reyonId).subscribe({
      next: () => {
        console.log(`Reyon silindi: ${reyonId}`);
      },
      error: (err) => {
        console.error('Reyon silinirken hata:', err);
      }
    });
  }

  // Ürün silme işlemi
  deleteProduct(marketId: string, reyonId: string, productId: string) {
    this.dataService.deleteProduct(marketId, reyonId, productId).subscribe(() => {
      console.log(`Ürün silindi: ${productId}`);
    });
  }

}
