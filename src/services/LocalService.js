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