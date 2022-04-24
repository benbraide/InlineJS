import { FindComponentById } from "../../component/find";
import { AddDirectiveHandler } from "../../directives/add";
import { CreateDirectiveHandlerCallback } from "../../directives/callback";
import { EvaluateLater } from "../../evaluator/evaluate-later";
import { GetGlobal } from "../../global/get";
import { JournalError } from "../../journal/error";
import { JournalTry } from "../../journal/try";
import { AddChanges } from "../../proxy/add-changes";
import { BuildGetterProxyOptions, BuildProxyOptions, CreateInplaceProxy } from "../../proxy/create";
import { BindEvent } from "../event";
import { ResolveOptions } from "../options";

interface IStripeField{
    name: string;
    mount: HTMLElement;
    element?: stripe.elements.Element;
    ready?: boolean;
    complete?: boolean;
    focused?: boolean;
    error?: string;
}

export interface IStripeStyle{
    base?: stripe.elements.Style;
    complete?: stripe.elements.Style;
    empty?: stripe.elements.Style;
    invalid?: stripe.elements.Style;
    paymentRequestButton?: stripe.elements.PaymentRequestButtonStyleOptions;
}

export interface IStripeClass{
    base?: string;
    complete?: string;
    empty?: string;
    focus?: string;
    invalid?: string;
    webkitAutofill?: string;
}

export interface IStripeBillingDetails{
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

const StripeSpecialKeys = ['submit', 'save', 'name', 'email', 'phone', 'address'];

const StripeKeys = {
    'number': 'cardNumber',
    'expiry': 'cardExpiry',
    'cvc': 'cardCvc',
    'postal': 'postalCode',
    'zip': 'postalCode',
};

const StripeDirectiveName = 'stripe';

let StripePublicKey = '';
let StripeUrl = 'https://js.stripe.com/v3/';
let StripeStyles: IStripeStyle | null = null;
let StripeClasses: IStripeClass | null = null;

export const StripeDirectiveHandler = CreateDirectiveHandlerCallback(StripeDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: StripeDirectiveName,
        event: argKey,
        defaultEvent: 'success',
        eventWhitelist: ['error', 'before', 'after', 'ready', 'focus', 'complete'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })){
        return;
    }
    
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent?.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope){
        return JournalError('Failed to retrieve element scope.', `InlineJS.${StripeDirectiveName}`, contextElement);
    }
    
    let localKey = `\$${StripeDirectiveName}`, detailsKey = `#${StripeDirectiveName}`;
    if (localKey in (elementScope.GetLocals() || {})){//Already initialized
        return;
    }
    
    if (StripeSpecialKeys.includes(argKey)){//No Stripe binding
        let details = resolvedComponent.FindElementLocalValue(contextElement, detailsKey, true);
        if (details){
            details.specialMounts[argKey] = contextElement;
            elementScope.SetLocal(localKey, CreateInplaceProxy(BuildGetterProxyOptions({
                getter: (prop) => {
                    if (prop === 'parent'){
                        return (contextElement.parentElement ? FindComponentById(componentId)?.FindElementLocalValue(contextElement.parentElement, localKey, true) : null);
                    }
                },
                lookup: ['parent'],
            })));
        }

        return;
    }
    
    if (argKey in StripeKeys){//Bind Stripe field
        let details = resolvedComponent.FindElementLocalValue(contextElement, detailsKey, true);
        if (!details){//No parent
            return;
        }

        let id = resolvedComponent.GenerateUniqueId(`${StripeDirectiveName}_proxy_`), field: IStripeField = {
            name: argKey,
            mount: contextElement,
            element: details.elements.create(StripeKeys[argKey], {
                style: (StripeStyles || undefined),
                classes: (StripeClasses || undefined),
            }),
            ready: false,
            complete: false,
            error: undefined,
        };

        if (!field.element){
            return;
        }

        field.element.mount(contextElement);
        details.fields.push(field);

        elementScope.SetLocal(localKey, CreateInplaceProxy(BuildGetterProxyOptions({
            getter: (prop) => {
                if (prop === 'complete'){
                    FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return field.complete;
                }

                if (prop === 'focused'){
                    FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return field.focused;
                }

                if (prop === 'error'){
                    FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return field.error;
                }
                
                if (prop === 'parent'){
                    return (contextElement.parentElement ? FindComponentById(componentId)?.FindElementLocalValue(contextElement.parentElement, localKey, true) : null);
                }

                if (prop === 'clear'){
                    return () => {
                        if (field.element){
                            field.element.clear();
                        }
                    };
                }
    
                if (prop === 'focus'){
                    return () => {
                        if (field.element){
                            field.element.focus();
                        }
                    };
                }
    
                if (prop === 'blur'){
                    return () => {
                        if (field.element){
                            field.element.blur();
                        }
                    };
                }
            },
            lookup: ['complete', 'focused', 'error', 'parent', 'clear', 'focus', 'blur'],
        })));

        let fields = details.fields;
        elementScope.AddUninitCallback(() => {
            field.element?.destroy();
            fields.splice(fields.indexOf(field), 1);
        });

        field.element.on('ready', () => {
            if (!field.ready){
                field.ready = true;
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.ready`));
                details.onReady();
            }
        });

        field.element.on('change', (e) => {
            if (e?.complete === field.complete){
                return;
            }

            field.complete = e?.complete;
            field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.complete`, {
                detail: {
                    completed: e?.complete,
                },
            }));
            
            if (field.complete){
                if (field.error){
                    field.error = undefined;
                    AddChanges('set', `${id}.error`, 'error', FindComponentById(componentId)?.GetBackend().changes);
                }

                if (details.options.autofocus){//Focus next if any
                    let index = details.fields.indexOf(field);
                    if (index != -1 && index < (details.fields.length - 1)){
                        let nextField = details.fields[index + 1];
                        if (nextField.element){
                            nextField.element.focus();
                        }
                        else if ('focus' in nextField.mount && typeof nextField.mount.focus === 'function'){
                            nextField.mount.focus();
                        }
                    }
                    else if (details.specialMounts.submit){
                        details.specialMounts.submit.focus();
                    }
                }
            }
            else if (e?.error && e.error.message !== field.error){
                field.error = e.error.message;
                AddChanges('set', `${id}.error`, 'error', FindComponentById(componentId)?.GetBackend().changes);

                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.error`, {
                    detail: {
                        message: e.error.message,
                    },
                }));
            }

            details.onChange();
        });

        field.element.on('focus', () => {
            if (!field.focused){
                field.focused = true;
                AddChanges('set', `${id}.focused`, 'focused', FindComponentById(componentId)?.GetBackend().changes);
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.focus`, {
                    detail: {
                        focused: true,
                    },
                }));
            }
        });

        field.element.on('blur', () => {
            if (field.focused){
                field.focused = false;
                AddChanges('set', `${id}.focused`, 'focused', FindComponentById(componentId)?.GetBackend().changes);
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.focus`, {
                    detail: {
                        focused: false,
                    },
                }));
            }
        });
        
        return;
    }

    let stripeInstance: stripe.Stripe | null = null, elements: stripe.elements.Elements | null = null, backlog = new Array<() => void>(), init = () => {
        EvaluateLater({ componentId, contextElement, expression })((value) => {
            stripeInstance = Stripe(value || StripePublicKey);
            if (!stripeInstance){
                return JournalError('Failed to initialize stripe', `InlineJS.${StripeDirectiveName}.Init`, contextElement);
            }

            elements = stripeInstance.elements();
            if (!elements){
                return JournalError('Failed to initialize stripe', `InlineJS.${StripeDirectiveName}.Init`, contextElement);
            }

            backlog.splice(0).forEach(callback => JournalTry(callback, `InlineJS.${StripeDirectiveName}.Init`, contextElement));
        });
    };

    let fields = new Array<IStripeField>(), specialMounts = {
        submit: <HTMLElement | null>null,
        save: <HTMLElement | null>null,
        name: <HTMLElement | null>null,
        email: <HTMLElement | null>null,
        phone: <HTMLElement | null>null,
        address: <HTMLElement | null>null,
    };

    let id = resolvedComponent.GenerateUniqueId(`${StripeDirectiveName}_proxy_`), options = ResolveOptions({
        options: {
            autofocus: false,
            nexttick: false,
            manual: false,
        },
        list: argOptions,
    });

    let active = false, complete = false, errorCount = 0, setComplete = (value: boolean) => {
        if (value != complete){
            complete = value;
            AddChanges('set', `${id}.complete`, 'complete', FindComponentById(componentId)?.GetBackend().changes);
        }
    };

    let details = { fields, specialMounts, options,
        onReady: () => AddChanges('set', `${id}.readyCount`, 'readyCount', FindComponentById(componentId)?.GetBackend().changes),
        onChange: () => {
            setComplete(!fields.find(field => !field.complete));

            let currentErrorCount = fields.reduce((prev, field) => (prev + (field.error ? 1 : 0)), 0);
            if (currentErrorCount != errorCount){//Error list changed
                errorCount = currentErrorCount;
                AddChanges('set', `${id}.errors`, 'errors', FindComponentById(componentId)?.GetBackend().changes);
            }
        },
    };

    let setActive = (value: boolean) => {
        if (value != active){
            active = value;
            AddChanges('set', `${id}.active`, 'active', FindComponentById(componentId)?.GetBackend().changes)
        }
    };

    let evaluate = EvaluateLater({ componentId, contextElement, expression }), onSuccess = (response: stripe.PaymentIntentResponse) => {
        if (!response.error){
            contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.success`, {
                detail: {
                    intent: response.paymentIntent,
                },
            }));
            
            contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.after`));
            setActive(false);

            if (options.nexttick){
                FindComponentById(componentId)?.GetBackend().changes.AddNextTickHandler(() => evaluate());
            }
            else{//Immediate evaluation
                evaluate();
            }
        }
        else{//Error
            onError(response.error.message || '');
        }
    };

    let onError = (err: string) => {
        contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.error`, {
            detail: {
                type: 'host',
                message: err,
            },
        }));

        reportError('host', err);
        contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.after`));
        setActive(false);
    };

    let reportError = (type: string, message: string) => {
        contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.error`, {
            detail: { type, message },
        }));
    };

    let getPaymentDetails = (paymentMethod: string | IStripeBillingDetails, save: boolean): stripe.ConfirmCardPaymentData | null => {
        if (paymentMethod && typeof paymentMethod === 'string'){
            return {
                payment_method: paymentMethod,
                setup_future_usage: (save ? 'off_session' : undefined),
            };
        }

        let cardElement = fields.find(field => (field.name === 'number'))?.element;
        if (!cardElement){
            return null;
        }

        let billingDetails: stripe.BillingDetails = {}, getBillingDetail = (key: string) => {
            if (paymentMethod){
                return (paymentMethod[key] || (specialMounts[key] ? specialMounts[key].value : undefined));
            }
            return (specialMounts[key] ? specialMounts[key].value : undefined);
        };

        ['name', 'email', 'phone', 'address'].forEach((key) => {
            if (key === 'address'){
                billingDetails.address = {
                    line1: getBillingDetail(key),
                };
            }
            else{
                billingDetails[key] = getBillingDetail(key);
            }
        });

        if (!save && specialMounts.save && specialMounts.save instanceof HTMLInputElement){
            save = specialMounts.save.checked;
        }
        
        return {
            payment_method: {
                card: cardElement,
                billing_details: billingDetails,
            },
            setup_future_usage: (save ? 'off_session' : undefined),
        };
    };

    let payOrSetup = (callback: () => void, hasPaymentMethod = false) => {
        if (hasPaymentMethod || (complete && !fields.find(field => !!field.error))){
            setActive(true);
            contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.before`));
            callback();
        }
        else{//Error
            reportError('incomplete', 'Please fill in all required fields.');
        }
    };

    elementScope.SetLocal(detailsKey, details);
    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            if (prop === 'bind'){
                return () => {
                    if (!stripeInstance){
                        bind();
                    }
                };
            }

            if (prop === 'active'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return active;
            }

            if (prop === 'readyCount'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return fields.reduce((prev, field) => (prev + (field.ready ? 1 : 0)), 0);
            }
            
            if (prop === 'complete'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return complete;
            }

            if (prop === 'errors'){
                FindComponentById(componentId)?.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return fields.filter(field => !!field.error).map(field => field.error);
            }

            if (prop === 'instance'){
                return stripeInstance;
            }
            
            if (prop === 'publicKey'){
                return StripePublicKey;
            }

            if (prop === 'styles'){
                return StripeStyles;
            }

            if (prop === 'classes'){
                return StripeClasses;
            }

            if (prop === 'url'){
                return StripeUrl;
            }
            
            if (prop === 'pay'){
                return (clientSecret: string, paymentMethod: string | IStripeBillingDetails, save = false) => {
                    payOrSetup(() => {
                        let paymentDetails = getPaymentDetails(paymentMethod, save);
                        if (paymentDetails){
                            stripeInstance?.confirmCardPayment(clientSecret, paymentDetails).then(onSuccess).catch(onError);
                        }
                    }, (!!paymentMethod && typeof paymentMethod === 'string'));
                };
            }

            if (prop === 'setup'){
                return (clientSecret: string, paymentMethod: string | IStripeBillingDetails, save = false) => {
                    payOrSetup(() => {
                        let paymentDetails = getPaymentDetails(paymentMethod, save);
                        if (paymentDetails){
                            stripeInstance?.confirmCardSetup(clientSecret, paymentDetails).then(onSuccess).catch(onError);
                        }
                    }, (!!paymentMethod && typeof paymentMethod === 'string'));
                };
            }
        },
        setter: (prop, value) => {
            if (prop === 'publicKey'){
                StripePublicKey = value;
            }
            else if (prop === 'styles'){
                StripeStyles = value;
            }
            else if (prop === 'classes'){
                StripeClasses = value;
            }
            else if (prop === 'url'){
                StripeUrl = value;
            }

            return true;
        },
        lookup: ['bind', 'active', 'readyCount', 'complete', 'errors', 'instance', 'publicKey', 'styles', 'classes', 'url', 'pay', 'setup'],
    })));

    let bind = () => {
        let resourceConcept = GetGlobal().GetResourceConcept();
        if (StripeUrl && resourceConcept){
            resourceConcept.GetScript(StripeUrl).then(init);
        }
        else{//Resource not provided
            init();
        }
    }

    if (!options.manual){
        bind();
    }
});

export function StripeDirectiveHandlerCompact(){
    AddDirectiveHandler(StripeDirectiveHandler);
}
