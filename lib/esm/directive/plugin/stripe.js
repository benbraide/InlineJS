import { FindComponentById } from "../../component/find";
import { ResourceConceptName } from "../../concepts/names";
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
let StripeStyles = null;
let StripeClasses = null;
export const StripeDirectiveHandler = CreateDirectiveHandlerCallback(StripeDirectiveName, ({ componentId, component, contextElement, expression, argKey, argOptions }) => {
    if (BindEvent({ contextElement, expression,
        component: (component || componentId),
        key: StripeDirectiveName,
        event: argKey,
        defaultEvent: 'success',
        eventWhitelist: ['error', 'before', 'after', 'ready', 'focus', 'complete'],
        options: argOptions,
        optionBlacklist: ['window', 'document', 'outside'],
    })) {
        return;
    }
    let resolvedComponent = (component || FindComponentById(componentId)), elementScope = resolvedComponent === null || resolvedComponent === void 0 ? void 0 : resolvedComponent.FindElementScope(contextElement);
    if (!resolvedComponent || !elementScope) {
        return JournalError('Failed to retrieve element scope.', `InlineJS.${StripeDirectiveName}`, contextElement);
    }
    let localKey = `\$${StripeDirectiveName}`, detailsKey = `#${StripeDirectiveName}`;
    if (localKey in (elementScope.GetLocals() || {})) { //Already initialized
        return;
    }
    if (StripeSpecialKeys.includes(argKey)) { //No Stripe binding
        let details = resolvedComponent.FindElementLocalValue(contextElement, detailsKey, true);
        if (details) {
            details.specialMounts[argKey] = contextElement;
            elementScope.SetLocal(localKey, CreateInplaceProxy(BuildGetterProxyOptions({
                getter: (prop) => {
                    var _a;
                    if (prop === 'parent') {
                        return (contextElement.parentElement ? (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.FindElementLocalValue(contextElement.parentElement, localKey, true) : null);
                    }
                },
                lookup: ['parent'],
            })));
        }
        return;
    }
    if (argKey in StripeKeys) { //Bind Stripe field
        let details = resolvedComponent.FindElementLocalValue(contextElement, detailsKey, true);
        if (!details) { //No parent
            return;
        }
        let id = resolvedComponent.GenerateUniqueId(`${StripeDirectiveName}_proxy_`), field = {
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
        if (!field.element) {
            return;
        }
        field.element.mount(contextElement);
        details.fields.push(field);
        elementScope.SetLocal(localKey, CreateInplaceProxy(BuildGetterProxyOptions({
            getter: (prop) => {
                var _a, _b, _c, _d;
                if (prop === 'complete') {
                    (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return field.complete;
                }
                if (prop === 'focused') {
                    (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return field.focused;
                }
                if (prop === 'error') {
                    (_c = FindComponentById(componentId)) === null || _c === void 0 ? void 0 : _c.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                    return field.error;
                }
                if (prop === 'parent') {
                    return (contextElement.parentElement ? (_d = FindComponentById(componentId)) === null || _d === void 0 ? void 0 : _d.FindElementLocalValue(contextElement.parentElement, localKey, true) : null);
                }
                if (prop === 'clear') {
                    return () => {
                        if (field.element) {
                            field.element.clear();
                        }
                    };
                }
                if (prop === 'focus') {
                    return () => {
                        if (field.element) {
                            field.element.focus();
                        }
                    };
                }
                if (prop === 'blur') {
                    return () => {
                        if (field.element) {
                            field.element.blur();
                        }
                    };
                }
            },
            lookup: ['complete', 'focused', 'error', 'parent', 'clear', 'focus', 'blur'],
        })));
        let fields = details.fields;
        elementScope.AddUninitCallback(() => {
            var _a;
            (_a = field.element) === null || _a === void 0 ? void 0 : _a.destroy();
            fields.splice(fields.indexOf(field), 1);
        });
        field.element.on('ready', () => {
            if (!field.ready) {
                field.ready = true;
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.ready`));
                details.onReady();
            }
        });
        field.element.on('change', (e) => {
            var _a, _b;
            if ((e === null || e === void 0 ? void 0 : e.complete) === field.complete) {
                return;
            }
            field.complete = e === null || e === void 0 ? void 0 : e.complete;
            field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.complete`, {
                detail: {
                    completed: e === null || e === void 0 ? void 0 : e.complete,
                },
            }));
            if (field.complete) {
                if (field.error) {
                    field.error = undefined;
                    AddChanges('set', `${id}.error`, 'error', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                }
                if (details.options.autofocus) { //Focus next if any
                    let index = details.fields.indexOf(field);
                    if (index != -1 && index < (details.fields.length - 1)) {
                        let nextField = details.fields[index + 1];
                        if (nextField.element) {
                            nextField.element.focus();
                        }
                        else if ('focus' in nextField.mount && typeof nextField.mount.focus === 'function') {
                            nextField.mount.focus();
                        }
                    }
                    else if (details.specialMounts.submit) {
                        details.specialMounts.submit.focus();
                    }
                }
            }
            else if ((e === null || e === void 0 ? void 0 : e.error) && e.error.message !== field.error) {
                field.error = e.error.message;
                AddChanges('set', `${id}.error`, 'error', (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes);
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.error`, {
                    detail: {
                        message: e.error.message,
                    },
                }));
            }
            details.onChange();
        });
        field.element.on('focus', () => {
            var _a;
            if (!field.focused) {
                field.focused = true;
                AddChanges('set', `${id}.focused`, 'focused', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.focus`, {
                    detail: {
                        focused: true,
                    },
                }));
            }
        });
        field.element.on('blur', () => {
            var _a;
            if (field.focused) {
                field.focused = false;
                AddChanges('set', `${id}.focused`, 'focused', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
                field.mount.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.focus`, {
                    detail: {
                        focused: false,
                    },
                }));
            }
        });
        return;
    }
    let stripeInstance = null, elements = null, backlog = new Array(), init = () => {
        EvaluateLater({ componentId, contextElement, expression })((value) => {
            stripeInstance = Stripe(value || StripePublicKey);
            if (!stripeInstance) {
                return JournalError('Failed to initialize stripe', `InlineJS.${StripeDirectiveName}.Init`, contextElement);
            }
            elements = stripeInstance.elements();
            if (!elements) {
                return JournalError('Failed to initialize stripe', `InlineJS.${StripeDirectiveName}.Init`, contextElement);
            }
            backlog.splice(0).forEach(callback => JournalTry(callback, `InlineJS.${StripeDirectiveName}.Init`, contextElement));
        });
    };
    let fields = new Array(), specialMounts = {
        submit: null,
        save: null,
        name: null,
        email: null,
        phone: null,
        address: null,
    };
    let id = resolvedComponent.GenerateUniqueId(`${StripeDirectiveName}_proxy_`), options = ResolveOptions({
        options: {
            autofocus: false,
            nexttick: false,
            manual: false,
        },
        list: argOptions,
    });
    let active = false, complete = false, errorCount = 0, setComplete = (value) => {
        var _a;
        if (value != complete) {
            complete = value;
            AddChanges('set', `${id}.complete`, 'complete', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        }
    };
    let details = { fields, specialMounts, options,
        onReady: () => { var _a; return AddChanges('set', `${id}.readyCount`, 'readyCount', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes); },
        onChange: () => {
            var _a;
            setComplete(!fields.find(field => !field.complete));
            let currentErrorCount = fields.reduce((prev, field) => (prev + (field.error ? 1 : 0)), 0);
            if (currentErrorCount != errorCount) { //Error list changed
                errorCount = currentErrorCount;
                AddChanges('set', `${id}.errors`, 'errors', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
            }
        },
    };
    let setActive = (value) => {
        var _a;
        if (value != active) {
            active = value;
            AddChanges('set', `${id}.active`, 'active', (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes);
        }
    };
    let evaluate = EvaluateLater({ componentId, contextElement, expression }), onSuccess = (response) => {
        var _a;
        if (!response.error) {
            contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.success`, {
                detail: {
                    intent: response.paymentIntent,
                },
            }));
            contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.after`));
            setActive(false);
            if (options.nexttick) {
                (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddNextTickHandler(() => evaluate());
            }
            else { //Immediate evaluation
                evaluate();
            }
        }
        else { //Error
            onError(response.error.message || '');
        }
    };
    let onError = (err) => {
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
    let reportError = (type, message) => {
        contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.error`, {
            detail: { type, message },
        }));
    };
    let getPaymentDetails = (paymentMethod, save) => {
        var _a;
        if (paymentMethod && typeof paymentMethod === 'string') {
            return {
                payment_method: paymentMethod,
                setup_future_usage: (save ? 'off_session' : undefined),
            };
        }
        let cardElement = (_a = fields.find(field => (field.name === 'number'))) === null || _a === void 0 ? void 0 : _a.element;
        if (!cardElement) {
            return null;
        }
        let billingDetails = {}, getBillingDetail = (key) => {
            if (paymentMethod) {
                return (paymentMethod[key] || (specialMounts[key] ? specialMounts[key].value : undefined));
            }
            return (specialMounts[key] ? specialMounts[key].value : undefined);
        };
        ['name', 'email', 'phone', 'address'].forEach((key) => {
            if (key === 'address') {
                billingDetails.address = {
                    line1: getBillingDetail(key),
                };
            }
            else {
                billingDetails[key] = getBillingDetail(key);
            }
        });
        if (!save && specialMounts.save && specialMounts.save instanceof HTMLInputElement) {
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
    let payOrSetup = (callback, hasPaymentMethod = false) => {
        if (hasPaymentMethod || (complete && !fields.find(field => !!field.error))) {
            setActive(true);
            contextElement.dispatchEvent(new CustomEvent(`${StripeDirectiveName}.before`));
            callback();
        }
        else { //Error
            reportError('incomplete', 'Please fill in all required fields.');
        }
    };
    elementScope.SetLocal(detailsKey, details);
    elementScope.SetLocal(localKey, CreateInplaceProxy(BuildProxyOptions({
        getter: (prop) => {
            var _a, _b, _c, _d;
            if (prop === 'bind') {
                return () => {
                    if (!stripeInstance) {
                        bind();
                    }
                };
            }
            if (prop === 'active') {
                (_a = FindComponentById(componentId)) === null || _a === void 0 ? void 0 : _a.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return active;
            }
            if (prop === 'readyCount') {
                (_b = FindComponentById(componentId)) === null || _b === void 0 ? void 0 : _b.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return fields.reduce((prev, field) => (prev + (field.ready ? 1 : 0)), 0);
            }
            if (prop === 'complete') {
                (_c = FindComponentById(componentId)) === null || _c === void 0 ? void 0 : _c.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return complete;
            }
            if (prop === 'errors') {
                (_d = FindComponentById(componentId)) === null || _d === void 0 ? void 0 : _d.GetBackend().changes.AddGetAccess(`${id}.${prop}`);
                return fields.filter(field => !!field.error).map(field => field.error);
            }
            if (prop === 'instance') {
                return stripeInstance;
            }
            if (prop === 'publicKey') {
                return StripePublicKey;
            }
            if (prop === 'styles') {
                return StripeStyles;
            }
            if (prop === 'classes') {
                return StripeClasses;
            }
            if (prop === 'url') {
                return StripeUrl;
            }
            if (prop === 'pay') {
                return (clientSecret, paymentMethod, save = false) => {
                    payOrSetup(() => {
                        let paymentDetails = getPaymentDetails(paymentMethod, save);
                        if (paymentDetails) {
                            stripeInstance === null || stripeInstance === void 0 ? void 0 : stripeInstance.confirmCardPayment(clientSecret, paymentDetails).then(onSuccess).catch(onError);
                        }
                    }, (!!paymentMethod && typeof paymentMethod === 'string'));
                };
            }
            if (prop === 'setup') {
                return (clientSecret, paymentMethod, save = false) => {
                    payOrSetup(() => {
                        let paymentDetails = getPaymentDetails(paymentMethod, save);
                        if (paymentDetails) {
                            stripeInstance === null || stripeInstance === void 0 ? void 0 : stripeInstance.confirmCardSetup(clientSecret, paymentDetails).then(onSuccess).catch(onError);
                        }
                    }, (!!paymentMethod && typeof paymentMethod === 'string'));
                };
            }
        },
        setter: (prop, value) => {
            if (prop === 'publicKey') {
                StripePublicKey = value;
            }
            else if (prop === 'styles') {
                StripeStyles = value;
            }
            else if (prop === 'classes') {
                StripeClasses = value;
            }
            else if (prop === 'url') {
                StripeUrl = value;
            }
            return true;
        },
        lookup: ['bind', 'active', 'readyCount', 'complete', 'errors', 'instance', 'publicKey', 'styles', 'classes', 'url', 'pay', 'setup'],
    })));
    let bind = () => {
        let resourceConcept = GetGlobal().GetConcept(ResourceConceptName);
        if (StripeUrl && resourceConcept) {
            resourceConcept.GetScript(StripeUrl).then(init);
        }
        else { //Resource not provided
            init();
        }
    };
    if (!options.manual) {
        bind();
    }
});
export function StripeDirectiveHandlerCompact() {
    AddDirectiveHandler(StripeDirectiveHandler);
}
