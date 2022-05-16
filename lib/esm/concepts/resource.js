var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GetGlobal } from "../global/get";
import { JournalTry } from "../journal/try";
import { PathToRelative } from "./path";
export class Resource {
    constructor(origin_ = '') {
        this.origin_ = origin_;
        this.loadMap_ = {};
        this.origin_ = (this.origin_ || window.location.origin);
        if (this.origin_) { //Remove trailing slashes
            this.origin_ = this.origin_.replace(/\/+$/, '');
        }
    }
    Get({ items, concurrent, attributes }) {
        return this.Get_((Array.isArray(items) ? items : [items]).map((item) => {
            if (typeof item === 'string') {
                if (item.endsWith('.css')) {
                    return Resource.BuildOptions('link', item, attributes);
                }
                if (item.endsWith('.js')) {
                    return Resource.BuildOptions('script', item, attributes);
                }
                return Resource.BuildOptions('data', item, attributes);
            }
            return Resource.BuildOptions(item.type, item.path, attributes);
        }), !!concurrent);
    }
    GetStyle(path, concurrent, attributes) {
        return this.Get_((Array.isArray(path) ? path : [path]).map(item => Resource.BuildOptions('link', item, attributes)), !!concurrent);
    }
    GetScript(path, concurrent, attributes) {
        return this.Get_((Array.isArray(path) ? path : [path]).map(item => Resource.BuildOptions('script', item, attributes)), !!concurrent);
    }
    GetData(path, concurrent, json) {
        return this.Get_((Array.isArray(path) ? path : [path]).map(item => Resource.BuildOptions('data', item, undefined, json)), !!concurrent);
    }
    Get_(info, concurrent) {
        return new Promise((resolve, reject) => {
            var _a;
            let getOne = (info) => {
                if (info.type === 'link') {
                    info.additionalAttributes = (info.additionalAttributes || {});
                    info.additionalAttributes['rel'] = 'stylesheet';
                }
                let path = PathToRelative(info.path, this.origin_);
                if (!path) {
                    return null;
                }
                if (this.loadMap_.hasOwnProperty(path)) {
                    return new Promise((resolve) => {
                        var _a, _b;
                        if ((_a = this.loadMap_[path]) === null || _a === void 0 ? void 0 : _a.callbacks) { //Still loading
                            (_b = this.loadMap_[path].callbacks) === null || _b === void 0 ? void 0 : _b.push(() => resolve(this.loadMap_[path].data));
                        }
                        else { //Loaded
                            resolve(this.loadMap_[path].data);
                        }
                    });
                }
                this.loadMap_[path] = {
                    callbacks: new Array(),
                    data: null,
                };
                let setData = (data) => {
                    var _a;
                    this.loadMap_[path].data = data;
                    (_a = this.loadMap_[path].callbacks) === null || _a === void 0 ? void 0 : _a.forEach(callback => JournalTry(callback, 'InlineJS.ResourceConcept.SetData'));
                    this.loadMap_[path].callbacks = null;
                };
                return new Promise((resolve, reject) => {
                    if (info.type === 'data') {
                        GetGlobal().GetFetchConcept().Get(path, {
                            method: 'GET',
                            credentials: 'same-origin',
                        }).then(response => ((info.attribute === 'json') ? response.json() : response.text())).then((response) => {
                            resolve(response);
                            setData(response);
                        }).catch(reject);
                    }
                    else { //DOM resource
                        let resource = document.createElement(info.type);
                        resource.addEventListener('load', () => {
                            resolve(true);
                            setData(false);
                        });
                        Object.entries(info.additionalAttributes || {}).forEach(([key, value]) => resource.setAttribute(key, value));
                        resource.setAttribute(info.attribute, path);
                        ((info.target && document.querySelector(info.target)) || document.body).append(resource);
                    }
                });
            };
            let getAll = (info) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let values = new Array();
                    for (let entry of info) {
                        let p = getOne(entry);
                        if (p) { //Valid
                            values.push(yield p);
                        }
                    }
                    resolve(values);
                }
                catch (err) {
                    reject(err);
                }
            });
            if (!Array.isArray(info)) {
                (_a = getOne(info)) === null || _a === void 0 ? void 0 : _a.then(resolve).catch(reject);
            }
            else if (concurrent) { //Load resources side by side
                Promise.all(info.map(entry => getOne(entry)).filter(p => !!p)).then(resolve).catch(reject);
            }
            else { //Load resources one by one
                getAll(info);
            }
        });
    }
    static BuildOptions(type, path, attributes, json) {
        return {
            type: type,
            attribute: ((type === 'data') ? (json ? 'json' : 'text') : ((type === 'link') ? 'href' : 'src')),
            target: ((type === 'data') ? null : ((type === 'link') ? 'head' : 'body')),
            path: path,
            additionalAttributes: attributes,
        };
    }
}
