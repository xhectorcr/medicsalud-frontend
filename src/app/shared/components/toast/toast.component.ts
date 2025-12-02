import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-overlay" *ngIf="(toasts$ | async)?.length">
      <div class="toast-container">
        <div *ngFor="let toast of toasts$ | async" 
             class="toast" 
             [ngClass]="toast.type">
          <span class="message">{{ toast.message }}</span>
          <span class="close" (click)="remove(toast.id)">&times;</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .toast-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
      display: flex;
      justify-content: center;
      align-items: center;
      animation: fadeIn 0.2s ease-out;
    }

    .toast-container {
      position: relative;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .toast {
      min-width: 300px;
      max-width: 400px;
      padding: 20px 25px;
      border-radius: 12px;
      color: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.2);
      display: flex;
      justify-content: space-between;
      align-items: center;
      animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      cursor: default;
      font-family: 'Inter', sans-serif;
    }

    .toast.success { background-color: #10B981; }
    .toast.error { background-color: #EF4444; }
    .toast.info { background-color: #3B82F6; }

    .message {
      font-size: 16px;
      font-weight: 500;
      text-align: center;
      flex-grow: 1;
    }

    .close {
      font-size: 24px;
      margin-left: 15px;
      opacity: 0.8;
      cursor: pointer;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes popIn {
      from { transform: scale(0.8); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
  `]
})
export class ToastComponent {
  toasts$;

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.toasts$;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}
