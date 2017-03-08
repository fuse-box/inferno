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
export var EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(EMPTY_OBJ);
}
export function createClassComponentInstance(vNode, Component, props, context, isSVG) {
    if (isUndefined(context)) {
        context = EMPTY_OBJ;
    }
    var instance = new Component(props, context);
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
    var childContext = instance.getChildContext();
    if (isNullOrUndef(childContext)) {
        instance._childContext = context;
    } else {
        instance._childContext = assign({}, context, childContext);
    }
    options.beforeRender && options.beforeRender(instance);
    var input = instance.render(props, instance.state, context);
    options.afterRender && options.afterRender(instance);
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
    var input = component(props, context);
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
    var dom = mount(nextNode, null, lifecycle, context, isSVG);
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
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        if (!isInvalid(child)) {
            unmount(child, dom, lifecycle, true, isRecycling);
        }
    }
}
export function isKeyed(lastChildren, nextChildren) {
    return nextChildren.length && !isNullOrUndef(nextChildren[0]) && !isNullOrUndef(nextChildren[0].key) && lastChildren.length && !isNullOrUndef(lastChildren[0]) && !isNullOrUndef(lastChildren[0].key);
}
/* fuse:end-file "packages/inferno/src/DOM/utils.js"*/