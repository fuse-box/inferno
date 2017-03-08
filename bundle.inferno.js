(function(FuseBox){FuseBox.$fuse$=FuseBox;
FuseBox.pkg("default", {}, function(___scope___){
/* fuse:start-collection "default"*/
___scope___.file("packages/inferno/src/index.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/index.js"*/
import {
    warning,
    NO_OP
} from '~/packages/inferno-shared/dist-es';
import {
    Props,
    VNode,
    createVNode,
    cloneVNode,
    InfernoInput,
    InfernoChildren
} from './core/VNodes';
import linkEvent from './DOM/events/linkEvent';
import options from './core/options';
import {
    render,
    findDOMNode,
    createRenderer
} from './DOM/rendering';
import { EMPTY_OBJ } from './DOM/utils';
if ("production" !== 'production') {
    const testFunc = function testFn() {
    };
    if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
        warning('It looks like you\'re using a minified copy of the development build ' + 'of Inferno. When deploying Inferno apps to production, make sure to use ' + 'the production build which skips development warnings and is faster. ' + 'See http://infernojs.org for more details.');
    }
}
export const version = 'VERSION';
export default {
    linkEvent,
    createVNode,
    cloneVNode,
    NO_OP,
    EMPTY_OBJ,
    render,
    findDOMNode,
    createRenderer,
    options,
    version
};
export {
    Props,
    VNode,
    InfernoChildren,
    InfernoInput,
    linkEvent,
    createVNode,
    cloneVNode,
    NO_OP,
    EMPTY_OBJ,
    render,
    findDOMNode,
    createRenderer,
    options
};
export {
    isUnitlessNumber as internal_isUnitlessNumber
} from './DOM/constants';
export {
    normalize as internal_normalize
} from './core/normalization';
/* fuse:end-file "packages/inferno/src/index.js"*/
});
___scope___.file("packages/inferno-shared/dist-es/index.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno-shared/dist-es/index.js"*/
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
});
___scope___.file("packages/inferno/src/core/VNodes.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/core/VNodes.js"*/
import {
    isArray,
    isInvalid,
    isNullOrUndef,
    isStatefulComponent,
    isUndefined,
    assign
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import { normalize } from './normalization';
import options from './options';
import { EMPTY_OBJ } from '../DOM/utils';
export function createVNode(flags, type, props, children, events, key, ref, noNormalise) {
    if (flags & VNodeFlags.ComponentUnknown) {
        flags = isStatefulComponent(type) ? VNodeFlags.ComponentClass : VNodeFlags.ComponentFunction;
    }
    const vNode = {
        children: isUndefined(children) ? null : children,
        dom: null,
        events: events || null,
        flags,
        key: isUndefined(key) ? null : key,
        props: props || null,
        ref: ref || null,
        type
    };
    if (!noNormalise) {
        normalize(vNode);
    }
    if (options.createVNode) {
        options.createVNode(vNode);
    }
    return vNode;
}
export function cloneVNode(vNodeToClone, props) {
    let restParamLength = arguments.length - 2;
    let children;
    if (restParamLength > 0) {
        if (!props) {
            props = {};
        }
        if (restParamLength === 1) {
            children = arguments[2];
        } else {
            children = [];
            while (restParamLength-- > 0) {
                children[restParamLength] = arguments[restParamLength + 2];
            }
        }
        if (isUndefined(props.children)) {
            props.children = children;
        } else {
            if (isArray(children)) {
                if (isArray(props.children)) {
                    props.children = props.children.concat(children);
                } else {
                    props.children = [props.children].concat(children);
                }
            } else {
                if (isArray(props.children)) {
                    props.children.push(children);
                } else {
                    props.children = [props.children];
                    props.children.push(children);
                }
            }
        }
    }
    let newVNode;
    if (isArray(vNodeToClone)) {
        const tmpArray = [];
        for (let i = 0, len = vNodeToClone.length; i < len; i++) {
            tmpArray.push(cloneVNode(vNodeToClone[i]));
        }
        newVNode = tmpArray;
    } else {
        const flags = vNodeToClone.flags;
        const events = vNodeToClone.events || props && props.events || null;
        const key = !isNullOrUndef(vNodeToClone.key) ? vNodeToClone.key : props ? props.key : null;
        const ref = vNodeToClone.ref || (props ? props.ref : null);
        if (flags & VNodeFlags.Component) {
            newVNode = createVNode(flags, vNodeToClone.type, !vNodeToClone.props && !props ? EMPTY_OBJ : assign({}, vNodeToClone.props, props), null, events, key, ref, true);
            const newProps = newVNode.props;
            if (newProps) {
                const newChildren = newProps.children;
                if (newChildren) {
                    if (isArray(newChildren)) {
                        const len = newChildren.length;
                        if (len > 0) {
                            const tmpArray = [];
                            for (let i = 0; i < len; i++) {
                                const child = newChildren[i];
                                if (!isInvalid(child) && isVNode(child)) {
                                    tmpArray.push(cloneVNode(child));
                                }
                            }
                            newProps.children = tmpArray;
                        }
                    } else if (isVNode(newChildren)) {
                        newProps.children = cloneVNode(newChildren);
                    }
                }
            }
            newVNode.children = null;
        } else if (flags & VNodeFlags.Element) {
            children = props && props.children || vNodeToClone.children;
            newVNode = createVNode(flags, vNodeToClone.type, !vNodeToClone.props && !props ? EMPTY_OBJ : assign({}, vNodeToClone.props, props), children, events, key, ref, !children);
        } else if (flags & VNodeFlags.Text) {
            newVNode = createTextVNode(vNodeToClone.children, key);
        }
    }
    return newVNode;
}
export function createVoidVNode() {
    return createVNode(VNodeFlags.Void);
}
export function createTextVNode(text, key) {
    return createVNode(VNodeFlags.Text, null, null, text, null, key);
}
export function isVNode(o) {
    return !!o.flags;
}
/* fuse:end-file "packages/inferno/src/core/VNodes.js"*/
});
___scope___.file("packages/inferno/src/core/normalization.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/core/normalization.js"*/
import {
    isArray,
    isInvalid,
    isNull,
    isNullOrUndef,
    isNumber,
    isString,
    isStringOrNumber,
    warning,
    isUndefined
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import {
    cloneVNode,
    createTextVNode,
    isVNode
} from './VNodes';
function applyKey(key, vNode) {
    vNode.key = key;
    return vNode;
}
function applyKeyIfMissing(key, vNode) {
    if (isNumber(key)) {
        key = `.${ key }`;
    }
    if (isNull(vNode.key) || vNode.key[0] === '.') {
        return applyKey(key, vNode);
    }
    return vNode;
}
function applyKeyPrefix(key, vNode) {
    vNode.key = key + vNode.key;
    return vNode;
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (let len = nodes.length; index < len; index++) {
        let n = nodes[index];
        const key = `${ currentKey }.${ index }`;
        if (!isInvalid(n)) {
            if (isArray(n)) {
                _normalizeVNodes(n, result, 0, key);
            } else {
                if (isStringOrNumber(n)) {
                    n = createTextVNode(n, null);
                } else if (isVNode(n) && n.dom || n.key && n.key[0] === '.') {
                    n = cloneVNode(n);
                }
                if (isNull(n.key) || n.key[0] === '.') {
                    n = applyKey(key, n);
                } else {
                    n = applyKeyPrefix(currentKey, n);
                }
                result.push(n);
            }
        }
    }
}
export function normalizeVNodes(nodes) {
    let newNodes;
    if (nodes['$']) {
        nodes = nodes.slice();
    } else {
        nodes['$'] = true;
    }
    for (let i = 0, len = nodes.length; i < len; i++) {
        const n = nodes[i];
        if (isInvalid(n) || isArray(n)) {
            const result = (newNodes || nodes).slice(0, i);
            _normalizeVNodes(nodes, result, i, ``);
            return result;
        } else if (isStringOrNumber(n)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, createTextVNode(n, null)));
        } else if (isVNode(n) && n.dom || isNull(n.key) && !(n.flags & VNodeFlags.HasNonKeyedChildren)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
        } else if (newNodes) {
            newNodes.push(applyKeyIfMissing(i, cloneVNode(n)));
        }
    }
    return newNodes || nodes;
}
function normalizeChildren(children) {
    if (isArray(children)) {
        return normalizeVNodes(children);
    } else if (isVNode(children) && children.dom) {
        return cloneVNode(children);
    }
    return children;
}
function normalizeProps(vNode, props, children) {
    if (!(vNode.flags & VNodeFlags.Component) && isNullOrUndef(children) && !isNullOrUndef(props.children)) {
        vNode.children = props.children;
    }
    if (props.ref) {
        vNode.ref = props.ref;
        delete props.ref;
    }
    if (props.events) {
        vNode.events = props.events;
    }
    if (!isNullOrUndef(props.key)) {
        vNode.key = props.key;
        delete props.key;
    }
}
function normalizeElement(type, vNode) {
    if (type === 'svg') {
        vNode.flags = VNodeFlags.SvgElement;
    } else if (type === 'input') {
        vNode.flags = VNodeFlags.InputElement;
    } else if (type === 'select') {
        vNode.flags = VNodeFlags.SelectElement;
    } else if (type === 'textarea') {
        vNode.flags = VNodeFlags.TextareaElement;
    } else if (type === 'media') {
        vNode.flags = VNodeFlags.MediaElement;
    } else {
        vNode.flags = VNodeFlags.HtmlElement;
    }
}
export function normalize(vNode) {
    let props = vNode.props;
    const type = vNode.type;
    let children = vNode.children;
    if (vNode.flags & VNodeFlags.Component) {
        const defaultProps = type.defaultProps;
        if (!isNullOrUndef(defaultProps)) {
            if (!props) {
                props = vNode.props = defaultProps;
            } else {
                for (let prop in defaultProps) {
                    if (isUndefined(props[prop])) {
                        props[prop] = defaultProps[prop];
                    }
                }
            }
        }
        if (isString(type)) {
            normalizeElement(type, vNode);
            if (props && props.children) {
                vNode.children = props.children;
                children = props.children;
            }
        }
    }
    if (props) {
        normalizeProps(vNode, props, children);
    }
    if (!isInvalid(children)) {
        vNode.children = normalizeChildren(children);
    }
    if (props && !isInvalid(props.children)) {
        props.children = normalizeChildren(props.children);
    }
    if ("production" !== 'production') {
        const verifyKeys = function (vNodes) {
            const keyValues = vNodes.map(function (vnode) {
                return vnode.key;
            });
            keyValues.some(function (item, idx) {
                const hasDuplicate = keyValues.indexOf(item) !== idx;
                if (hasDuplicate) {
                    warning('Inferno normalisation(...): Encountered two children with same key, all keys must be unique within its siblings. Duplicated key is:' + item);
                }
                return hasDuplicate;
            });
        };
        if (vNode.children && Array.isArray(vNode.children)) {
            verifyKeys(vNode.children);
        }
    }
}
/* fuse:end-file "packages/inferno/src/core/normalization.js"*/
});
___scope___.file("packages/inferno/src/core/options.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/core/options.js"*/
export default {
    recyclingEnabled: false,
    findDOMNodeEnabled: false,
    roots: null,
    createVNode: null,
    beforeRender: null,
    afterRender: null,
    afterMount: null,
    afterUpdate: null,
    beforeUnmount: null
};

/* fuse:end-file "packages/inferno/src/core/options.js"*/
});
___scope___.file("packages/inferno/src/DOM/utils.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/DOM/utils.js"*/
import {
    assign,
    isArray,
    isFunction,
    isInvalid,
    isNullOrUndef,
    isStringOrNumber,
    isUndefined,
    throwError
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import options from '../core/options';
import {
    cloneVNode,
    createTextVNode,
    createVoidVNode
} from '../core/VNodes';
import { svgNS } from './constants';
import { mount } from './mounting';
import { patch } from './patching';
import { componentToDOMNodeMap } from './rendering';
import { unmount } from './unmounting';
export const EMPTY_OBJ = {};
if ("production" !== 'production') {
    Object.freeze(EMPTY_OBJ);
}
export function createClassComponentInstance(vNode, Component, props, context, isSVG) {
    if (isUndefined(context)) {
        context = EMPTY_OBJ;
    }
    const instance = new Component(props, context);
    instance.context = context;
    if (instance.props === EMPTY_OBJ) {
        instance.props = props;
    }
    instance._patch = patch;
    if (options.findDOMNodeEnabled) {
        instance._componentToDOMNodeMap = componentToDOMNodeMap;
    }
    instance._unmounted = false;
    instance._pendingSetState = true;
    instance._isSVG = isSVG;
    if (isFunction(instance.componentWillMount)) {
        instance.componentWillMount();
    }
    const childContext = instance.getChildContext();
    if (isNullOrUndef(childContext)) {
        instance._childContext = context;
    } else {
        instance._childContext = assign({}, context, childContext);
    }
    options.beforeRender && options.beforeRender(instance);
    let input = instance.render(props, instance.state, context);
    options.afterRender && options.afterRender(instance);
    if (isArray(input)) {
        if ("production" !== 'production') {
            throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        throwError();
    } else if (isInvalid(input)) {
        input = createVoidVNode();
    } else if (isStringOrNumber(input)) {
        input = createTextVNode(input, null);
    } else {
        if (input.dom) {
            input = cloneVNode(input);
        }
        if (input.flags & VNodeFlags.Component) {
            input.parentVNode = vNode;
        }
    }
    instance._pendingSetState = false;
    instance._lastInput = input;
    return instance;
}
export function replaceLastChildAndUnmount(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling) {
    replaceVNode(parentDom, mount(nextInput, null, lifecycle, context, isSVG), lastInput, lifecycle, isRecycling);
}
export function replaceVNode(parentDom, dom, vNode, lifecycle, isRecycling) {
    unmount(vNode, null, lifecycle, false, isRecycling);
    if (vNode.flags & VNodeFlags.Component) {
        vNode = vNode.children._lastInput || vNode.children;
    }
    replaceChild(parentDom, dom, vNode.dom);
}
export function createFunctionalComponentInput(vNode, component, props, context) {
    let input = component(props, context);
    if (isArray(input)) {
        if (process.env.NODE_ENV !== 'production') {
            throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        throwError();
    } else if (isInvalid(input)) {
        input = createVoidVNode();
    } else if (isStringOrNumber(input)) {
        input = createTextVNode(input, null);
    } else {
        if (input.dom) {
            input = cloneVNode(input);
        }
        if (input.flags & VNodeFlags.Component) {
            input.parentVNode = vNode;
        }
    }
    return input;
}
export function setTextContent(dom, text) {
    if (text !== '') {
        dom.textContent = text;
    } else {
        dom.appendChild(document.createTextNode(''));
    }
}
export function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
}
export function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}
export function insertOrAppend(parentDom, newNode, nextNode) {
    if (isNullOrUndef(nextNode)) {
        appendChild(parentDom, newNode);
    } else {
        parentDom.insertBefore(newNode, nextNode);
    }
}
export function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(svgNS, tag);
    } else {
        return document.createElement(tag);
    }
}
export function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    unmount(lastNode, null, lifecycle, false, isRecycling);
    const dom = mount(nextNode, null, lifecycle, context, isSVG);
    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}
export function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
}
export function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}
export function removeAllChildren(dom, children, lifecycle, isRecycling) {
    dom.textContent = '';
    if (!options.recyclingEnabled || options.recyclingEnabled && !isRecycling) {
        removeChildren(null, children, lifecycle, isRecycling);
    }
}
export function removeChildren(dom, children, lifecycle, isRecycling) {
    for (let i = 0, len = children.length; i < len; i++) {
        const child = children[i];
        if (!isInvalid(child)) {
            unmount(child, dom, lifecycle, true, isRecycling);
        }
    }
}
export function isKeyed(lastChildren, nextChildren) {
    return nextChildren.length && !isNullOrUndef(nextChildren[0]) && !isNullOrUndef(nextChildren[0].key) && lastChildren.length && !isNullOrUndef(lastChildren[0]) && !isNullOrUndef(lastChildren[0].key);
}
/* fuse:end-file "packages/inferno/src/DOM/utils.js"*/
});
___scope___.file("packages/inferno/src/DOM/constants.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/constants.js"*/
export const xlinkNS = 'http://www.w3.org/1999/xlink';
export const xmlNS = 'http://www.w3.org/XML/1998/namespace';
export const svgNS = 'http://www.w3.org/2000/svg';
export const strictProps = Object.create(null);
strictProps.volume = true;
strictProps.defaultChecked = true;
export const booleanProps = Object.create(null);
booleanProps.muted = 1;
booleanProps.scoped = 1;
booleanProps.loop = 1;
booleanProps.open = 1;
booleanProps.checked = 1;
booleanProps.default = 1;
booleanProps.capture = 1;
booleanProps.disabled = 1;
booleanProps.readOnly = 1;
booleanProps.required = 1;
booleanProps.autoplay = 1;
booleanProps.controls = 1;
booleanProps.seamless = 1;
booleanProps.reversed = 1;
booleanProps.allowfullscreen = 1;
booleanProps.novalidate = 1;
booleanProps.hidden = 1;
export const namespaces = Object.create(null);
namespaces['xlink:href'] = xlinkNS;
namespaces['xlink:arcrole'] = xlinkNS;
namespaces['xlink:actuate'] = xlinkNS;
namespaces['xlink:role'] = xlinkNS;
namespaces['xlink:titlef'] = xlinkNS;
namespaces['xlink:type'] = xlinkNS;
namespaces['xml:base'] = xmlNS;
namespaces['xml:lang'] = xmlNS;
namespaces['xml:space'] = xmlNS;
export const isUnitlessNumber = Object.create(null);
isUnitlessNumber.animationIterationCount = 1;
isUnitlessNumber.borderImageOutset = 1;
isUnitlessNumber.borderImageSlice = 1;
isUnitlessNumber.borderImageWidth = 1;
isUnitlessNumber.boxFlex = 1;
isUnitlessNumber.boxFlexGroup = 1;
isUnitlessNumber.boxOrdinalGroup = 1;
isUnitlessNumber.columnCount = 1;
isUnitlessNumber.flex = 1;
isUnitlessNumber.flexGrow = 1;
isUnitlessNumber.flexPositive = 1;
isUnitlessNumber.flexShrink = 1;
isUnitlessNumber.flexNegative = 1;
isUnitlessNumber.flexOrder = 1;
isUnitlessNumber.gridRow = 1;
isUnitlessNumber.gridColumn = 1;
isUnitlessNumber.fontWeight = 1;
isUnitlessNumber.lineClamp = 1;
isUnitlessNumber.lineHeight = 1;
isUnitlessNumber.opacity = 1;
isUnitlessNumber.order = 1;
isUnitlessNumber.orphans = 1;
isUnitlessNumber.tabSize = 1;
isUnitlessNumber.widows = 1;
isUnitlessNumber.zIndex = 1;
isUnitlessNumber.zoom = 1;
isUnitlessNumber.fillOpacity = 1;
isUnitlessNumber.floodOpacity = 1;
isUnitlessNumber.stopOpacity = 1;
isUnitlessNumber.strokeDasharray = 1;
isUnitlessNumber.strokeDashoffset = 1;
isUnitlessNumber.strokeMiterlimit = 1;
isUnitlessNumber.strokeOpacity = 1;
isUnitlessNumber.strokeWidth = 1;
export const skipProps = Object.create(null);
skipProps.children = 1;
skipProps.childrenType = 1;
skipProps.defaultValue = 1;
skipProps.ref = 1;
skipProps.key = 1;
skipProps.selected = 1;
skipProps.checked = 1;
skipProps.multiple = 1;
export const delegatedProps = Object.create(null);
delegatedProps.onClick = 1;
delegatedProps.onMouseDown = 1;
delegatedProps.onMouseUp = 1;
delegatedProps.onMouseMove = 1;
delegatedProps.onSubmit = 1;
delegatedProps.onDblClick = 1;
delegatedProps.onKeyDown = 1;
delegatedProps.onKeyUp = 1;
delegatedProps.onKeyPress = 1;

/* fuse:end-file "packages/inferno/src/DOM/constants.js"*/
});
___scope___.file("packages/inferno/src/DOM/mounting.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/DOM/mounting.js"*/
import {
    isArray,
    isFunction,
    isInvalid,
    isNull,
    isNullOrUndef,
    isObject,
    isStringOrNumber,
    isUndefined,
    throwError
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import options from '../core/options';
import {
    cloneVNode,
    isVNode
} from '../core/VNodes';
import {
    patchEvent,
    patchProp
} from './patching';
import {
    recycleComponent,
    recycleElement
} from './recycling';
import { componentToDOMNodeMap } from './rendering';
import {
    appendChild,
    createClassComponentInstance,
    createFunctionalComponentInput,
    documentCreateElement,
    setTextContent,
    EMPTY_OBJ
} from './utils';
import processElement from './wrappers/processElement';
export function mount(vNode, parentDom, lifecycle, context, isSVG) {
    const flags = vNode.flags;
    if (flags & VNodeFlags.Element) {
        return mountElement(vNode, parentDom, lifecycle, context, isSVG);
    } else if (flags & VNodeFlags.Component) {
        return mountComponent(vNode, parentDom, lifecycle, context, isSVG, flags & VNodeFlags.ComponentClass);
    } else if (flags & VNodeFlags.Void) {
        return mountVoid(vNode, parentDom);
    } else if (flags & VNodeFlags.Text) {
        return mountText(vNode, parentDom);
    } else {
        if ("production" !== 'production') {
            if (typeof vNode === 'object') {
                throwError(`mount() received an object that's not a valid VNode, you should stringify it first. Object: "${ JSON.stringify(vNode) }".`);
            } else {
                throwError(`mount() expects a valid VNode, instead it received an object with the type "${ typeof vNode }".`);
            }
        }
        throwError();
    }
}
export function mountText(vNode, parentDom) {
    const dom = document.createTextNode(vNode.children);
    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}
export function mountVoid(vNode, parentDom) {
    const dom = document.createTextNode('');
    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}
export function mountElement(vNode, parentDom, lifecycle, context, isSVG) {
    if (options.recyclingEnabled) {
        const dom = recycleElement(vNode, lifecycle, context, isSVG);
        if (!isNull(dom)) {
            if (!isNull(parentDom)) {
                appendChild(parentDom, dom);
            }
            return dom;
        }
    }
    const flags = vNode.flags;
    if (isSVG || flags & VNodeFlags.SvgElement) {
        isSVG = true;
    }
    const dom = documentCreateElement(vNode.type, isSVG);
    const children = vNode.children;
    const props = vNode.props;
    const events = vNode.events;
    const ref = vNode.ref;
    vNode.dom = dom;
    if (!isInvalid(children)) {
        if (isStringOrNumber(children)) {
            setTextContent(dom, children);
        } else if (isArray(children)) {
            mountArrayChildren(children, dom, lifecycle, context, isSVG);
        } else if (isVNode(children)) {
            mount(children, dom, lifecycle, context, isSVG);
        }
    }
    let hasControlledValue = false;
    if (!(flags & VNodeFlags.HtmlElement)) {
        hasControlledValue = processElement(flags, vNode, dom, true);
    }
    if (!isNull(props)) {
        for (let prop in props) {
            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
    }
    if (!isNull(events)) {
        for (let name in events) {
            patchEvent(name, null, events[name], dom);
        }
    }
    if (!isNull(ref)) {
        mountRef(dom, ref, lifecycle);
    }
    if (!isNull(parentDom)) {
        appendChild(parentDom, dom);
    }
    return dom;
}
export function mountArrayChildren(children, dom, lifecycle, context, isSVG) {
    for (let i = 0, len = children.length; i < len; i++) {
        let child = children[i];
        if (!isInvalid(child)) {
            if (child.dom) {
                children[i] = child = cloneVNode(child);
            }
            mount(children[i], dom, lifecycle, context, isSVG);
        }
    }
}
export function mountComponent(vNode, parentDom, lifecycle, context, isSVG, isClass) {
    if (options.recyclingEnabled) {
        const dom = recycleComponent(vNode, lifecycle, context, isSVG);
        if (!isNull(dom)) {
            if (!isNull(parentDom)) {
                appendChild(parentDom, dom);
            }
            return dom;
        }
    }
    const type = vNode.type;
    const props = vNode.props || EMPTY_OBJ;
    const ref = vNode.ref;
    let dom;
    if (isClass) {
        const instance = createClassComponentInstance(vNode, type, props, context, isSVG);
        const input = instance._lastInput;
        instance._vNode = vNode;
        vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);
        if (!isNull(parentDom)) {
            appendChild(parentDom, dom);
        }
        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, dom);
        vNode.children = instance;
    } else {
        const input = createFunctionalComponentInput(vNode, type, props, context);
        vNode.dom = dom = mount(input, null, lifecycle, context, isSVG);
        vNode.children = input;
        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
        if (!isNull(parentDom)) {
            appendChild(parentDom, dom);
        }
    }
    return dom;
}
export function mountClassComponentCallbacks(vNode, ref, instance, lifecycle) {
    if (ref) {
        if (isFunction(ref)) {
            ref(instance);
        } else {
            if ("production" !== 'production') {
                if (isStringOrNumber(ref)) {
                    throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
                } else if (isObject(ref) && vNode.flags & VNodeFlags.ComponentClass) {
                    throwError('functional component lifecycle events are not supported on ES2015 class components.');
                } else {
                    throwError(`a bad value for "ref" was used on component: "${ JSON.stringify(ref) }"`);
                }
            }
            throwError();
        }
    }
    const cDM = instance.componentDidMount;
    const afterMount = options.afterMount;
    if (!isUndefined(cDM) || !isNull(afterMount)) {
        lifecycle.addListener(() => {
            afterMount && afterMount(vNode);
            cDM && instance.componentDidMount();
            instance._syncSetState = true;
        });
    } else {
        instance._syncSetState = true;
    }
}
export function mountFunctionalComponentCallbacks(ref, dom, lifecycle) {
    if (ref) {
        if (!isNullOrUndef(ref.onComponentWillMount)) {
            ref.onComponentWillMount();
        }
        if (!isNullOrUndef(ref.onComponentDidMount)) {
            lifecycle.addListener(() => ref.onComponentDidMount(dom));
        }
    }
}
export function mountRef(dom, value, lifecycle) {
    if (isFunction(value)) {
        lifecycle.addListener(() => value(dom));
    } else {
        if (isInvalid(value)) {
            return;
        }
        if (process.env.NODE_ENV !== 'production') {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        throwError();
    }
}
/* fuse:end-file "packages/inferno/src/DOM/mounting.js"*/
});
___scope___.file("packages/inferno/src/DOM/patching.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/DOM/patching.js"*/
import {
    assign,
    isArray,
    isAttrAnEvent,
    isFunction,
    isInvalid,
    isNull,
    isNullOrUndef,
    isNumber,
    isObject,
    isString,
    isStringOrNumber,
    isUndefined,
    NO_OP,
    throwError
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import options from '../core/options';
import {
    cloneVNode,
    createTextVNode,
    createVoidVNode,
    isVNode
} from '../core/VNodes';
import {
    booleanProps,
    delegatedProps,
    isUnitlessNumber,
    namespaces,
    skipProps,
    strictProps
} from './constants';
import { handleEvent } from './events/delegation';
import {
    mount,
    mountArrayChildren,
    mountComponent,
    mountElement,
    mountRef,
    mountText,
    mountVoid
} from './mounting';
import {
    appendChild,
    insertOrAppend,
    isKeyed,
    removeAllChildren,
    replaceChild,
    replaceLastChildAndUnmount,
    replaceVNode,
    replaceWithNewNode,
    setTextContent,
    updateTextContent,
    EMPTY_OBJ
} from './utils';
import { componentToDOMNodeMap } from './rendering';
import { unmount } from './unmounting';
import processElement from './wrappers/processElement';
export function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    if (lastVNode !== nextVNode) {
        const lastFlags = lastVNode.flags;
        const nextFlags = nextVNode.flags;
        if (nextFlags & VNodeFlags.Component) {
            if (lastFlags & VNodeFlags.Component) {
                patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, nextFlags & VNodeFlags.ComponentClass, isRecycling);
            } else {
                replaceVNode(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, nextFlags & VNodeFlags.ComponentClass), lastVNode, lifecycle, isRecycling);
            }
        } else if (nextFlags & VNodeFlags.Element) {
            if (lastFlags & VNodeFlags.Element) {
                patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
            } else {
                replaceVNode(parentDom, mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);
            }
        } else if (nextFlags & VNodeFlags.Text) {
            if (lastFlags & VNodeFlags.Text) {
                patchText(lastVNode, nextVNode);
            } else {
                replaceVNode(parentDom, mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);
            }
        } else if (nextFlags & VNodeFlags.Void) {
            if (lastFlags & VNodeFlags.Void) {
                patchVoid(lastVNode, nextVNode);
            } else {
                replaceVNode(parentDom, mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);
            }
        } else {
            replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
function unmountChildren(children, dom, lifecycle, isRecycling) {
    if (isVNode(children)) {
        unmount(children, dom, lifecycle, true, isRecycling);
    } else if (isArray(children)) {
        removeAllChildren(dom, children, lifecycle, isRecycling);
    } else {
        dom.textContent = '';
    }
}
export function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    const nextTag = nextVNode.type;
    const lastTag = lastVNode.type;
    if (lastTag !== nextTag) {
        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
    } else {
        const dom = lastVNode.dom;
        const lastProps = lastVNode.props;
        const nextProps = nextVNode.props;
        const lastChildren = lastVNode.children;
        const nextChildren = nextVNode.children;
        const lastFlags = lastVNode.flags;
        const nextFlags = nextVNode.flags;
        const nextRef = nextVNode.ref;
        const lastEvents = lastVNode.events;
        const nextEvents = nextVNode.events;
        nextVNode.dom = dom;
        if (isSVG || nextFlags & VNodeFlags.SvgElement) {
            isSVG = true;
        }
        if (lastChildren !== nextChildren) {
            patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
        let hasControlledValue = false;
        if (!(nextFlags & VNodeFlags.HtmlElement)) {
            hasControlledValue = processElement(nextFlags, nextVNode, dom, false);
        }
        if (lastProps !== nextProps) {
            const lastPropsOrEmpty = lastProps || EMPTY_OBJ;
            const nextPropsOrEmpty = nextProps || EMPTY_OBJ;
            if (nextPropsOrEmpty !== EMPTY_OBJ) {
                for (let prop in nextPropsOrEmpty) {
                    const nextValue = nextPropsOrEmpty[prop];
                    const lastValue = lastPropsOrEmpty[prop];
                    if (isNullOrUndef(nextValue)) {
                        removeProp(prop, nextValue, dom);
                    } else {
                        patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);
                    }
                }
            }
            if (lastPropsOrEmpty !== EMPTY_OBJ) {
                for (let prop in lastPropsOrEmpty) {
                    if (isNullOrUndef(nextPropsOrEmpty[prop])) {
                        removeProp(prop, lastPropsOrEmpty[prop], dom);
                    }
                }
            }
        }
        if (lastEvents !== nextEvents) {
            patchEvents(lastEvents, nextEvents, dom);
        }
        if (nextRef) {
            if (lastVNode.ref !== nextRef || isRecycling) {
                mountRef(dom, nextRef, lifecycle);
            }
        }
    }
}
function patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    let patchArray = false;
    let patchKeyed = false;
    if (nextFlags & VNodeFlags.HasNonKeyedChildren) {
        patchArray = true;
    } else if (lastFlags & VNodeFlags.HasKeyedChildren && nextFlags & VNodeFlags.HasKeyedChildren) {
        patchKeyed = true;
        patchArray = true;
    } else if (isInvalid(nextChildren)) {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
    } else if (isInvalid(lastChildren)) {
        if (isStringOrNumber(nextChildren)) {
            setTextContent(dom, nextChildren);
        } else {
            if (isArray(nextChildren)) {
                mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
            } else {
                mount(nextChildren, dom, lifecycle, context, isSVG);
            }
        }
    } else if (isStringOrNumber(nextChildren)) {
        if (isStringOrNumber(lastChildren)) {
            updateTextContent(dom, nextChildren);
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            setTextContent(dom, nextChildren);
        }
    } else if (isArray(nextChildren)) {
        if (isArray(lastChildren)) {
            patchArray = true;
            if (isKeyed(lastChildren, nextChildren)) {
                patchKeyed = true;
            }
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
        }
    } else if (isArray(lastChildren)) {
        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
        mount(nextChildren, dom, lifecycle, context, isSVG);
    } else if (isVNode(nextChildren)) {
        if (isVNode(lastChildren)) {
            patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mount(nextChildren, dom, lifecycle, context, isSVG);
        }
    }
    if (patchArray) {
        if (patchKeyed) {
            patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        } else {
            patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
export function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {
    const lastType = lastVNode.type;
    const nextType = nextVNode.type;
    const lastKey = lastVNode.key;
    const nextKey = nextVNode.key;
    if (lastType !== nextType || lastKey !== nextKey) {
        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        return false;
    } else {
        const nextProps = nextVNode.props || EMPTY_OBJ;
        if (isClass) {
            const instance = lastVNode.children;
            if (instance._unmounted) {
                if (isNull(parentDom)) {
                    return true;
                }
                replaceChild(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, nextVNode.flags & VNodeFlags.ComponentClass), lastVNode.dom);
            } else {
                const lastState = instance.state;
                const nextState = instance.state;
                const lastProps = instance.props;
                let childContext = instance.getChildContext();
                nextVNode.children = instance;
                instance._isSVG = isSVG;
                instance._syncSetState = false;
                if (isNullOrUndef(childContext)) {
                    childContext = context;
                } else {
                    childContext = assign({}, context, childContext);
                }
                const lastInput = instance._lastInput;
                let nextInput = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false);
                let didUpdate = true;
                instance._childContext = childContext;
                if (isInvalid(nextInput)) {
                    nextInput = createVoidVNode();
                } else if (nextInput === NO_OP) {
                    nextInput = lastInput;
                    didUpdate = false;
                } else if (isStringOrNumber(nextInput)) {
                    nextInput = createTextVNode(nextInput, null);
                } else if (isArray(nextInput)) {
                    if ("production" !== 'production') {
                        throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
                    }
                    throwError();
                } else if (isObject(nextInput) && nextInput.dom) {
                    nextInput = cloneVNode(nextInput);
                }
                if (nextInput.flags & VNodeFlags.Component) {
                    nextInput.parentVNode = nextVNode;
                } else if (lastInput.flags & VNodeFlags.Component) {
                    lastInput.parentVNode = nextVNode;
                }
                instance._lastInput = nextInput;
                instance._vNode = nextVNode;
                if (didUpdate) {
                    patch(lastInput, nextInput, parentDom, lifecycle, childContext, isSVG, isRecycling);
                    instance.componentDidUpdate(lastProps, lastState);
                    options.afterUpdate && options.afterUpdate(nextVNode);
                    options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, nextInput.dom);
                }
                instance._syncSetState = true;
                nextVNode.dom = nextInput.dom;
            }
        } else {
            let shouldUpdate = true;
            const lastProps = lastVNode.props;
            const nextHooks = nextVNode.ref;
            const nextHooksDefined = !isNullOrUndef(nextHooks);
            const lastInput = lastVNode.children;
            let nextInput = lastInput;
            nextVNode.dom = lastVNode.dom;
            nextVNode.children = lastInput;
            if (lastKey !== nextKey) {
                shouldUpdate = true;
            } else {
                if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentShouldUpdate)) {
                    shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps, nextProps);
                }
            }
            if (shouldUpdate !== false) {
                if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentWillUpdate)) {
                    nextHooks.onComponentWillUpdate(lastProps, nextProps);
                }
                nextInput = nextType(nextProps, context);
                if (isInvalid(nextInput)) {
                    nextInput = createVoidVNode();
                } else if (isStringOrNumber(nextInput) && nextInput !== NO_OP) {
                    nextInput = createTextVNode(nextInput, null);
                } else if (isArray(nextInput)) {
                    if ("production" !== 'production') {
                        throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
                    }
                    throwError();
                } else if (isObject(nextInput) && nextInput.dom) {
                    nextInput = cloneVNode(nextInput);
                }
                if (nextInput !== NO_OP) {
                    patch(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling);
                    nextVNode.children = nextInput;
                    if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentDidUpdate)) {
                        nextHooks.onComponentDidUpdate(lastProps, nextProps);
                    }
                    nextVNode.dom = nextInput.dom;
                }
            }
            if (nextInput.flags & VNodeFlags.Component) {
                nextInput.parentVNode = nextVNode;
            } else if (lastInput.flags & VNodeFlags.Component) {
                lastInput.parentVNode = nextVNode;
            }
        }
    }
    return false;
}
export function patchText(lastVNode, nextVNode) {
    const nextText = nextVNode.children;
    const dom = lastVNode.dom;
    nextVNode.dom = dom;
    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}
export function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}
export function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    const lastChildrenLength = lastChildren.length;
    const nextChildrenLength = nextChildren.length;
    const commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    let i = 0;
    for (; i < commonLength; i++) {
        let nextChild = nextChildren[i];
        if (nextChild.dom) {
            nextChild = nextChildren[i] = cloneVNode(nextChild);
        }
        patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; i++) {
            let nextChild = nextChildren[i];
            if (nextChild.dom) {
                nextChild = nextChildren[i] = cloneVNode(nextChild);
            }
            appendChild(dom, mount(nextChild, null, lifecycle, context, isSVG));
        }
    } else if (nextChildrenLength === 0) {
        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
    } else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; i++) {
            unmount(lastChildren[i], dom, lifecycle, false, isRecycling);
        }
    }
}
export function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling) {
    let aLength = a.length;
    let bLength = b.length;
    let aEnd = aLength - 1;
    let bEnd = bLength - 1;
    let aStart = 0;
    let bStart = 0;
    let i;
    let j;
    let aNode;
    let bNode;
    let nextNode;
    let nextPos;
    let node;
    if (aLength === 0) {
        if (bLength !== 0) {
            mountArrayChildren(b, dom, lifecycle, context, isSVG);
        }
        return;
    } else if (bLength === 0) {
        removeAllChildren(dom, a, lifecycle, isRecycling);
        return;
    }
    let aStartNode = a[aStart];
    let bStartNode = b[bStart];
    let aEndNode = a[aEnd];
    let bEndNode = b[bEnd];
    if (bStartNode.dom) {
        b[bStart] = bStartNode = cloneVNode(bStartNode);
    }
    if (bEndNode.dom) {
        b[bEnd] = bEndNode = cloneVNode(bEndNode);
    }
    outer:
        while (true) {
            while (aStartNode.key === bStartNode.key) {
                patch(aStartNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
                aStart++;
                bStart++;
                if (aStart > aEnd || bStart > bEnd) {
                    break outer;
                }
                aStartNode = a[aStart];
                bStartNode = b[bStart];
                if (bStartNode.dom) {
                    b[bStart] = bStartNode = cloneVNode(bStartNode);
                }
            }
            while (aEndNode.key === bEndNode.key) {
                patch(aEndNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
                aEnd--;
                bEnd--;
                if (aStart > aEnd || bStart > bEnd) {
                    break outer;
                }
                aEndNode = a[aEnd];
                bEndNode = b[bEnd];
                if (bEndNode.dom) {
                    b[bEnd] = bEndNode = cloneVNode(bEndNode);
                }
            }
            if (aEndNode.key === bStartNode.key) {
                patch(aEndNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
                insertOrAppend(dom, bStartNode.dom, aStartNode.dom);
                aEnd--;
                bStart++;
                aEndNode = a[aEnd];
                bStartNode = b[bStart];
                if (bStartNode.dom) {
                    b[bStart] = bStartNode = cloneVNode(bStartNode);
                }
                continue;
            }
            if (aStartNode.key === bEndNode.key) {
                patch(aStartNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
                nextPos = bEnd + 1;
                nextNode = nextPos < b.length ? b[nextPos].dom : null;
                insertOrAppend(dom, bEndNode.dom, nextNode);
                aStart++;
                bEnd--;
                aStartNode = a[aStart];
                bEndNode = b[bEnd];
                if (bEndNode.dom) {
                    b[bEnd] = bEndNode = cloneVNode(bEndNode);
                }
                continue;
            }
            break;
        }
    if (aStart > aEnd) {
        if (bStart <= bEnd) {
            nextPos = bEnd + 1;
            nextNode = nextPos < b.length ? b[nextPos].dom : null;
            while (bStart <= bEnd) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = cloneVNode(node);
                }
                bStart++;
                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
            }
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            unmount(a[aStart++], dom, lifecycle, false, isRecycling);
        }
    } else {
        aLength = aEnd - aStart + 1;
        bLength = bEnd - bStart + 1;
        const sources = new Array(bLength);
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        let moved = false;
        let pos = 0;
        let patched = 0;
        if (bLength <= 4 || aLength * bLength <= 16) {
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    for (j = bStart; j <= bEnd; j++) {
                        bNode = b[j];
                        if (aNode.key === bNode.key) {
                            sources[j - bStart] = i;
                            if (pos > j) {
                                moved = true;
                            } else {
                                pos = j;
                            }
                            if (bNode.dom) {
                                b[j] = bNode = cloneVNode(bNode);
                            }
                            patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                            patched++;
                            a[i] = null;
                            break;
                        }
                    }
                }
            }
        } else {
            const keyIndex = new Map();
            for (i = bStart; i <= bEnd; i++) {
                keyIndex.set(b[i].key, i);
            }
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    j = keyIndex.get(aNode.key);
                    if (!isUndefined(j)) {
                        bNode = b[j];
                        sources[j - bStart] = i;
                        if (pos > j) {
                            moved = true;
                        } else {
                            pos = j;
                        }
                        if (bNode.dom) {
                            b[j] = bNode = cloneVNode(bNode);
                        }
                        patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                        patched++;
                        a[i] = null;
                    }
                }
            }
        }
        if (aLength === a.length && patched === 0) {
            removeAllChildren(dom, a, lifecycle, isRecycling);
            while (bStart < bLength) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = cloneVNode(node);
                }
                bStart++;
                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), null);
            }
        } else {
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (!isNull(aNode)) {
                    unmount(aNode, dom, lifecycle, true, isRecycling);
                    i--;
                }
            }
            if (moved) {
                const seq = lis_algorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = cloneVNode(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        insertOrAppend(dom, mount(node, dom, lifecycle, context, isSVG), nextNode);
                    } else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            node = b[pos];
                            nextPos = pos + 1;
                            nextNode = nextPos < b.length ? b[nextPos].dom : null;
                            insertOrAppend(dom, node.dom, nextNode);
                        } else {
                            j--;
                        }
                    }
                }
            } else if (patched !== bLength) {
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = cloneVNode(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);
                    }
                }
            }
        }
    }
}
function lis_algorithm(arr) {
    const p = arr.slice(0);
    const result = [0];
    let i;
    let j;
    let u;
    let v;
    let c;
    const len = arr.length;
    for (i = 0; i < len; i++) {
        let arrI = arr[i];
        if (arrI === -1) {
            continue;
        }
        j = result[result.length - 1];
        if (arr[j] < arrI) {
            p[i] = j;
            result.push(i);
            continue;
        }
        u = 0;
        v = result.length - 1;
        while (u < v) {
            c = (u + v) / 2 | 0;
            if (arr[result[c]] < arrI) {
                u = c + 1;
            } else {
                v = c;
            }
        }
        if (arrI < arr[result[u]]) {
            if (u > 0) {
                p[i] = result[u - 1];
            }
            result[u] = i;
        }
    }
    u = result.length;
    v = result[u - 1];
    while (u-- > 0) {
        result[u] = v;
        v = p[v];
    }
    return result;
}
export function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {
    if (prop in skipProps || hasControlledValue && prop === 'value') {
        return;
    } else if (prop in booleanProps) {
        dom[prop] = !!nextValue;
    } else if (prop in strictProps) {
        const value = isNullOrUndef(nextValue) ? '' : nextValue;
        if (dom[prop] !== value) {
            dom[prop] = value;
        }
    } else if (lastValue !== nextValue) {
        if (isAttrAnEvent(prop)) {
            patchEvent(prop, lastValue, nextValue, dom);
        } else if (isNullOrUndef(nextValue)) {
            dom.removeAttribute(prop);
        } else if (prop === 'className') {
            if (isSVG) {
                dom.setAttribute('class', nextValue);
            } else {
                dom.className = nextValue;
            }
        } else if (prop === 'style') {
            patchStyle(lastValue, nextValue, dom);
        } else if (prop === 'dangerouslySetInnerHTML') {
            const lastHtml = lastValue && lastValue.__html;
            const nextHtml = nextValue && nextValue.__html;
            if (lastHtml !== nextHtml) {
                if (!isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            const ns = isSVG ? namespaces[prop] : false;
            if (ns) {
                dom.setAttributeNS(ns, prop, nextValue);
            } else {
                dom.setAttribute(prop, nextValue);
            }
        }
    }
}
export function patchEvents(lastEvents, nextEvents, dom) {
    lastEvents = lastEvents || EMPTY_OBJ;
    nextEvents = nextEvents || EMPTY_OBJ;
    if (nextEvents !== EMPTY_OBJ) {
        for (let name in nextEvents) {
            patchEvent(name, lastEvents[name], nextEvents[name], dom);
        }
    }
    if (lastEvents !== EMPTY_OBJ) {
        for (let name in lastEvents) {
            if (isNullOrUndef(nextEvents[name])) {
                patchEvent(name, lastEvents[name], null, dom);
            }
        }
    }
}
export function patchEvent(name, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        const nameLowerCase = name.toLowerCase();
        const domEvent = dom[nameLowerCase];
        if (domEvent && domEvent.wrapped) {
            return;
        }
        if (delegatedProps[name]) {
            handleEvent(name, lastValue, nextValue, dom);
        } else {
            if (lastValue !== nextValue) {
                if (!isFunction(nextValue) && !isNullOrUndef(nextValue)) {
                    const linkEvent = nextValue.event;
                    if (linkEvent && isFunction(linkEvent)) {
                        if (!dom._data) {
                            dom[nameLowerCase] = function (e) {
                                linkEvent(e.currentTarget._data, e);
                            };
                        }
                        dom._data = nextValue.data;
                    } else {
                        if (process.env.NODE_ENV !== 'production') {
                            throwError(`an event on a VNode "${ name }". was not a function or a valid linkEvent.`);
                        }
                        throwError();
                    }
                } else {
                    dom[nameLowerCase] = nextValue;
                }
            }
        }
    }
}
export function patchStyle(lastAttrValue, nextAttrValue, dom) {
    const domStyle = dom.style;
    if (isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    for (let style in nextAttrValue) {
        const value = nextAttrValue[style];
        if (isNumber(value) && !(style in isUnitlessNumber)) {
            domStyle[style] = value + 'px';
        } else {
            domStyle[style] = value;
        }
    }
    if (!isNullOrUndef(lastAttrValue)) {
        for (let style in lastAttrValue) {
            if (isNullOrUndef(nextAttrValue[style])) {
                domStyle[style] = '';
            }
        }
    }
}
function removeProp(prop, lastValue, dom) {
    if (prop === 'className') {
        dom.removeAttribute('class');
    } else if (prop === 'value') {
        dom.value = '';
    } else if (prop === 'style') {
        dom.removeAttribute('style');
    } else if (isAttrAnEvent(prop)) {
        handleEvent(name, lastValue, null, dom);
    } else {
        dom.removeAttribute(prop);
    }
}
/* fuse:end-file "packages/inferno/src/DOM/patching.js"*/
});
___scope___.file("packages/inferno/src/DOM/events/delegation.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/events/delegation.js"*/
import { isBrowser } from '~/packages/inferno-shared/dist-es';
const isiOS = isBrowser && !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
const delegatedEvents = new Map();
export function handleEvent(name, lastEvent, nextEvent, dom) {
    let delegatedRoots = delegatedEvents.get(name);
    if (nextEvent) {
        if (!delegatedRoots) {
            delegatedRoots = {
                items: new Map(),
                count: 0,
                docEvent: null
            };
            delegatedRoots.docEvent = attachEventToDocument(name, delegatedRoots);
            delegatedEvents.set(name, delegatedRoots);
        }
        if (!lastEvent) {
            delegatedRoots.count++;
            if (isiOS && name === 'onClick') {
                trapClickOnNonInteractiveElement(dom);
            }
        }
        delegatedRoots.items.set(dom, nextEvent);
    } else if (delegatedRoots) {
        if (delegatedRoots.items.has(dom)) {
            delegatedRoots.count--;
            delegatedRoots.items.delete(dom);
            if (delegatedRoots.count === 0) {
                document.removeEventListener(normalizeEventName(name), delegatedRoots.docEvent);
                delegatedEvents.delete(name);
            }
        }
    }
}
function dispatchEvent(event, dom, items, count, eventData) {
    const eventsToTrigger = items.get(dom);
    if (eventsToTrigger) {
        count--;
        eventData.dom = dom;
        if (eventsToTrigger.event) {
            eventsToTrigger.event(eventsToTrigger.data, event);
        } else {
            eventsToTrigger(event);
        }
        if (eventData.stopPropagation) {
            return;
        }
    }
    if (count > 0) {
        const parentDom = dom.parentNode;
        if (parentDom && parentDom.disabled !== true || parentDom === document.body) {
            dispatchEvent(event, parentDom, items, count, eventData);
        }
    }
}
function normalizeEventName(name) {
    return name.substr(2).toLowerCase();
}
function attachEventToDocument(name, delegatedRoots) {
    const docEvent = event => {
        const eventData = {
            stopPropagation: false,
            dom: document
        };
        Object.defineProperty(event, 'currentTarget', {
            configurable: true,
            get() {
                return eventData.dom;
            }
        });
        event.stopPropagation = () => {
            eventData.stopPropagation = true;
        };
        const count = delegatedRoots.count;
        if (count > 0) {
            dispatchEvent(event, event.target, delegatedRoots.items, count, eventData);
        }
    };
    document.addEventListener(normalizeEventName(name), docEvent);
    return docEvent;
}
function emptyFn() {
}
function trapClickOnNonInteractiveElement(dom) {
    dom.onclick = emptyFn;
}
/* fuse:end-file "packages/inferno/src/DOM/events/delegation.js"*/
});
___scope___.file("packages/inferno/src/DOM/rendering.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/DOM/rendering.js"*/
import {
    isBrowser,
    isInvalid,
    isNull,
    isNullOrUndef,
    Lifecycle,
    NO_OP,
    throwError,
    warning
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import options from '../core/options';
import { cloneVNode } from '../core/VNodes';
import hydrateRoot from './hydration';
import { mount } from './mounting';
import { patch } from './patching';
import { unmount } from './unmounting';
import { EMPTY_OBJ } from './utils';
export const roots = [];
export const componentToDOMNodeMap = new Map();
options.roots = roots;
export function findDOMNode(ref) {
    if (!options.findDOMNodeEnabled) {
        if ("production" !== 'production') {
            throwError('findDOMNode() has been disabled, use Inferno.options.findDOMNodeEnabled = true; enabled findDOMNode(). Warning this can significantly impact performance!');
        }
        throwError();
    }
    const dom = ref && ref.nodeType ? ref : null;
    return componentToDOMNodeMap.get(ref) || dom;
}
function getRoot(dom) {
    for (let i = 0, len = roots.length; i < len; i++) {
        const root = roots[i];
        if (root.dom === dom) {
            return root;
        }
    }
    return null;
}
function setRoot(dom, input, lifecycle) {
    const root = {
        dom,
        input,
        lifecycle
    };
    roots.push(root);
    return root;
}
function removeRoot(root) {
    for (let i = 0, len = roots.length; i < len; i++) {
        if (roots[i] === root) {
            roots.splice(i, 1);
            return;
        }
    }
}
if ("production" !== 'production') {
    if (isBrowser && document.body === null) {
        warning('Inferno warning: you cannot initialize inferno without "document.body". Wait on "DOMContentLoaded" event, add script to bottom of body, or use async/defer attributes on script tag.');
    }
}
const documentBody = isBrowser ? document.body : null;
export function render(input, parentDom) {
    if (documentBody === parentDom) {
        if (process.env.NODE_ENV !== 'production') {
            throwError('you cannot render() to the "document.body". Use an empty element as a container instead.');
        }
        throwError();
    }
    if (input === NO_OP) {
        return;
    }
    let root = getRoot(parentDom);
    if (isNull(root)) {
        const lifecycle = new Lifecycle();
        if (!isInvalid(input)) {
            if (input.dom) {
                input = cloneVNode(input);
            }
            if (!hydrateRoot(input, parentDom, lifecycle)) {
                mount(input, parentDom, lifecycle, EMPTY_OBJ, false);
            }
            root = setRoot(parentDom, input, lifecycle);
            lifecycle.trigger();
        }
    } else {
        const lifecycle = root.lifecycle;
        lifecycle.listeners = [];
        if (isNullOrUndef(input)) {
            unmount(root.input, parentDom, lifecycle, false, false);
            removeRoot(root);
        } else {
            if (input.dom) {
                input = cloneVNode(input);
            }
            patch(root.input, input, parentDom, lifecycle, EMPTY_OBJ, false, false);
        }
        lifecycle.trigger();
        root.input = input;
    }
    if (root) {
        const rootInput = root.input;
        if (rootInput && rootInput.flags & VNodeFlags.Component) {
            return rootInput.children;
        }
    }
}
export function createRenderer(parentDom) {
    return function renderer(lastInput, nextInput) {
        if (!parentDom) {
            parentDom = lastInput;
        }
        render(nextInput, parentDom);
    };
}
/* fuse:end-file "packages/inferno/src/DOM/rendering.js"*/
});
___scope___.file("packages/inferno/src/DOM/hydration.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/DOM/hydration.js"*/
import {
    isArray,
    isNull,
    isObject,
    isStringOrNumber,
    throwError,
    warning
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import options from '../core/options';
import { svgNS } from './constants';
import {
    mount,
    mountClassComponentCallbacks,
    mountElement,
    mountFunctionalComponentCallbacks,
    mountRef,
    mountText
} from './mounting';
import {
    patchEvent,
    patchProp
} from './patching';
import { componentToDOMNodeMap } from './rendering';
import {
    createClassComponentInstance,
    createFunctionalComponentInput,
    replaceChild,
    EMPTY_OBJ
} from './utils';
import processElement from './wrappers/processElement';
export function normalizeChildNodes(parentDom) {
    let dom = parentDom.firstChild;
    while (dom) {
        if (dom.nodeType === 8) {
            if (dom.data === '!') {
                const placeholder = document.createTextNode('');
                parentDom.replaceChild(placeholder, dom);
                dom = dom.nextSibling;
            } else {
                const lastDom = dom.previousSibling;
                parentDom.removeChild(dom);
                dom = lastDom || parentDom.firstChild;
            }
        } else {
            dom = dom.nextSibling;
        }
    }
}
function hydrateComponent(vNode, dom, lifecycle, context, isSVG, isClass) {
    const type = vNode.type;
    const ref = vNode.ref;
    vNode.dom = dom;
    const props = vNode.props || EMPTY_OBJ;
    if (isClass) {
        const _isSVG = dom.namespaceURI === svgNS;
        const instance = createClassComponentInstance(vNode, type, props, context, _isSVG);
        const input = instance._lastInput;
        instance._vComponent = vNode;
        instance._vNode = vNode;
        hydrate(input, dom, lifecycle, instance._childContext, _isSVG);
        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, dom);
        vNode.children = instance;
    } else {
        const input = createFunctionalComponentInput(vNode, type, props, context);
        hydrate(input, dom, lifecycle, context, isSVG);
        vNode.children = input;
        vNode.dom = input.dom;
        mountFunctionalComponentCallbacks(ref, dom, lifecycle);
    }
    return dom;
}
function hydrateElement(vNode, dom, lifecycle, context, isSVG) {
    const children = vNode.children;
    const props = vNode.props;
    const events = vNode.events;
    const flags = vNode.flags;
    const ref = vNode.ref;
    if (isSVG || flags & VNodeFlags.SvgElement) {
        isSVG = true;
    }
    if (dom.nodeType !== 1 || dom.tagName.toLowerCase() !== vNode.type) {
        if ("production" !== 'production') {
            warning('Inferno hydration: Server-side markup doesn\'t match client-side markup or Initial render target is not empty');
        }
        const newDom = mountElement(vNode, null, lifecycle, context, isSVG);
        vNode.dom = newDom;
        replaceChild(dom.parentNode, newDom, dom);
        return newDom;
    }
    vNode.dom = dom;
    if (children) {
        hydrateChildren(children, dom, lifecycle, context, isSVG);
    }
    let hasControlledValue = false;
    if (!(flags & VNodeFlags.HtmlElement)) {
        hasControlledValue = processElement(flags, vNode, dom, false);
    }
    if (props) {
        for (let prop in props) {
            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
    }
    if (events) {
        for (let name in events) {
            patchEvent(name, null, events[name], dom);
        }
    }
    if (ref) {
        mountRef(dom, ref, lifecycle);
    }
    return dom;
}
function hydrateChildren(children, parentDom, lifecycle, context, isSVG) {
    normalizeChildNodes(parentDom);
    let dom = parentDom.firstChild;
    if (isArray(children)) {
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (!isNull(child) && isObject(child)) {
                if (dom) {
                    dom = hydrate(child, dom, lifecycle, context, isSVG);
                    dom = dom.nextSibling;
                } else {
                    mount(child, parentDom, lifecycle, context, isSVG);
                }
            }
        }
    } else if (isStringOrNumber(children)) {
        if (dom && dom.nodeType === 3) {
            if (dom.nodeValue !== children) {
                dom.nodeValue = children;
            }
        } else if (children) {
            parentDom.textContent = children;
        }
        dom = dom.nextSibling;
    } else if (isObject(children)) {
        hydrate(children, dom, lifecycle, context, isSVG);
        dom = dom.nextSibling;
    }
    while (dom) {
        const nextSibling = dom.nextSibling;
        parentDom.removeChild(dom);
        dom = nextSibling;
    }
}
function hydrateText(vNode, dom) {
    if (dom.nodeType !== 3) {
        const newDom = mountText(vNode, null);
        vNode.dom = newDom;
        replaceChild(dom.parentNode, newDom, dom);
        return newDom;
    }
    const text = vNode.children;
    if (dom.nodeValue !== text) {
        dom.nodeValue = text;
    }
    vNode.dom = dom;
    return dom;
}
function hydrateVoid(vNode, dom) {
    vNode.dom = dom;
    return dom;
}
function hydrate(vNode, dom, lifecycle, context, isSVG) {
    const flags = vNode.flags;
    if (flags & VNodeFlags.Component) {
        return hydrateComponent(vNode, dom, lifecycle, context, isSVG, flags & VNodeFlags.ComponentClass);
    } else if (flags & VNodeFlags.Element) {
        return hydrateElement(vNode, dom, lifecycle, context, isSVG);
    } else if (flags & VNodeFlags.Text) {
        return hydrateText(vNode, dom);
    } else if (flags & VNodeFlags.Void) {
        return hydrateVoid(vNode, dom);
    } else {
        if ("production" !== 'production') {
            throwError(`hydrate() expects a valid VNode, instead it received an object with the type "${ typeof vNode }".`);
        }
        throwError();
    }
}
export default function hydrateRoot(input, parentDom, lifecycle) {
    let dom = parentDom && parentDom.firstChild;
    if (dom) {
        hydrate(input, dom, lifecycle, EMPTY_OBJ, false);
        dom = parentDom.firstChild;
        while (dom = dom.nextSibling) {
            parentDom.removeChild(dom);
        }
        return true;
    }
    return false;
}
/* fuse:end-file "packages/inferno/src/DOM/hydration.js"*/
});
___scope___.file("packages/inferno/src/DOM/wrappers/processElement.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/wrappers/processElement.js"*/
import { processInput } from './InputWrapper';
import { processSelect } from './SelectWrapper';
import { processTextarea } from './TextareaWrapper';
import VNodeFlags from 'inferno-vnode-flags';
export const wrappers = new Map();
export default function processElement(flags, vNode, dom, mounting) {
    if (flags & VNodeFlags.InputElement) {
        return processInput(vNode, dom);
    }
    if (flags & VNodeFlags.SelectElement) {
        return processSelect(vNode, dom, mounting);
    }
    if (flags & VNodeFlags.TextareaElement) {
        return processTextarea(vNode, dom, mounting);
    }
    return false;
}

/* fuse:end-file "packages/inferno/src/DOM/wrappers/processElement.js"*/
});
___scope___.file("packages/inferno/src/DOM/wrappers/InputWrapper.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/wrappers/InputWrapper.js"*/
import { isNullOrUndef } from '~/packages/inferno-shared/dist-es';
import { wrappers } from './processElement';
import { EMPTY_OBJ } from '../utils';
function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
function isControlled(props) {
    const usesChecked = isCheckedType(props.type);
    return usesChecked ? !isNullOrUndef(props.checked) : !isNullOrUndef(props.value);
}
function onTextInputChange(e) {
    let vNode = this.vNode;
    const events = vNode.events || EMPTY_OBJ;
    const dom = vNode.dom;
    if (events.onInput) {
        const event = events.onInput;
        if (event.event) {
            event.event(event.data, e);
        } else {
            event(e);
        }
    } else if (events.oninput) {
        events.oninput(e);
    }
    applyValue(this.vNode, dom);
}
function wrappedOnChange(e) {
    let vNode = this.vNode;
    const events = vNode.events || EMPTY_OBJ;
    const event = events.onChange;
    if (event.event) {
        event.event(event.data, e);
    } else {
        event(e);
    }
}
function onCheckboxChange(e) {
    const vNode = this.vNode;
    const events = vNode.events || EMPTY_OBJ;
    const dom = vNode.dom;
    if (events.onClick) {
        const event = events.onClick;
        if (event.event) {
            event.event(event.data, e);
        } else {
            event(e);
        }
    } else if (events.onclick) {
        events.onclick(e);
    }
    applyValue(this.vNode, dom);
}
function handleAssociatedRadioInputs(name) {
    const inputs = document.querySelectorAll(`input[type="radio"][name="${ name }"]`);
    [].forEach.call(inputs, dom => {
        const inputWrapper = wrappers.get(dom);
        if (inputWrapper) {
            const props = inputWrapper.vNode.props;
            if (props) {
                dom.checked = inputWrapper.vNode.props.checked;
            }
        }
    });
}
export function processInput(vNode, dom) {
    const props = vNode.props || EMPTY_OBJ;
    applyValue(vNode, dom);
    if (isControlled(props)) {
        let inputWrapper = wrappers.get(dom);
        if (!inputWrapper) {
            inputWrapper = { vNode };
            if (isCheckedType(props.type)) {
                dom.onclick = onCheckboxChange.bind(inputWrapper);
                dom.onclick.wrapped = true;
            } else {
                dom.oninput = onTextInputChange.bind(inputWrapper);
                dom.oninput.wrapped = true;
            }
            if (props.onChange) {
                dom.onchange = wrappedOnChange.bind(inputWrapper);
                dom.onchange.wrapped = true;
            }
            wrappers.set(dom, inputWrapper);
        }
        inputWrapper.vNode = vNode;
        return true;
    }
    return false;
}
export function applyValue(vNode, dom) {
    const props = vNode.props || EMPTY_OBJ;
    const type = props.type;
    const value = props.value;
    const checked = props.checked;
    const multiple = props.multiple;
    const defaultValue = props.defaultValue;
    const hasValue = !isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.type = type;
    }
    if (multiple && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
        if (type === 'radio' && props.name) {
            handleAssociatedRadioInputs(props.name);
        }
    } else {
        if (hasValue && dom.value !== value) {
            dom.value = value;
        } else if (!isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}
/* fuse:end-file "packages/inferno/src/DOM/wrappers/InputWrapper.js"*/
});
___scope___.file("packages/inferno/src/DOM/wrappers/SelectWrapper.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/wrappers/SelectWrapper.js"*/
import {
    isArray,
    isInvalid,
    isNullOrUndef
} from '~/packages/inferno-shared/dist-es';
import { isVNode } from '../../core/VNodes';
import { wrappers } from './processElement';
import { EMPTY_OBJ } from '../utils';
function isControlled(props) {
    return !isNullOrUndef(props.value);
}
function updateChildOptionGroup(vNode, value) {
    const type = vNode.type;
    if (type === 'optgroup') {
        const children = vNode.children;
        if (isArray(children)) {
            for (let i = 0, len = children.length; i < len; i++) {
                updateChildOption(children[i], value);
            }
        } else if (isVNode(children)) {
            updateChildOption(children, value);
        }
    } else {
        updateChildOption(vNode, value);
    }
}
function updateChildOption(vNode, value) {
    const props = vNode.props || EMPTY_OBJ;
    const dom = vNode.dom;
    dom.value = props.value;
    if (isArray(value) && value.indexOf(props.value) !== -1 || props.value === value) {
        dom.selected = true;
    } else if (!isNullOrUndef(value) || !isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
function onSelectChange(e) {
    const vNode = this.vNode;
    const events = vNode.events || EMPTY_OBJ;
    const dom = vNode.dom;
    if (events.onChange) {
        const event = events.onChange;
        if (event.event) {
            event.event(event.data, e);
        } else {
            event(e);
        }
    } else if (events.onchange) {
        events.onchange(e);
    }
    applyValue(this.vNode, dom, false);
}
export function processSelect(vNode, dom, mounting) {
    const props = vNode.props || EMPTY_OBJ;
    applyValue(vNode, dom, mounting);
    if (isControlled(props)) {
        let selectWrapper = wrappers.get(dom);
        if (!selectWrapper) {
            selectWrapper = { vNode };
            dom.onchange = onSelectChange.bind(selectWrapper);
            dom.onchange.wrapped = true;
            wrappers.set(dom, selectWrapper);
        }
        selectWrapper.vNode = vNode;
        return true;
    }
    return false;
}
export function applyValue(vNode, dom, mounting) {
    const props = vNode.props || EMPTY_OBJ;
    if (props.multiple !== dom.multiple) {
        dom.multiple = props.multiple;
    }
    const children = vNode.children;
    if (!isInvalid(children)) {
        let value = props.value;
        if (mounting && isNullOrUndef(value)) {
            value = props.defaultValue;
        }
        if (isArray(children)) {
            for (let i = 0, len = children.length; i < len; i++) {
                updateChildOptionGroup(children[i], value);
            }
        } else if (isVNode(children)) {
            updateChildOptionGroup(children, value);
        }
    }
}
/* fuse:end-file "packages/inferno/src/DOM/wrappers/SelectWrapper.js"*/
});
___scope___.file("packages/inferno/src/DOM/wrappers/TextareaWrapper.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/wrappers/TextareaWrapper.js"*/
import { isNullOrUndef } from '~/packages/inferno-shared/dist-es';
import { wrappers } from './processElement';
import { EMPTY_OBJ } from '../utils';
function isControlled(props) {
    return !isNullOrUndef(props.value);
}
function wrappedOnChange(e) {
    let vNode = this.vNode;
    const events = vNode.events || EMPTY_OBJ;
    const event = events.onChange;
    if (event.event) {
        event.event(event.data, e);
    } else {
        event(e);
    }
}
function onTextareaInputChange(e) {
    let vNode = this.vNode;
    const events = vNode.events || EMPTY_OBJ;
    const dom = vNode.dom;
    if (events.onInput) {
        const event = events.onInput;
        if (event.event) {
            event.event(event.data, e);
        } else {
            event(e);
        }
    } else if (events.oninput) {
        events.oninput(e);
    }
    applyValue(this.vNode, dom, false);
}
export function processTextarea(vNode, dom, mounting) {
    const props = vNode.props || EMPTY_OBJ;
    applyValue(vNode, dom, mounting);
    let textareaWrapper = wrappers.get(dom);
    if (isControlled(props)) {
        if (!textareaWrapper) {
            textareaWrapper = { vNode };
            dom.oninput = onTextareaInputChange.bind(textareaWrapper);
            dom.oninput.wrapped = true;
            if (props.onChange) {
                dom.onchange = wrappedOnChange.bind(textareaWrapper);
                dom.onchange.wrapped = true;
            }
            wrappers.set(dom, textareaWrapper);
        }
        textareaWrapper.vNode = vNode;
        return true;
    }
    return false;
}
export function applyValue(vNode, dom, mounting) {
    const props = vNode.props || EMPTY_OBJ;
    const value = props.value;
    const domValue = dom.value;
    if (isNullOrUndef(value)) {
        if (mounting) {
            const defaultValue = props.defaultValue;
            if (!isNullOrUndef(defaultValue)) {
                if (defaultValue !== domValue) {
                    dom.value = defaultValue;
                }
            } else if (domValue !== '') {
                dom.value = '';
            }
        }
    } else {
        if (domValue !== value) {
            dom.value = value;
        }
    }
}
/* fuse:end-file "packages/inferno/src/DOM/wrappers/TextareaWrapper.js"*/
});
___scope___.file("packages/inferno/src/DOM/unmounting.js", function(exports, require, module, __filename, __dirname){
/* fuse:injection: */ var process = require("process");
/* fuse:start-file "packages/inferno/src/DOM/unmounting.js"*/
import {
    isArray,
    isFunction,
    isInvalid,
    isNull,
    isNullOrUndef,
    isObject,
    throwError
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import options from '../core/options';
import { patchEvent } from './patching';
import {
    poolComponent,
    poolElement
} from './recycling';
import { componentToDOMNodeMap } from './rendering';
import { removeChild } from './utils';
export function unmount(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    const flags = vNode.flags;
    if (flags & VNodeFlags.Component) {
        unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling);
    } else if (flags & VNodeFlags.Element) {
        unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling);
    } else if (flags & (VNodeFlags.Text | VNodeFlags.Void)) {
        unmountVoidOrText(vNode, parentDom);
    }
}
function unmountVoidOrText(vNode, parentDom) {
    if (parentDom) {
        removeChild(parentDom, vNode.dom);
    }
}
export function unmountComponent(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    const instance = vNode.children;
    const flags = vNode.flags;
    const isStatefulComponent = flags & VNodeFlags.ComponentClass;
    const ref = vNode.ref;
    const dom = vNode.dom;
    if (!isRecycling) {
        if (isStatefulComponent) {
            if (!instance._unmounted) {
                instance._ignoreSetState = true;
                options.beforeUnmount && options.beforeUnmount(vNode);
                instance.componentWillUnmount && instance.componentWillUnmount();
                if (ref && !isRecycling) {
                    ref(null);
                }
                instance._unmounted = true;
                options.findDOMNodeEnabled && componentToDOMNodeMap.delete(instance);
                unmount(instance._lastInput, null, instance._lifecycle, false, isRecycling);
            }
        } else {
            if (!isNullOrUndef(ref)) {
                if (!isNullOrUndef(ref.onComponentWillUnmount)) {
                    ref.onComponentWillUnmount(dom);
                }
            }
            unmount(instance, null, lifecycle, false, isRecycling);
        }
    }
    if (parentDom) {
        let lastInput = instance._lastInput;
        if (isNullOrUndef(lastInput)) {
            lastInput = instance;
        }
        removeChild(parentDom, dom);
    }
    if (options.recyclingEnabled && !isStatefulComponent && (parentDom || canRecycle)) {
        poolComponent(vNode);
    }
}
export function unmountElement(vNode, parentDom, lifecycle, canRecycle, isRecycling) {
    const dom = vNode.dom;
    const ref = vNode.ref;
    const events = vNode.events;
    if (ref && !isRecycling) {
        unmountRef(ref);
    }
    const children = vNode.children;
    if (!isNullOrUndef(children)) {
        unmountChildren(children, lifecycle, isRecycling);
    }
    if (!isNull(events)) {
        for (let name in events) {
            patchEvent(name, events[name], null, dom);
            events[name] = null;
        }
    }
    if (parentDom) {
        removeChild(parentDom, dom);
    }
    if (options.recyclingEnabled && (parentDom || canRecycle)) {
        poolElement(vNode);
    }
}
function unmountChildren(children, lifecycle, isRecycling) {
    if (isArray(children)) {
        for (let i = 0, len = children.length; i < len; i++) {
            const child = children[i];
            if (!isInvalid(child) && isObject(child)) {
                unmount(child, null, lifecycle, false, isRecycling);
            }
        }
    } else if (isObject(children)) {
        unmount(children, null, lifecycle, false, isRecycling);
    }
}
function unmountRef(ref) {
    if (isFunction(ref)) {
        ref(null);
    } else {
        if (isInvalid(ref)) {
            return;
        }
        if ("production" !== 'production') {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        throwError();
    }
}
/* fuse:end-file "packages/inferno/src/DOM/unmounting.js"*/
});
___scope___.file("packages/inferno/src/DOM/recycling.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/recycling.js"*/
import {
    isNull,
    isUndefined
} from '~/packages/inferno-shared/dist-es';
import VNodeFlags from 'inferno-vnode-flags';
import {
    patchComponent,
    patchElement
} from './patching';
const componentPools = new Map();
const elementPools = new Map();
export function recycleElement(vNode, lifecycle, context, isSVG) {
    const tag = vNode.type;
    const pools = elementPools.get(tag);
    if (!isUndefined(pools)) {
        const key = vNode.key;
        const pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!isUndefined(pool)) {
            const recycledVNode = pool.pop();
            if (!isUndefined(recycledVNode)) {
                patchElement(recycledVNode, vNode, null, lifecycle, context, isSVG, true);
                return vNode.dom;
            }
        }
    }
    return null;
}
export function poolElement(vNode) {
    const tag = vNode.type;
    const key = vNode.key;
    let pools = elementPools.get(tag);
    if (isUndefined(pools)) {
        pools = {
            nonKeyed: [],
            keyed: new Map()
        };
        elementPools.set(tag, pools);
    }
    if (isNull(key)) {
        pools.nonKeyed.push(vNode);
    } else {
        let pool = pools.keyed.get(key);
        if (isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
export function recycleComponent(vNode, lifecycle, context, isSVG) {
    const type = vNode.type;
    const pools = componentPools.get(type);
    if (!isUndefined(pools)) {
        const key = vNode.key;
        const pool = key === null ? pools.nonKeyed : pools.keyed.get(key);
        if (!isUndefined(pool)) {
            const recycledVNode = pool.pop();
            if (!isUndefined(recycledVNode)) {
                const flags = vNode.flags;
                const failed = patchComponent(recycledVNode, vNode, null, lifecycle, context, isSVG, flags & VNodeFlags.ComponentClass, true);
                if (!failed) {
                    return vNode.dom;
                }
            }
        }
    }
    return null;
}
export function poolComponent(vNode) {
    const hooks = vNode.ref;
    const nonRecycleHooks = hooks && (hooks.onComponentWillMount || hooks.onComponentWillUnmount || hooks.onComponentDidMount || hooks.onComponentWillUpdate || hooks.onComponentDidUpdate);
    if (nonRecycleHooks) {
        return;
    }
    const type = vNode.type;
    const key = vNode.key;
    let pools = componentPools.get(type);
    if (isUndefined(pools)) {
        pools = {
            nonKeyed: [],
            keyed: new Map()
        };
        componentPools.set(type, pools);
    }
    if (isNull(key)) {
        pools.nonKeyed.push(vNode);
    } else {
        let pool = pools.keyed.get(key);
        if (isUndefined(pool)) {
            pool = [];
            pools.keyed.set(key, pool);
        }
        pool.push(vNode);
    }
}
/* fuse:end-file "packages/inferno/src/DOM/recycling.js"*/
});
___scope___.file("packages/inferno/src/DOM/events/linkEvent.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "packages/inferno/src/DOM/events/linkEvent.js"*/
export default function linkEvent(data, event) {
    return { data, event };
}

/* fuse:end-file "packages/inferno/src/DOM/events/linkEvent.js"*/
});
});
/* fuse:end-collection "default"*/
FuseBox.pkg("inferno-vnode-flags@1.3.0-rc.4", {}, function(___scope___){
/* fuse:start-collection "inferno-vnode-flags@1.3.0-rc.4"*/
___scope___.file("dist-es/index.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "dist-es/index.js"*/
var VNodeFlags;
(function (VNodeFlags) {
    VNodeFlags[VNodeFlags["Text"] = 1] = "Text";
    VNodeFlags[VNodeFlags["HtmlElement"] = 2] = "HtmlElement";
    VNodeFlags[VNodeFlags["ComponentClass"] = 4] = "ComponentClass";
    VNodeFlags[VNodeFlags["ComponentFunction"] = 8] = "ComponentFunction";
    VNodeFlags[VNodeFlags["ComponentUnknown"] = 16] = "ComponentUnknown";
    VNodeFlags[VNodeFlags["HasKeyedChildren"] = 32] = "HasKeyedChildren";
    VNodeFlags[VNodeFlags["HasNonKeyedChildren"] = 64] = "HasNonKeyedChildren";
    VNodeFlags[VNodeFlags["SvgElement"] = 128] = "SvgElement";
    VNodeFlags[VNodeFlags["MediaElement"] = 256] = "MediaElement";
    VNodeFlags[VNodeFlags["InputElement"] = 512] = "InputElement";
    VNodeFlags[VNodeFlags["TextareaElement"] = 1024] = "TextareaElement";
    VNodeFlags[VNodeFlags["SelectElement"] = 2048] = "SelectElement";
    VNodeFlags[VNodeFlags["Void"] = 4096] = "Void";
    VNodeFlags[VNodeFlags["Element"] = 3970] = "Element";
    VNodeFlags[VNodeFlags["Component"] = 28] = "Component";
})(VNodeFlags || (VNodeFlags = {}));
;
export default VNodeFlags;

/* fuse:end-file "dist-es/index.js"*/
});
return ___scope___.entry = "dist-es/index.js";
});
/* fuse:end-collection "inferno-vnode-flags@1.3.0-rc.4"*/
FuseBox.pkg("process", {}, function(___scope___){
/* fuse:start-collection "process"*/
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "index.js"*/
// From https://github.com/defunctzombie/node-process/blob/master/browser.js
// shim for using process in browser
if (FuseBox.isServer) {
    if (typeof __process_env__ !== "undefined") {
        Object.assign(global.process.env, __process_env__);
    }
    module.exports = global.process;
} else {
    require("object-assign-polyfill");
    var productionEnv = false; //require('@system-env').production;

    var process = module.exports = {};
    var queue = [];
    var draining = false;
    var currentQueue;
    var queueIndex = -1;

    function cleanUpNextTick() {
        draining = false;
        if (currentQueue.length) {
            queue = currentQueue.concat(queue);
        } else {
            queueIndex = -1;
        }
        if (queue.length) {
            drainQueue();
        }
    }

    function drainQueue() {
        if (draining) {
            return;
        }
        var timeout = setTimeout(cleanUpNextTick);
        draining = true;

        var len = queue.length;
        while (len) {
            currentQueue = queue;
            queue = [];
            while (++queueIndex < len) {
                if (currentQueue) {
                    currentQueue[queueIndex].run();
                }
            }
            queueIndex = -1;
            len = queue.length;
        }
        currentQueue = null;
        draining = false;
        clearTimeout(timeout);
    }

    process.nextTick = function(fun) {
        var args = new Array(arguments.length - 1);
        if (arguments.length > 1) {
            for (var i = 1; i < arguments.length; i++) {
                args[i - 1] = arguments[i];
            }
        }
        queue.push(new Item(fun, args));
        if (queue.length === 1 && !draining) {
            setTimeout(drainQueue, 0);
        }
    };

    // v8 likes predictible objects
    function Item(fun, array) {
        this.fun = fun;
        this.array = array;
    }
    Item.prototype.run = function() {
        this.fun.apply(null, this.array);
    };
    process.title = "browser";
    process.browser = true;
    process.env = {
        NODE_ENV: productionEnv ? "production" : "development",
    };
    if (typeof __process_env__ !== "undefined") {
        Object.assign(process.env, __process_env__);
    }
    process.argv = [];
    process.version = ""; // empty string to avoid regexp issues
    process.versions = {};

    function noop() {}

    process.on = noop;
    process.addListener = noop;
    process.once = noop;
    process.off = noop;
    process.removeListener = noop;
    process.removeAllListeners = noop;
    process.emit = noop;

    process.binding = function(name) {
        throw new Error("process.binding is not supported");
    };

    process.cwd = function() { return "/"; };
    process.chdir = function(dir) {
        throw new Error("process.chdir is not supported");
    };
    process.umask = function() { return 0; };

}

/* fuse:end-file "index.js"*/
});
return ___scope___.entry = "index.js";
});
/* fuse:end-collection "process"*/
FuseBox.pkg("object-assign-polyfill", {}, function(___scope___){
/* fuse:start-collection "object-assign-polyfill"*/
___scope___.file("index.js", function(exports, require, module, __filename, __dirname){

/* fuse:start-file "index.js"*/
if (typeof Object.assign != "function") {
    Object.assign = function(target, varArgs) { // .length of function is 2
        "use strict";
        if (target == null) { // TypeError if undefined or null
            throw new TypeError("Cannot convert undefined or null to object");
        }

        var to = Object(target);

        for (var index = 1; index < arguments.length; index++) {
            var nextSource = arguments[index];

            if (nextSource != null) { // Skip over if undefined or null
                for (var nextKey in nextSource) {
                    // Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                        to[nextKey] = nextSource[nextKey];
                    }
                }
            }
        }
        return to;
    };
}

/* fuse:end-file "index.js"*/
});
return ___scope___.entry = "index.js";
});
/* fuse:end-collection "object-assign-polyfill"*/
})
(function(e){if(e.FuseBox)return e.FuseBox;var r="undefined"!=typeof window&&window.navigator;r&&(window.global=window),e=r&&"undefined"==typeof __fbx__dnm__?e:module.exports;var n=r?window.__fsbx__=window.__fsbx__||{}:global.$fsbx=global.$fsbx||{};r||(global.require=require);var t=n.p=n.p||{},i=n.e=n.e||{},a=function(e){var n=e.charCodeAt(0),t=e.charCodeAt(1);if((r||58!==t)&&(n>=97&&n<=122||64===n)){if(64===n){var i=e.split("/"),a=i.splice(2,i.length).join("/");return[i[0]+"/"+i[1],a||void 0]}var o=e.indexOf("/");if(o===-1)return[e];var f=e.substring(0,o),u=e.substring(o+1);return[f,u]}},o=function(e){return e.substring(0,e.lastIndexOf("/"))||"./"},f=function(){for(var e=[],r=0;r<arguments.length;r++)e[r]=arguments[r];for(var n=[],t=0,i=arguments.length;t<i;t++)n=n.concat(arguments[t].split("/"));for(var a=[],t=0,i=n.length;t<i;t++){var o=n[t];o&&"."!==o&&(".."===o?a.pop():a.push(o))}return""===n[0]&&a.unshift(""),a.join("/")||(a.length?"/":".")},u=function(e){var r=e.match(/\.(\w{1,})$/);if(r){var n=r[1];return n?e:e+".js"}return e+".js"},s=function(e){if(r){var n,t=document,i=t.getElementsByTagName("head")[0];/\.css$/.test(e)?(n=t.createElement("link"),n.rel="stylesheet",n.type="text/css",n.href=e):(n=t.createElement("script"),n.type="text/javascript",n.src=e,n.async=!0),i.insertBefore(n,i.firstChild)}},l=function(e,r){for(var n in e)e.hasOwnProperty(n)&&r(n,e[n])},c=function(e){return{"server":require(e)}},v=function(e,n){var i=n.path||"./",o=n.pkg||"default",s=a(e);if(s&&(i="./",o=s[0],n.v&&n.v[o]&&(o=o+"@"+n.v[o]),e=s[1]),e)if(126===e.charCodeAt(0))e=e.slice(2,e.length),i="./";else if(!r&&(47===e.charCodeAt(0)||58===e.charCodeAt(1)))return c(e);var l=t[o];if(!l){if(r)throw'Package was not found "'+o+'"';return c(o+(e?"/"+e:""))}e||(e="./"+l.s.entry);var v,d=f(i,e),p=u(d),g=l.f[p];return!g&&p.indexOf("*")>-1&&(v=p),g||v||(p=f(d,"/","index.js"),g=l.f[p],g||(p=d+".js",g=l.f[p]),g||(g=l.f[d+".jsx"]),g||(p=d+"/index.jsx",g=l.f[p])),{"file":g,"wildcard":v,"pkgName":o,"versions":l.v,"filePath":d,"validPath":p}},d=function(e,n){if(!r)return n(/\.(js|json)$/.test(e)?global.require(e):"");var t;t=new XMLHttpRequest,t.onreadystatechange=function(){if(4==t.readyState)if(200==t.status){var r=t.getResponseHeader("Content-Type"),i=t.responseText;/json/.test(r)?i="module.exports = "+i:/javascript/.test(r)||(i="module.exports = "+JSON.stringify(i));var a=f("./",e);h.dynamic(a,i),n(h.import(e,{}))}else console.error(e+" was not found upon request"),n(void 0)},t.open("GET",e,!0),t.send()},p=function(e,r){var n=i[e];if(n)for(var t in n){var a=n[t].apply(null,r);if(a===!1)return!1}},g=function(e,n){if(void 0===n&&(n={}),58===e.charCodeAt(4)||58===e.charCodeAt(5))return s(e);var i=v(e,n);if(i.server)return i.server;var a=i.file;if(i.wildcard){var f=new RegExp(i.wildcard.replace(/\*/g,"@").replace(/[.?*+^$[\]\\(){}|-]/g,"\\$&").replace(/@/g,"[a-z0-9$_-]+"),"i"),u=t[i.pkgName];if(u){var l={};for(var c in u.f)f.test(c)&&(l[c]=g(i.pkgName+"/"+c));return l}}if(!a){var h="function"==typeof n,m=p("async",[e,n]);if(m===!1)return;return d(e,function(e){if(h)return n(e)})}var x=i.validPath,_=i.pkgName;if(a.locals&&a.locals.module)return a.locals.module.exports;var w=a.locals={},y=o(x);w.exports={},w.module={"exports":w.exports},w.require=function(e,r){return g(e,{"pkg":_,"path":y,"v":i.versions})},w.require.main={"filename":r?"./":global.require.main.filename,"paths":r?[]:global.require.main.paths};var b=[w.module.exports,w.require,w.module,x,y,_];p("before-import",b);var j=a.fn;return j.apply(0,b),p("after-import",b),w.module.exports},h=function(){function n(){}return n.global=function(e,n){var t=r?window:global;return void 0===n?t[e]:void(t[e]=n)},n.import=function(e,r){return g(e,r)},n.on=function(e,r){i[e]=i[e]||[],i[e].push(r)},n.exists=function(e){try{var r=v(e,{});return void 0!==r.file}catch(e){return!1}},n.remove=function(e){var r=v(e,{}),n=t[r.pkgName];n&&n.f[r.validPath]&&delete n.f[r.validPath]},n.main=function(e){return this.mainFile=e,n.import(e,{})},n.expose=function(r){var n=function(n){var t=r[n],i=t.alias,a=g(t.pkg);"*"===i?l(a,function(r,n){return e[r]=n}):"object"==typeof i?l(i,function(r,n){return e[n]=a[r]}):e[i]=a};for(var t in r)n(t)},n.dynamic=function(r,n,t){var i=t&&t.pkg||"default";this.pkg(i,{},function(t){t.file(r,function(r,t,i,a,o){var f=new Function("__fbx__dnm__","exports","require","module","__filename","__dirname","__root__",n);f(!0,r,t,i,a,o,e)})})},n.flush=function(e){var r=t.default;for(var n in r.f){var i=!e||e(n);if(i){var a=r.f[n];delete a.locals}}},n.pkg=function(e,r,n){if(t[e])return n(t[e].s);var i=t[e]={},a=i.f={};i.v=r;var o=i.s={"file":function(e,r){a[e]={"fn":r}}};return n(o)},n.addPlugin=function(e){this.plugins.push(e)},n}();return h.packages=t,h.isBrowser=void 0!==r,h.isServer=!r,h.plugins=[],e.FuseBox=h}(this))