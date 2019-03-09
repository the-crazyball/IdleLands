import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user$ = this.afAuth.user;

  public get authMethods() {
    return this.allAuth;
  }

  private allAuth = [
    { provider: auth.EmailAuthProvider,     name: 'Email',          type: 'password',     icon: 'mail' },
    { provider: auth.FacebookAuthProvider,  name: 'Facebook',       type: 'facebook.com', icon: 'logo-facebook' },
    { provider: auth.TwitterAuthProvider,   name: 'Twitter',        type: 'twitter.com',  icon: 'logo-twitter' },
    { provider: auth.GoogleAuthProvider,    name: 'Google',         type: 'google.com',   icon: 'logo-google' }
  ];

  constructor(
    private alertCtrl: AlertController,
    private afAuth: AngularFireAuth
  ) {}

  async login(provider): Promise<any> {
    return new Promise(async resolve => {

      if(provider === auth.EmailAuthProvider) {
        const alert = await this.alertCtrl.create({
          header: 'Email/Password Sync',
          subHeader: 'Enter your email and desired password to sync with here.',
          inputs: [
            {
              name: 'emailAddress',
              type: 'email',
              placeholder: 'Email Address'
            },
            {
              name: 'password',
              type: 'password',
              placeholder: '********'
            }
          ],
          buttons: [
            'Cancel',
            {
              text: 'Sign In',
              handler: async (values) => {
                const { emailAddress, password } = values;

                let error;
                let res;

                try {
                  res = await this.afAuth.auth.createUserWithEmailAndPassword(emailAddress, password);
                } catch(e) {
                  error = e;
                }

                if(error && error.code === 'auth/email-already-in-use') {
                  try {
                    res = await this.afAuth.auth.signInWithEmailAndPassword(emailAddress, password);
                    error = null;
                  } catch(e) {
                    error = e;
                  }
                }

                if(error) {
                  const errAlert = await this.alertCtrl.create({
                    header: 'Error',
                    message: error.message,
                    buttons: ['OK']
                  });

                  await errAlert.present();
                }

                if(res) {
                  return resolve(res);
                }
              }
            }
          ]
        });

        alert.present();

      } else {
        const res = await this.afAuth.auth.signInWithPopup(new provider());
        resolve(res);
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}
