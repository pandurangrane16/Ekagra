import { Component ,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { KeycloakService } from '../../services/common/keycloak.service'; // adjust path
import { UserprofileModel } from '../../models/admin/userprofile.model';
import { Globals } from '../../utils/global'; 
@Component({
  selector: 'app-user-profile',
  imports: [CommonModule, FormsModule],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
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

  constructor(private profileService: KeycloakService,private globals: Globals) {}

  ngOnInit(): void {
     if (!this.globals.user) {
    const storedUser = sessionStorage.getItem('userInfo');
    if (storedUser) {
      this.globals.user = JSON.parse(storedUser);
      console.log('✅ User restored from sessionStorage:', this.globals.user);
    }
  }

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

  // saveProfile() {
  //   this.successMsg = '';
  //   this.errorMsg = '';

  //   this.profileService.updateProfile(this.profile).subscribe({
  //     next: () => {
  //       this.successMsg = 'Profile updated successfully';
  //     },
  //     error: (err) => {
  //       console.error(err);
  //       this.errorMsg = 'Failed to update profile ('+err.error.errorMessage+')' ;
  //     }
  //   });

    
  // }

  saveProfile() {
    this.successMsg = '';
    this.errorMsg = '';
    this.loading = true;

    const storedUserRaw = sessionStorage.getItem('userInfo');
    let parsedUser: any = null;
    try {
      parsedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
    } catch (e) {
      parsedUser = null;
    }
console.log(this.globals,"Globals in saveProfile");
    const currentUserId = this.globals.user?.id || parsedUser?.id || parsedUser?.userId || 0;
    console.log('Current User ID (from globals/sessionStorage):', currentUserId, parsedUser);
  // 1️⃣ Update Keycloak profile first
  this.profileService.updateProfile(this.profile).subscribe({
    next: () => {

      // 2️⃣ After Keycloak success → update ABP user
      const abpPayload = {
        userId: currentUserId,
        name: this.profile.firstName,
        surname: this.profile.lastName,
        emailAddress: this.profile.email,
        phoneNumber: this.mobile
      };
console.log(abpPayload,"ABP Payload");  
      this.profileService.updateAbpUser(abpPayload).subscribe({
        next: () => {
          this.successMsg = 'Profile updated successfully';
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.errorMsg = 'Keycloak updated but ABP update failed';
          this.loading = false;
        }
      });
    },
    error: (err) => {
      console.error(err);
      this.errorMsg = 'Failed to update Keycloak profile'+(err.error.errorMessage ? ' ('+err.error.errorMessage+')' : '');
      this.loading = false;
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
