'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var inferno_vnode_flags_1 = require('inferno-vnode-flags');
var options_1 = require('../core/options');
var VNodes_1 = require('../core/VNodes');
var constants_1 = require('./constants');
var mounting_1 = require('./mounting');
var patching_1 = require('./patching');
var rendering_1 = require('./rendering');
var unmounting_1 = require('./unmounting');
exports.EMPTY_OBJ = {};
if (process.env.NODE_ENV !== 'production') {
    Object.freeze(exports.EMPTY_OBJ);
}
function createClassComponentInstance(vNode, Component, props, context, isSVG) {
    if (inferno_shared_1.isUndefined(context)) {
        context = exports.EMPTY_OBJ;
    }
    var instance = new Component(props, context);
    instance.context = context;
    if (instance.props === exports.EMPTY_OBJ) {
        instance.props = props;
    }
    instance._patch = patching_1.patch;
    if (options_1.default.findDOMNodeEnabled) {
        instance._componentToDOMNodeMap = rendering_1.componentToDOMNodeMap;
    }
    instance._unmounted = false;
    instance._pendingSetState = true;
    instance._isSVG = isSVG;
    if (inferno_shared_1.isFunction(instance.componentWillMount)) {
        instance.componentWillMount();
    }
    var childContext = instance.getChildContext();
    if (inferno_shared_1.isNullOrUndef(childContext)) {
        instance._childContext = context;
    } else {
        instance._childContext = inferno_shared_1.assign({}, context, childContext);
    }
    options_1.default.beforeRender && options_1.default.beforeRender(instance);
    var input = instance.render(props, instance.state, context);
    options_1.default.afterRender && options_1.default.afterRender(instance);
    if (inferno_shared_1.isArray(input)) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        inferno_shared_1.throwError();
    } else if (inferno_shared_1.isInvalid(input)) {
        input = VNodes_1.createVoidVNode();
    } else if (inferno_shared_1.isStringOrNumber(input)) {
        input = VNodes_1.createTextVNode(input, null);
    } else {
        if (input.dom) {
            input = VNodes_1.cloneVNode(input);
        }
        if (input.flags & inferno_vnode_flags_1.default.Component) {
            input.parentVNode = vNode;
        }
    }
    instance._pendingSetState = false;
    instance._lastInput = input;
    return instance;
}
exports.createClassComponentInstance = createClassComponentInstance;
function replaceLastChildAndUnmount(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling) {
    replaceVNode(parentDom, mounting_1.mount(nextInput, null, lifecycle, context, isSVG), lastInput, lifecycle, isRecycling);
}
exports.replaceLastChildAndUnmount = replaceLastChildAndUnmount;
function replaceVNode(parentDom, dom, vNode, lifecycle, isRecycling) {
    unmounting_1.unmount(vNode, null, lifecycle, false, isRecycling);
    if (vNode.flags & inferno_vnode_flags_1.default.Component) {
        vNode = vNode.children._lastInput || vNode.children;
    }
    replaceChild(parentDom, dom, vNode.dom);
}
exports.replaceVNode = replaceVNode;
function createFunctionalComponentInput(vNode, component, props, context) {
    var input = component(props, context);
    if (inferno_shared_1.isArray(input)) {
        if (process.env.NODE_ENV !== 'production') {
            inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
        }
        inferno_shared_1.throwError();
    } else if (inferno_shared_1.isInvalid(input)) {
        input = VNodes_1.createVoidVNode();
    } else if (inferno_shared_1.isStringOrNumber(input)) {
        input = VNodes_1.createTextVNode(input, null);
    } else {
        if (input.dom) {
            input = VNodes_1.cloneVNode(input);
        }
        if (input.flags & inferno_vnode_flags_1.default.Component) {
            input.parentVNode = vNode;
        }
    }
    return input;
}
exports.createFunctionalComponentInput = createFunctionalComponentInput;
function setTextContent(dom, text) {
    if (text !== '') {
        dom.textContent = text;
    } else {
        dom.appendChild(document.createTextNode(''));
    }
}
exports.setTextContent = setTextContent;
function updateTextContent(dom, text) {
    dom.firstChild.nodeValue = text;
}
exports.updateTextContent = updateTextContent;
function appendChild(parentDom, dom) {
    parentDom.appendChild(dom);
}
exports.appendChild = appendChild;
function insertOrAppend(parentDom, newNode, nextNode) {
    if (inferno_shared_1.isNullOrUndef(nextNode)) {
        appendChild(parentDom, newNode);
    } else {
        parentDom.insertBefore(newNode, nextNode);
    }
}
exports.insertOrAppend = insertOrAppend;
function documentCreateElement(tag, isSVG) {
    if (isSVG === true) {
        return document.createElementNS(constants_1.svgNS, tag);
    } else {
        return document.createElement(tag);
    }
}
exports.documentCreateElement = documentCreateElement;
function replaceWithNewNode(lastNode, nextNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    unmounting_1.unmount(lastNode, null, lifecycle, false, isRecycling);
    var dom = mounting_1.mount(nextNode, null, lifecycle, context, isSVG);
    nextNode.dom = dom;
    replaceChild(parentDom, dom, lastNode.dom);
}
exports.replaceWithNewNode = replaceWithNewNode;
function replaceChild(parentDom, nextDom, lastDom) {
    if (!parentDom) {
        parentDom = lastDom.parentNode;
    }
    parentDom.replaceChild(nextDom, lastDom);
}
exports.replaceChild = replaceChild;
function removeChild(parentDom, dom) {
    parentDom.removeChild(dom);
}
exports.removeChild = removeChild;
function removeAllChildren(dom, children, lifecycle, isRecycling) {
    dom.textContent = '';
    if (!options_1.default.recyclingEnabled || options_1.default.recyclingEnabled && !isRecycling) {
        removeChildren(null, children, lifecycle, isRecycling);
    }
}
exports.removeAllChildren = removeAllChildren;
function removeChildren(dom, children, lifecycle, isRecycling) {
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
        if (!inferno_shared_1.isInvalid(child)) {
            unmounting_1.unmount(child, dom, lifecycle, true, isRecycling);
        }
    }
}
exports.removeChildren = removeChildren;
function isKeyed(lastChildren, nextChildren) {
    return nextChildren.length && !inferno_shared_1.isNullOrUndef(nextChildren[0]) && !inferno_shared_1.isNullOrUndef(nextChildren[0].key) && lastChildren.length && !inferno_shared_1.isNullOrUndef(lastChildren[0]) && !inferno_shared_1.isNullOrUndef(lastChildren[0].key);
}
exports.isKeyed = isKeyed;
/* fuse:end-file "packages/inferno/src/DOM/utils.js"*/