import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { TestBed } from "@angular/core/testing";
import { AuthService } from "./auth.service";
import { TokenService } from "../token/token.service";
import { StorageService } from "../storage/storage.service";
import { MessageService } from "primeng/api";
import { ErrorHandlerService } from "../error-handler/error-handler.service";
import { AppRoutingModule } from "../../app-routing.module";
import { Text } from "../../statics/text";
import { UserModel } from "../../models/user.model";
import { first } from "rxjs";


const SAMPLE_LOGIN_DATA = {
    token: "<jwt token>",
    expiresIn: 3600
}

const SAMPLE_PROFILE_DATA: UserModel = {
    full_name: "MILIND",
    phn_num: "8766789087",
    role: "customer",
    email: "mili@gmail.com",
    address: "abc street, xyz",
    c_id: "USR1234"
}


describe('AuthService', ()=>{
    let authService: AuthService;
    let controller: HttpTestingController;

    const tokenServiceSpy = jasmine.createSpyObj("TokenService", {
        token: null
    });

    const storageServiceSpy = jasmine.createSpyObj("StorageService", {
        setItemToStorage: () => true,
        getItemFromStorage: () => true,
        clear: () => true,
        removeItem: () => true
    });

    beforeEach(
        async ()=>{
            await TestBed.configureTestingModule({
                imports: [HttpClientTestingModule, AppRoutingModule],
                providers: [
                    {provide: TokenService, useValue: tokenServiceSpy},
                    {provide: StorageService, useValue: storageServiceSpy},
                    AuthService,
                    MessageService,
                    ErrorHandlerService
                ]
            }).compileComponents();

            authService = TestBed.inject(AuthService);
            controller = TestBed.inject(HttpTestingController);
        }
    )

    afterEach(
        ()=>{
            controller.verify();
        }
    )

    it('sends requests to login api', ()=>{
        let responseData:{ token: string, expiresIn: number }|undefined;
        authService.login("test@gmail.com", "TestPassword", "test-role").subscribe(
            (resp)=>{
                responseData = resp
            }
        )

        const loginRequest = controller.expectOne(Text.LOGIN_URL);
        loginRequest.flush(SAMPLE_LOGIN_DATA);
        
        const profileRequest = controller.expectOne(Text.PROFILE_URL);
        profileRequest.flush(SAMPLE_PROFILE_DATA);

        expect(responseData).toEqual(SAMPLE_LOGIN_DATA);

        expect(storageServiceSpy.setItemToStorage).toHaveBeenCalled();
        authService.currentUser.pipe(
            first()
        ).subscribe(
            currentUser=>{
                expect(currentUser).toEqual(SAMPLE_PROFILE_DATA);
            }
        )
    });

    it('sends request to signup api', ()=>{
        authService.signup(
            "test_email@gmail.com", "test_password", "test_full_name", "8908907658", "test city, abc"
        ).subscribe();

        const signupRequest = controller.expectOne(Text.SIGNUP_URL);
        expect(signupRequest.request.method).toBe("POST");
        signupRequest.flush("");

    });

    it('sets token, profile and expiry timer on autologin', ()=>{
        const tokenService = TestBed.inject(TokenService);

        storageServiceSpy.getItemFromStorage.and.callFake(
            (key: string)=>{
                if(key === "token"){
                    return "sample-token"
                } else if(key === "user"){
                    return JSON.stringify(SAMPLE_PROFILE_DATA)
                } else {
                    return "3600"
                }
            }
        )

        authService.autoLogin();
        // get item is called three times
        expect(storageServiceSpy.getItemFromStorage).toHaveBeenCalledTimes(3);
        // correct token set
        expect(tokenService.token).toBe("sample-token")
        // correct user set
        authService.currentUser.pipe(first()).subscribe(
            (currentUser: UserModel|null) => {
                if(currentUser)
                    expect(currentUser).toEqual(SAMPLE_PROFILE_DATA);
                else
                    fail("Current User is not set correctly")
            }
        )
        //expiration timer set
        expect(authService.tokenExpirationTimer).toBeDefined();
    });


    it('clears all data upon logout', ()=>{
        authService.logout("test logout").pipe(first()).subscribe()

        const logoutRequest = controller.expectOne(Text.LOGOUT_URL);
        logoutRequest.flush(true);

        // clear token timer
        expect(authService.tokenExpirationTimer).toBeUndefined();
        // calls to clear session storage data
        expect(storageServiceSpy.clear).toHaveBeenCalled();
        
        // isLoggedIn state is false(not logged in)
        authService.isLoggedIn.pipe(first()).subscribe(
            (isLoggedIn: boolean) => {
                expect(isLoggedIn).toBeFalse();
            }
        );
    });

    it('sends profile update request', ()=>{
        authService.putProfile(
            SAMPLE_PROFILE_DATA.full_name, SAMPLE_PROFILE_DATA.phn_num, SAMPLE_PROFILE_DATA.address, SAMPLE_PROFILE_DATA.email, "customer", SAMPLE_PROFILE_DATA.c_id
        ).pipe(first()).subscribe()

        const updateProfileRequest = controller.expectOne(Text.PROFILE_URL);
        updateProfileRequest.flush(true);

        expect(storageServiceSpy.removeItem).toHaveBeenCalled();
        // expect(storageServiceSpy.setItemToStorage).toHaveBeenCalledWith("user", JSON.stringify(SAMPLE_PROFILE_DATA))

    });


});