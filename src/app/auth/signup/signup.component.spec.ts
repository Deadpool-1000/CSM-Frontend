import { async, ComponentFixture, flush, TestBed, waitForAsync } from "@angular/core/testing";
import { SignupComponent } from "./signup.component";
import { of, throwError } from "rxjs";
import { MessageService } from "primeng/api";
import { Router } from "@angular/router";
import {fillFormField} from "../../tests/testing-helper.spec";
import { AuthService } from "../../services/auth/auth.service";
import { FormsModule } from "@angular/forms";
import { Text } from "../../statics/text";

describe("SignupComponent", ()=>{
    let fixture: ComponentFixture<SignupComponent>;
    let component: SignupComponent;
    let signupForm: HTMLFormElement;
    let fullNameInput: HTMLInputElement;
    let emailInput: HTMLInputElement;
    let passwordInput: HTMLInputElement;
    let confirmPasswordInput: HTMLInputElement;
    let add1Input: HTMLInputElement;
    let add2Input: HTMLInputElement;
    let cityInput: HTMLInputElement;
    let pincodeInput: HTMLInputElement;
    let phnInput: HTMLInputElement;
    let authServiceSpy: jasmine.SpyObj<AuthService>;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;
    let routerServiceSpy: jasmine.SpyObj<Router>;

    beforeEach(async ()=>{
        authServiceSpy = jasmine.createSpyObj("AuthService", {
            signup: of(true)
        });
    
        messageServiceSpy = jasmine.createSpyObj("MessageService", {
            add: true
        });
    
        routerServiceSpy = jasmine.createSpyObj("RouterService", {
            navigate: true
        });

        await TestBed.configureTestingModule({
            declarations: [SignupComponent],
            providers: [
                {provide: MessageService, useValue: messageServiceSpy},
                {provide: Router, useValue: routerServiceSpy},
                {provide: AuthService, useValue: authServiceSpy}
            ],
            imports: [FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();

        signupForm = fixture.debugElement.nativeElement.querySelector("form");
        fullNameInput = fixture.debugElement.nativeElement.querySelector("input[name='full-name']");
        emailInput = fixture.debugElement.nativeElement.querySelector("input[name='email']");
        passwordInput = fixture.debugElement.nativeElement.querySelector("input[name='password']");
        confirmPasswordInput = fixture.debugElement.nativeElement.querySelector("input[name='confirm-password']");
        add1Input = fixture.debugElement.nativeElement.querySelector("input[name='address-1']");
        add2Input = fixture.debugElement.nativeElement.querySelector("input[name='address-2']");
        cityInput = fixture.debugElement.nativeElement.querySelector("input[name='city']");
        pincodeInput = fixture.debugElement.nativeElement.querySelector("input[name='pincode']");
        phnInput = fixture.debugElement.nativeElement.querySelector("input[name='phone-number']");
    });

    afterEach(()=>{
        component.ngOnDestroy();
    })

    it('submits form successfully', ()=>{
        fillFormField(fullNameInput, "Milind");
        fillFormField(emailInput, "mili@gmail.com");
        fillFormField(passwordInput, "password");
        fillFormField(confirmPasswordInput, "password");
        fillFormField(add1Input, "p-404");
        fillFormField(add2Input, "tower-x");
        fillFormField(cityInput, "noida");
        fillFormField(pincodeInput, "313001");
        fillFormField(phnInput, "+918908907654");

        const handleSignupSpy = spyOn(component, "handleSignup").and.callThrough();
        signupForm.dispatchEvent(new Event("submit"));

        fixture.detectChanges();

        expect(handleSignupSpy).toHaveBeenCalled();
        expect(authServiceSpy.signup).toHaveBeenCalledWith(
            "mili@gmail.com",
            "password",
            "Milind",
            "+918908907654",
            component.prepareAddress("p-404", "tower-x", "noida", "313001")
        )
    });

    it('displays error message and clears input fields when password and confirm passwords mismatch', ()=>{
        fixture.detectChanges();
        fillFormField(fullNameInput, "Milind");
        fillFormField(emailInput, "mili@gmail.com");
        fillFormField(passwordInput, "password1");
        fillFormField(confirmPasswordInput, "password");
        fillFormField(add1Input, "p-404");
        fillFormField(add2Input, "tower-x");
        fillFormField(cityInput, "noida");
        fillFormField(pincodeInput, "313001");
        fillFormField(phnInput, "+918908907654");

        const handleSignupSpy = spyOn(component, "handleSignup").and.callThrough();
        signupForm.dispatchEvent(new Event("submit"));
        fixture.detectChanges();

        expect(handleSignupSpy).toHaveBeenCalled();
        expect(component.error).toBe(Text.PASSWORD_MISMATCH);
        expect(authServiceSpy.signup).not.toHaveBeenCalled();
        expect(passwordInput.value).toBe("");
        expect(confirmPasswordInput.value).toBe("");

    });

    it('displays error message on signup api error', ()=>{
        authServiceSpy.signup.and.returnValue(throwError("Some problem signing you up"));
        fillFormField(fullNameInput, "Milind");
        fillFormField(emailInput, "mili@gmail.com");
        fillFormField(passwordInput, "password");
        fillFormField(confirmPasswordInput, "password");
        fillFormField(add1Input, "p-404");
        fillFormField(add2Input, "tower-x");
        fillFormField(cityInput, "noida");
        fillFormField(pincodeInput, "313001");
        fillFormField(phnInput, "+918908907654");

        const handleSignupSpy = spyOn(component, "handleSignup").and.callThrough();
        signupForm.dispatchEvent(new Event("submit"));

        fixture.detectChanges();
        expect(handleSignupSpy).toHaveBeenCalled();
        expect(messageServiceSpy.add).toHaveBeenCalledWith({
            severity: 'error',
            summary: Text.ERROR,
            detail: "Some problem signing you up"
        });

    });
});