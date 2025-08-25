"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JoinPath = exports.SplitPath = exports.PathToRelative = exports.TidyPath = void 0;
function TidyPath(path, convertAfterQuery = false) {
    path = (path ? path.trim() : '');
    if (!path) {
        return '';
    }
    path = path.replace(/[?][?&=\/]+/g, '?') //Remove all '/', '=', '?' and '&' immediately following a '?'
        .replace(/[&][?&=\/]+/g, '&') //Remove all '/', '=', '?' and '&' immediately following a '&'
        .replace(/[=][?=\/]+/g, '=') //Remove all '/', '=' and '?' immediately following a '='
        .replace(/[\/][\/=]+/g, '/') //Remove all '/' and '=' immediately following a '/'
        .replace(/[:]{2,}/g, ':') //Replace consecutive ':' with a single instance
        .replace(/[:][\/]([^\/])/g, '://$1') //Convert ':/' to '://'
        .replace(/[\/?&=]+$/, ''); //Truncate '/', '=', '?' and '&'
    !path.startsWith('/?') && (path = path.replace(/^[\/?&=]+/, '')); //Skip '/', '=', '?' and '&'
    convertAfterQuery && (path = path.split(/[?&]/).reduce((prev, part, index) => (prev ? `${prev}${(index < 2) ? '?' : '&'}${part}` : part), '')); //Convert every '?' after the first '=', '?' or '&' to '&'
    return path;
}
exports.TidyPath = TidyPath;
function PathToRelative(path, origin, prefix, convertAfterQuery = false) {
    path = TidyPath(path, convertAfterQuery);
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
    const index = path.indexOf('?');
    return {
        base: ((index == -1) ? path : path.substring(0, index)),
        query: ((index == -1) ? '' : path.substring(index + 1)),
    };
}
exports.SplitPath = SplitPath;
function JoinPath({ base, query }, origin, prefix, prependOrigin, convertAfterQuery = false) {
    let path = `${TidyPath(base, convertAfterQuery)}?${query}`;
    path = (origin ? PathToRelative(path, origin, prefix) : TidyPath(path, convertAfterQuery));
    path = (prependOrigin ? TidyPath(`${origin}/${path}`, convertAfterQuery) : ((path.startsWith('/') || /^[a-zA-Z0-9_]+:\/\//.test(path)) ? path : `/${path}`));
    return path;
}
exports.JoinPath = JoinPath;
