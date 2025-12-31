import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { KeycloakService } from '../../services/common/keycloak.service'; // adjust path
import { UserprofileModel } from '../../models/admin/userprofile.model';

@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
profile: UserprofileModel = {
    firstName: '',
    lastName: '',
    email: '',
    attributes: {
      mobile: ['']
    }
  };

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  loading = false;
  successMsg = '';
  errorMsg = '';
  passwordMsg = '';

  constructor(private profileService: KeycloakService) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile() {
    this.loading = true;
    this.profileService.getProfile().subscribe({
      next: (res) => {
        this.profile.firstName = res.firstName || '';
        this.profile.lastName = res.lastName || '';
        this.profile.email = res.email || '';
        this.profile.attributes.mobile =
          res.attributes?.mobile?.length ? res.attributes.mobile : [''];
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load profile';
        this.loading = false;
      }
    });
  }

  get mobile(): string {
    return this.profile.attributes.mobile[0];
  }

  set mobile(value: string) {
    this.profile.attributes.mobile[0] = value;
  }

  saveProfile() {
    this.successMsg = '';
    this.errorMsg = '';

    this.profileService.updateProfile(this.profile).subscribe({
      next: () => {
        this.successMsg = 'Profile updated successfully';
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to update profile';
      }
    });

    
  }
  changePassword() {
    this.passwordMsg = '';

    if (this.newPassword !== this.confirmPassword) {
      this.passwordMsg = 'New password and confirmation do not match';
      return;
    }

    // this.profileService.changePassword(
    //   this.currentPassword,
    //   this.newPassword
    // ).subscribe({
    //   next: () => {
    //     this.passwordMsg = 'Password changed successfully';
    //     this.currentPassword = '';
    //     this.newPassword = '';
    //     this.confirmPassword = '';
    //   },
    //   error: (err) => {
    //     console.error(err);
    //     this.passwordMsg = 'Failed to change password';
    //   }
    // });
  }
}
