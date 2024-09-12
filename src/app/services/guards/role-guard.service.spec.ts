import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { AuthService } from "../auth/auth.service";
import { UserModel } from "../../models/user.model";
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlSegmentGroup, UrlTree } from "@angular/router";
import { BehaviorSubject, first, Observable} from "rxjs";
import { allowedUsers } from "./role-guard.service";
import { MessageService } from "primeng/api";


const getSampleUser = (role: string):UserModel => {
    return {
        c_id: "USR1234",
        full_name: "Milind",
        role: role,
        address: "abc street, xyz",
        phn_num: "+918908908907",
        email: "milind@gmail.com",
        e_id: "USR1234"
    }
}


describe("Role-guard (Isolated)", ()=>{
    let routerServiceSpy: jasmine.SpyObj<Router>;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;
    let authServiceSpy: AuthService;
    
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;

    let customerGuard: CanActivateFn;
    let helpdeskGuard: CanActivateFn;
    let managerGuard: CanActivateFn;

    const sampleCustomer = getSampleUser("CUSTOMER");
    const sampleHelpdesk = getSampleUser("HELPDESK");
    const sampleManager = getSampleUser("MANAGER");

    beforeEach(()=>{    
        routerServiceSpy = jasmine.createSpyObj("Router", {
            navigate: true,
            createUrlTree: new UrlTree(new UrlSegmentGroup([], {}))
        });

        authServiceSpy =  jasmine.createSpyObj("AuthService",{}, {
            isLoggedIn: new BehaviorSubject<boolean>(true),
            currentUser: new BehaviorSubject<UserModel|null>(null)
        });

        messageServiceSpy = jasmine.createSpyObj("MessageService", ["add"]);

        TestBed.configureTestingModule({
            providers: [
                {provide: AuthService, useValue: authServiceSpy},
                {provide: Router, useValue: routerServiceSpy},
                {provide: MessageService, useValue: messageServiceSpy}
            ]
        });

        customerGuard = allowedUsers("CUSTOMER");
        helpdeskGuard = allowedUsers("HELPDESK");
        managerGuard = allowedUsers("MANAGER");
    });

    it('allows only customers when "CUSTOMER" is passed as parameter', fakeAsync(()=>{
        authServiceSpy.currentUser.next(sampleCustomer);
        const truthyResult = TestBed.runInInjectionContext(()=> customerGuard(route, state));
        tick();
        if(truthyResult instanceof Observable){
            truthyResult.pipe(first()).subscribe(
                (result)=>{
                    expect(result).toBeTrue();
                }
            )
        }
        
        authServiceSpy.currentUser.next(sampleHelpdesk);
        const falsyResult = TestBed.runInInjectionContext(()=>customerGuard(route, state));
        tick();
        if(falsyResult instanceof Observable){
            falsyResult.pipe(first()).subscribe(
                (result)=>{
                    expect(result instanceof UrlTree).toBeTrue();
                }
            )
        }
    }));

    it('allows only helpdesk when "HELPDESK" is passed as parameter', fakeAsync(()=>{
        authServiceSpy.currentUser.next(sampleHelpdesk);
        const truthyResult = TestBed.runInInjectionContext(()=> helpdeskGuard(route, state));
        tick();
        if(truthyResult instanceof Observable){
            truthyResult.pipe(first()).subscribe(
                (result)=>{
                    expect(result).toBeTrue();
                }
            )
        }

        authServiceSpy.currentUser.next(sampleCustomer);
        const falsyResult = TestBed.runInInjectionContext(()=>helpdeskGuard(route, state));
        tick();
        if(falsyResult instanceof Observable){
            falsyResult.pipe(first()).subscribe(
                (result)=>{
                    expect(result instanceof UrlTree).toBeTrue();
                }
            )
        }
    }));

    it('allows only manager when "MANAGER" is passed as parameter', fakeAsync(()=>{
        authServiceSpy.currentUser.next(sampleManager);
        const truthyResult = TestBed.runInInjectionContext(()=> managerGuard(route, state));
        tick();
        if(truthyResult instanceof Observable){
            truthyResult.pipe(first()).subscribe(
                (result)=>{
                    expect(result).toBeTrue();
                }
            )
        }

        authServiceSpy.currentUser.next(sampleCustomer);
        const falsyResult = TestBed.runInInjectionContext(()=>managerGuard(route, state));
        tick();
        if(falsyResult instanceof Observable){
            falsyResult.pipe(first()).subscribe(
                (result)=>{
                    expect(result instanceof UrlTree).toBeTrue();
                }
            )
        }
    }));
});