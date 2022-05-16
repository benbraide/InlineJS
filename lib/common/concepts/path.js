"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinPath = exports.SplitPath = exports.PathToRelative = exports.TidyPath = void 0;
function TidyPath(path) {
    path = (path ? path.trim() : '');
    if (!path) {
        return '';
    }
    return path.replace(/[?][?&]+/g, '?') //Remove all '?' and '&' immediately following a '?'
        .replace(/[&][?&]+/g, '&') //Remove all '?' and '&' immediately following a '&'
        .replace(/[\/?&]+$/, '') //Truncate '/', '?' and '&'
        .replace(/^[\/?&]+/, ''); //Skip '/', '?' and '&'
}
exports.TidyPath = TidyPath;
function PathToRelative(path, origin, prefix) {
    path = TidyPath(path);
    if (path === origin) { //Root
        path = (prefix ? (prefix || '/') : '/');
        return (path.startsWith('/') ? path : `/${path}`);
    }
    if (path.startsWith(`${origin}/`)) { //Skip origin
        path = path.substring(origin.length);
    }
    if (/^[a-zA-Z0-9_]+:\/\//.test(path)) { //Absolute path
        return path;
    }
    if (prefix) {
        path = (path.startsWith('/') ? `${prefix}${path}` : `${prefix}/${path}`);
    }
    return (path.startsWith('/') ? path : `/${path}`);
}
exports.PathToRelative = PathToRelative;
function SplitPath(path, origin, prefix) {
    path = (origin ? PathToRelative(path, origin, prefix) : path);
    let index = path.indexOf('?');
    return {
        base: ((index == -1) ? path : path.substring(0, index)),
        query: ((index == -1) ? '' : path.substring(index + 1)),
    };
}
exports.SplitPath = SplitPath;
function JoinPath(splitPath, origin, prefix, prependOrigin) {
    let base = (origin ? PathToRelative(splitPath.base, origin, prefix) : splitPath.base), query = TidyPath(splitPath.query || ''), path = '';
    if (query) {
        query = query.replace(/^[?&]+/g, '').replace(/[?]+/g, '').replace(/[&]{2,}/g, '&');
        path = (base.includes('?') ? `${base}&${query}` : `${base}?${query}`);
    }
    else {
        path = base;
    }
    return (prependOrigin ? `${origin}${path}` : path);
}
exports.JoinPath = JoinPath;
