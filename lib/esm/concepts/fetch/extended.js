import { NativeFetchConcept } from "./native";
export class ExtendedFetchConcept extends NativeFetchConcept {
    constructor() {
        super(...arguments);
        this.handlers_ = new Array();
    }
    Get(input, init) {
        let handler = this.FindPathHandler_((typeof input === 'string') ? input : input.url);
        return ((handler && handler({ input, init })) || super.Get(input, init));
    }
    AddPathHandler(path, handler) {
        this.handlers_.push({ path, handler });
    }
    RemovePathHandler(handler) {
        this.handlers_ = this.handlers_.filter(info => (info.handler !== handler));
    }
    MockResponse({ response, delay, errorText }) {
        return new Promise((resolve, reject) => {
            let decide = () => {
                let err = (errorText && ((typeof errorText === 'string') ? errorText : errorText()));
                if (err) {
                    reject(err);
                }
                else {
                    resolve(new Response(response));
                }
            };
            if (typeof delay === 'number' && delay > 0) {
                setTimeout(decide, delay);
            }
            else { //No delay
                decide();
            }
        });
    }
    FindPathHandler_(path) {
        let info = this.handlers_.find(info => ((typeof info.path === 'string') ? (info.path === path) : info.path.test(path)));
        return (info ? info.handler : null);
    }
}
