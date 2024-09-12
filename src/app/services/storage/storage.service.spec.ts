import { StorageService } from "./storage.service";

describe("StorageService", ()=>{
    let storageService: StorageService;

    beforeEach(()=>{
        storageService = new StorageService();
    });

    it('sets item to session storage', ()=>{
        storageService.setItemToStorage("test", "test");
        expect(sessionStorage.getItem("test")).toBe("test");
    });

    it('clears all items from session storage', ()=>{
        sessionStorage.setItem("test", "test");
        storageService.clear();
        expect(sessionStorage.length).toBe(0);
    });

    it('removes item from session storage', ()=>{
        sessionStorage.setItem("hello", "world");
        storageService.removeItem("hello");
        expect(storageService.getItemFromStorage("hello")).toBeNull();
    });
});