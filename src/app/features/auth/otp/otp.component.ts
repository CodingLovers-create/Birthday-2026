import { Component, ElementRef, OnInit, AfterViewInit, QueryList, ViewChildren, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, PageHeaderComponent],
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.scss']
})
export class OtpComponent implements OnInit, AfterViewInit {
  private router = inject(Router);
  private authService = inject(AuthService);

  @ViewChildren('otpInput') otpInputs!: QueryList<ElementRef<HTMLInputElement>>;

  otpDigits: string[] = ['', '', '', ''];
  errorMessage: string = '';
  isVerifying: boolean = false;
  userMobile: string = '';

  ngOnInit(): void {
    const draft = this.authService.getDraftForm();
    if (draft && draft.mobile) {
      const mob = draft.mobile;
      this.userMobile = mob.length >= 10 ? `+91 ${mob.substring(0, 2)}******${mob.substring(8)}` : mob;
    } else {
      this.userMobile = '+91 Mobile Number';
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      const firstInput = this.otpInputs?.first?.nativeElement;
      if (firstInput) {
        firstInput.focus();
      }
    }, 100);
  }

  trackByIndex(index: number): number {
    return index;
  }

  onDigitInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ''); // keep only numeric digits

    if (value.length > 1) {
      value = value.charAt(value.length - 1);
    }

    input.value = value;
    this.otpDigits[index] = value;
    this.errorMessage = '';

    // Auto-advance to next field if typed
    if (value && index < 3) {
      const inputArray = this.otpInputs.toArray();
      if (inputArray[index + 1]) {
        inputArray[index + 1].nativeElement.focus();
        inputArray[index + 1].nativeElement.select();
      }
    }
  }

  onKeyDown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace') {
      if (!this.otpDigits[index] && index > 0) {
        const inputArray = this.otpInputs.toArray();
        if (inputArray[index - 1]) {
          inputArray[index - 1].nativeElement.focus();
          inputArray[index - 1].nativeElement.select();
        }
      } else {
        this.otpDigits[index] = '';
      }
    }
  }

  onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    const pastedData = event.clipboardData?.getData('text') || '';
    const digits = pastedData.replace(/\D/g, '').substring(0, 4);

    if (digits) {
      for (let i = 0; i < 4; i++) {
        this.otpDigits[i] = digits[i] || '';
      }
      const inputArray = this.otpInputs.toArray();
      const focusIndex = Math.min(digits.length - 1, 3);
      if (inputArray[focusIndex]) {
        inputArray[focusIndex].nativeElement.focus();
      }
    }
  }

  verifyOtp(): void {
    const enteredOtp = this.otpDigits.join('');
    if (enteredOtp.length < 4) {
      this.errorMessage = 'Please enter complete 4-digit OTP code.';
      return;
    }

    this.isVerifying = true;
    this.errorMessage = '';

    setTimeout(() => {
      const isValid = this.authService.verifyOtp(enteredOtp);
      this.isVerifying = false;

      if (isValid) {
        this.router.navigate(['/banner-library']);
      } else {
        this.errorMessage = 'Invalid OTP code. Please enter the correct verification code.';
      }
    }, 400);
  }

  goBackToRegister(): void {
    this.router.navigate(['/register']);
  }
}
