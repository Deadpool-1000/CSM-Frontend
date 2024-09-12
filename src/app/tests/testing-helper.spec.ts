import { ComponentFixture } from "@angular/core/testing";

export const findE = <T,> (fixture: ComponentFixture<T>, selector: string) => {
    return fixture.debugElement.nativeElement.querySelector(selector);
}


export const fillFormField = (input: HTMLInputElement, value: string) => {
    input.value = value;
    input.dispatchEvent(new Event("input"));
}

