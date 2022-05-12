import { Subject } from 'rxjs';

const userSubject = new Subject();

export const userService = {
    sendUser: user => userSubject.next(user),
    clearUser: () => userSubject.next(),
    onUser: () => userSubject.asObservable()
};


const cartSubject = new Subject();
export const cartService = {
    updateCartItems: cartItemsLength => cartSubject.next(cartItemsLength),
    clearCartItems: () => cartSubject.next(),
    onUpdateCartItems: () => cartSubject.asObservable()
};

const logOutSubject = new Subject();
export const logOutService = {
    setLogOut: user => logOutSubject.next(user),
    clearLogOut: () => logOutSubject.next(),
    onUpdateLogOut: () => logOutSubject.asObservable()
};

const mobileMenuSubject = new Subject();
export const mobileMenuService = {
    setMobileMenuIndicies: indecies => mobileMenuSubject.next(indecies),
    clearMobileMenuIndicies: () => mobileMenuSubject.next(),
    onUpdateMobileMenuIndicies: () => mobileMenuSubject.asObservable()
};