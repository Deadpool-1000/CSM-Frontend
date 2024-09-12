import { fakeAsync, flush, TestBed, tick } from "@angular/core/testing";
import { AuthService } from "../auth/auth.service";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlSegmentGroup, UrlTree } from "@angular/router";
import { BehaviorSubject, first, Observable} from "rxjs";
import { isLoginGuard } from "./isLogin-guard.service";
import { MessageService } from "primeng/api";

describe("isLogin-guard (Isolated)", ()=>{
    let routerServiceSpy: jasmine.SpyObj<Router>;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;
    let authServiceSpy: AuthService;
    
    const route: ActivatedRouteSnapshot = {} as any;
    const state: RouterStateSnapshot = {} as any;

    beforeEach(()=>{    
        routerServiceSpy = jasmine.createSpyObj("Router", {
            navigate: true,
            createUrlTree: new UrlTree(new UrlSegmentGroup([], {}))
        });

        authServiceSpy =  jasmine.createSpyObj("AuthService",{}, {
            isLoggedIn: new BehaviorSubject<boolean>(true)
        });

        messageServiceSpy = jasmine.createSpyObj("MessageService", ["add"]);

        TestBed.configureTestingModule({
            providers: [
                {provide: AuthService, useValue: authServiceSpy},
                {provide: Router, useValue: routerServiceSpy},
                {provide: MessageService, useValue: messageServiceSpy}
            ]
        });
    });

    it('should return true when user is logged in', fakeAsync(()=>{
        
        const result = TestBed.runInInjectionContext(()=> isLoginGuard(route, state));
        tick();
        if(result instanceof Observable){
            result.pipe(first()).subscribe(
                (result)=>{
                    expect(result).toBeTrue();
                }
            )
        } else fail("CanActivate return value is not an observable")
        flush();
    }));

    it('should return false when user is logged out', fakeAsync(()=>{
        authServiceSpy.isLoggedIn.next(false);
        const result = TestBed.runInInjectionContext(()=>isLoginGuard(route, state));
        tick();
        if(result instanceof Observable){
            result.pipe(first()).subscribe(
                (result)=>{
                    expect(routerServiceSpy.createUrlTree).toHaveBeenCalledWith(["auth", "login"]);
                    expect(result instanceof UrlTree).toBeTrue();
                }
            )
        }
        flush();
    }));

});