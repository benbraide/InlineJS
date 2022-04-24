/// <reference types="stripe-v3" />
export interface IStripeStyle {
    base?: stripe.elements.Style;
    complete?: stripe.elements.Style;
    empty?: stripe.elements.Style;
    invalid?: stripe.elements.Style;
    paymentRequestButton?: stripe.elements.PaymentRequestButtonStyleOptions;
}
export interface IStripeClass {
    base?: string;
    complete?: string;
    empty?: string;
    focus?: string;
    invalid?: string;
    webkitAutofill?: string;
}
export interface IStripeBillingDetails {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}
export declare const StripeDirectiveHandler: import("../../types/directives").IDirectiveHandlerCallbackDetails;
export declare function StripeDirectiveHandlerCompact(): void;
