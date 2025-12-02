import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
    message: string;
    type: 'success' | 'error' | 'info';
    id: number;
}

@Injectable({
    providedIn: 'root'
})
export class ToastService {
    private toastsSubject = new BehaviorSubject<Toast[]>([]);
    toasts$ = this.toastsSubject.asObservable();
    private counter = 0;

    show(message: string, type: 'success' | 'error' | 'info' = 'info') {
        const currentToasts = this.toastsSubject.value;
        const id = this.counter++;
        const newToast: Toast = { message, type, id };

        this.toastsSubject.next([...currentToasts, newToast]);

        // Auto remove after 3 seconds
        setTimeout(() => {
            this.remove(id);
        }, 3000);
    }

    remove(id: number) {
        const currentToasts = this.toastsSubject.value;
        this.toastsSubject.next(currentToasts.filter(t => t.id !== id));
    }
}
