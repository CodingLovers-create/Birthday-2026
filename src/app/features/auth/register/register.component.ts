import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PageHeaderComponent } from '../../../shared/page-header/page-header.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, PageHeaderComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);

  registerForm!: FormGroup;
  submitted = false;

  readonly statesList: string[] = [
    'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 
    'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal'
  ];

  readonly constituenciesMap: Record<string, string[]> = {
    'Delhi': ['New Delhi', 'Chandni Chowk', 'East Delhi', 'North East Delhi', 'South Delhi'],
    'Gujarat': ['Varanasi', 'Gandhinagar', 'Ahmedabad East', 'Ahmedabad West', 'Surat'],
    'Uttar Pradesh': ['Varanasi', 'Lucknow', 'Gorakhpur', 'Agra', 'Kanpur'],
    'Maharashtra': ['Mumbai South', 'Mumbai North', 'Pune', 'Nagpur', 'Thane'],
    'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer']
  };

  availableConstituencies: string[] = ['New Delhi', 'Chandni Chowk', 'East Delhi', 'North East Delhi', 'South Delhi'];

  ngOnInit(): void {
    const draft = this.authService.getDraftForm();

    this.registerForm = this.fb.group({
      username: [draft?.username || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      state: [draft?.state || 'Delhi', [Validators.required]],
      constituency: [draft?.constituency || 'New Delhi', [Validators.required]],
      mobile: [draft?.mobile || '', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]]
    });

    this.onStateChange(this.registerForm.get('state')?.value);

    this.registerForm.get('state')?.valueChanges.subscribe((selectedState: string) => {
      this.onStateChange(selectedState);
    });
  }

  onStateChange(stateName: string): void {
    const list = this.constituenciesMap[stateName];
    if (list && list.length > 0) {
      this.availableConstituencies = list;
      if (!list.includes(this.registerForm.get('constituency')?.value)) {
        this.registerForm.patchValue({ constituency: list[0] });
      }
    } else {
      this.availableConstituencies = ['Central Constituency', 'North Constituency', 'South Constituency', 'East Constituency'];
      this.registerForm.patchValue({ constituency: this.availableConstituencies[0] });
    }
  }

  get f() {
    return this.registerForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const formVal = this.registerForm.value;
    this.authService.saveDraftForm({
      username: formVal.username.trim(),
      state: formVal.state,
      constituency: formVal.constituency,
      mobile: formVal.mobile.trim()
    });

    this.router.navigate(['/otp']);
  }
}
