export const NO_OP = '$NO_OP';
export const ERROR_MSG = 'a runtime error occured! Use Inferno in development environment to find the error.';
export const isBrowser = typeof window !== 'undefined' && window.document;
export function toArray(children) {
    return isArray(children) ? children : (children ? [children] : children);
}
// this is MUCH faster than .constructor === Array and instanceof Array
// in Node 7 and the later versions of V8, slower in older versions though
export const isArray = Array.isArray;
export function isStatefulComponent(o) {
    return !isUndefined(o.prototype) && !isUndefined(o.prototype.render);
}
export function isStringOrNumber(obj) {
    const type = typeof obj;
    return type === 'string' || type === 'number';
}
export function isNullOrUndef(obj) {
    return isUndefined(obj) || isNull(obj);
}
export function isInvalid(obj) {
    return isNull(obj) || obj === false || isTrue(obj) || isUndefined(obj);
}
export function isFunction(obj) {
    return typeof obj === 'function';
}
export function isAttrAnEvent(attr) {
    return attr[0] === 'o' && attr[1] === 'n' && attr.length > 3;
}
export function isString(obj) {
    return typeof obj === 'string';
}
export function isNumber(obj) {
    return typeof obj === 'number';
}
export function isNull(obj) {
    return obj === null;
}
export function isTrue(obj) {
    return obj === true;
}
export function isUndefined(obj) {
    return obj === undefined;
}
export function isObject(o) {
    return typeof o === 'object';
}
export function throwError(message) {
    if (!message) {
        message = ERROR_MSG;
    }
    throw new Error(`Inferno Error: ${message}`);
}
export function warning(message) {
    console.warn(message);
}
export function assign(target) {
    for (let i = 1, argumentsLength = arguments.length; i < argumentsLength; i++) {
        let obj = arguments[i];
        if (!isNullOrUndef(obj)) {
            const keys = Object.keys(obj);
            for (let j = 0, keysLength = keys.length; j < keysLength; j++) {
                const key = keys[j];
                target[key] = obj[key];
            }
        }
    }
    return target;
}
export function Lifecycle() {
    this.listeners = [];
}
Lifecycle.prototype.addListener = function addListener(callback) {
    this.listeners.push(callback);
};
Lifecycle.prototype.trigger = function trigger() {
    const listeners = this.listeners;
    for (let i = 0, len = listeners.length; i < len; i++) {
        listeners[i]();
    }
};

/* fuse:end-file "packages/inferno-shared/dist-es/index.js"*/