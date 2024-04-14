import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { TokenService } from "./token.service";
import { BehaviorSubject } from "rxjs";
import { StorageService } from "./storage.service";
import { UserModel } from "../models/user.model";
import { Router } from "@angular/router";
import { ErrorHandlerService } from "./error-handler.service";
import { Text } from "../statics/text";
import { MessageService } from "primeng/api";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    isLoggedIn = new BehaviorSubject<boolean>(false);
    currentUser = new BehaviorSubject<UserModel | null>(null);

    tokenExpirationTimer: any;
    constructor(private http: HttpClient, private tokenService: TokenService, private storageService: StorageService, private router: Router, private errorHandler: ErrorHandlerService, private messageService: MessageService) { }


    login(email: string, password: string, role: string) {
        return this.http.post<{ token: string, expiresIn: number }>(Text.LOGIN_URL, {
            email,
            password,
            role
        })
            .pipe(
                catchError(
                    (err) => this.errorHandler.handleError(err)
                ),
                tap(
                    (data) => {
                        this.tokenService.token = data.token;
                        const expiresIn = data.expiresIn;
                        const expiryDate = new Date((new Date().getTime()) + expiresIn * 1000).toISOString();
                        this.getProfile().
                            subscribe(
                                (userProfile) => {
                                    // emit the new user to all the subscribed components
                                    this.currentUser.next(userProfile);
                                    this.isLoggedIn.next(true);

                                    // set user profile and expiry time to session storage
                                    this.storageService.setItemToStorage('user', JSON.stringify(userProfile));
                                    this.storageService.setItemToStorage('expiry', expiryDate);
                                    this.storageService.setItemToStorage('token', data.token);

                                    // set logout timer to log user out automatically
                                    this.tokenExpirationTimer = setTimeout(() => {
                                        this.logout("Your session has expired. Please log in to continue.");
                                    }, expiresIn * 1000);
                                }
                            )
                    }
                )
            )
    }

    signup(email: string, password: string, full_name: string, phn_num: string, address: string) {
        return this.http.post(Text.SIGNUP_URL, {
            email,
            password,
            full_name,
            phn_num,
            address
        }).pipe(
            catchError(
                (err) => this.errorHandler.handleError(err)
            )
        );
    }

    autoLogin() {
        const token = this.storageService.getItemFromStorage('token');
        const jsonProfile = this.storageService.getItemFromStorage('user');
        const exp = this.storageService.getItemFromStorage('expiry');

        // if token is present
        if (token && jsonProfile && exp) {
            this.tokenService.token = token;
            const profile: UserModel = JSON.parse(jsonProfile);

            const expiryDate = new Date(exp);
            const timeLeft = expiryDate.getTime() - new Date().getTime();

            // expired token
            if (timeLeft < 0) {
                return this.logout("Your session has expired. Please log in to continue.");
            }
            this.tokenExpirationTimer = setTimeout(() => {
                this.logout("Your session has expired. Please log in to continue.");
            }, timeLeft)

            this.currentUser.next(profile);
            this.isLoggedIn.next(true);
        } else {
            // clear session storage to prevent misuse
            this.storageService.clear();
        }
        return 0;
    }

    getProfile() {
        return this.http.get<UserModel>(Text.PROFILE_URL);
    }

    logout(message: string) {
        // send logout request to server to invalidate current token
        return this.http.post(Text.LOGOUT_URL, {}).pipe(
            tap((done) => {
                this.clearExpirationTimer();
                this.storageService.clear();
                this.currentUser.next(null);
                this.isLoggedIn.next(false);
                this.messageService.add({
                    severity: 'success',
                    summary: Text.SUCCESS,
                    detail: message
                })
            })
        )
    }

    clearExpirationTimer() {
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
    }

    putProfile(full_name: string, phn_num: string, address: string, email: string, role?: string, c_id?: string){
        return this.http.put(Text.PROFILE_URL,{
            full_name, 
            phn_num,
            address,
            email, 
            role,
            c_id
        }).pipe(
            tap(
                (_)=>{
                    this.storageService.removeItem('user');
                    this.storageService.setItemToStorage('user', JSON.stringify({
                        full_name, 
                        phn_num,
                        address,
                        email, 
                        role,
                        c_id
                    }))
                }
            ),
            catchError(
                err=>this.errorHandler.handleError(err)
            )
        )
    }


}
