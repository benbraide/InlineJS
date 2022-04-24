import { WaitForGlobal } from './global/get';
import { QuillDirectiveHandlerCompact } from './directive/plugin/quill';

WaitForGlobal().then(() => QuillDirectiveHandlerCompact());
