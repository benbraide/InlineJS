import { WaitForGlobal } from './global/get';
import { StripeDirectiveHandlerCompact } from './directive/plugin/stripe';

WaitForGlobal().then(() => StripeDirectiveHandlerCompact());
