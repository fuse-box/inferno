'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var inferno_vnode_flags_1 = require('inferno-vnode-flags');
var options_1 = require('../core/options');
var VNodes_1 = require('../core/VNodes');
var constants_1 = require('./constants');
var delegation_1 = require('./events/delegation');
var mounting_1 = require('./mounting');
var utils_1 = require('./utils');
var rendering_1 = require('./rendering');
var unmounting_1 = require('./unmounting');
var processElement_1 = require('./wrappers/processElement');
function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    if (lastVNode !== nextVNode) {
        var lastFlags = lastVNode.flags;
        var nextFlags = nextVNode.flags;
        if (nextFlags & inferno_vnode_flags_1.default.Component) {
            if (lastFlags & inferno_vnode_flags_1.default.Component) {
                patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, nextFlags & inferno_vnode_flags_1.default.ComponentClass, isRecycling);
            } else {
                utils_1.replaceVNode(parentDom, mounting_1.mountComponent(nextVNode, null, lifecycle, context, isSVG, nextFlags & inferno_vnode_flags_1.default.ComponentClass), lastVNode, lifecycle, isRecycling);
            }
        } else if (nextFlags & inferno_vnode_flags_1.default.Element) {
            if (lastFlags & inferno_vnode_flags_1.default.Element) {
                patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
            } else {
                utils_1.replaceVNode(parentDom, mounting_1.mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);
            }
        } else if (nextFlags & inferno_vnode_flags_1.default.Text) {
            if (lastFlags & inferno_vnode_flags_1.default.Text) {
                patchText(lastVNode, nextVNode);
            } else {
                utils_1.replaceVNode(parentDom, mounting_1.mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);
            }
        } else if (nextFlags & inferno_vnode_flags_1.default.Void) {
            if (lastFlags & inferno_vnode_flags_1.default.Void) {
                patchVoid(lastVNode, nextVNode);
            } else {
                utils_1.replaceVNode(parentDom, mounting_1.mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);
            }
        } else {
            utils_1.replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        }
    }
}
exports.patch = patch;
function unmountChildren(children, dom, lifecycle, isRecycling) {
    if (VNodes_1.isVNode(children)) {
        unmounting_1.unmount(children, dom, lifecycle, true, isRecycling);
    } else if (inferno_shared_1.isArray(children)) {
        utils_1.removeAllChildren(dom, children, lifecycle, isRecycling);
    } else {
        dom.textContent = '';
    }
}
function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {
    var nextTag = nextVNode.type;
    var lastTag = lastVNode.type;
    if (lastTag !== nextTag) {
        utils_1.replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
    } else {
        var dom = lastVNode.dom;
        var lastProps = lastVNode.props;
        var nextProps = nextVNode.props;
        var lastChildren = lastVNode.children;
        var nextChildren = nextVNode.children;
        var lastFlags = lastVNode.flags;
        var nextFlags = nextVNode.flags;
        var nextRef = nextVNode.ref;
        var lastEvents = lastVNode.events;
        var nextEvents = nextVNode.events;
        nextVNode.dom = dom;
        if (isSVG || nextFlags & inferno_vnode_flags_1.default.SvgElement) {
            isSVG = true;
        }
        if (lastChildren !== nextChildren) {
            patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        }
        var hasControlledValue = false;
        if (!(nextFlags & inferno_vnode_flags_1.default.HtmlElement)) {
            hasControlledValue = processElement_1.default(nextFlags, nextVNode, dom, false);
        }
        if (lastProps !== nextProps) {
            var lastPropsOrEmpty = lastProps || utils_1.EMPTY_OBJ;
            var nextPropsOrEmpty = nextProps || utils_1.EMPTY_OBJ;
            if (nextPropsOrEmpty !== utils_1.EMPTY_OBJ) {
                for (var prop in nextPropsOrEmpty) {
                    var nextValue = nextPropsOrEmpty[prop];
                    var lastValue = lastPropsOrEmpty[prop];
                    if (inferno_shared_1.isNullOrUndef(nextValue)) {
                        removeProp(prop, nextValue, dom);
                    } else {
                        patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);
                    }
                }
            }
            if (lastPropsOrEmpty !== utils_1.EMPTY_OBJ) {
                for (var prop in lastPropsOrEmpty) {
                    if (inferno_shared_1.isNullOrUndef(nextPropsOrEmpty[prop])) {
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
                mounting_1.mountRef(dom, nextRef, lifecycle);
            }
        }
    }
}
exports.patchElement = patchElement;
function patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var patchArray = false;
    var patchKeyed = false;
    if (nextFlags & inferno_vnode_flags_1.default.HasNonKeyedChildren) {
        patchArray = true;
    } else if (lastFlags & inferno_vnode_flags_1.default.HasKeyedChildren && nextFlags & inferno_vnode_flags_1.default.HasKeyedChildren) {
        patchKeyed = true;
        patchArray = true;
    } else if (inferno_shared_1.isInvalid(nextChildren)) {
        unmountChildren(lastChildren, dom, lifecycle, isRecycling);
    } else if (inferno_shared_1.isInvalid(lastChildren)) {
        if (inferno_shared_1.isStringOrNumber(nextChildren)) {
            utils_1.setTextContent(dom, nextChildren);
        } else {
            if (inferno_shared_1.isArray(nextChildren)) {
                mounting_1.mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
            } else {
                mounting_1.mount(nextChildren, dom, lifecycle, context, isSVG);
            }
        }
    } else if (inferno_shared_1.isStringOrNumber(nextChildren)) {
        if (inferno_shared_1.isStringOrNumber(lastChildren)) {
            utils_1.updateTextContent(dom, nextChildren);
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            utils_1.setTextContent(dom, nextChildren);
        }
    } else if (inferno_shared_1.isArray(nextChildren)) {
        if (inferno_shared_1.isArray(lastChildren)) {
            patchArray = true;
            if (utils_1.isKeyed(lastChildren, nextChildren)) {
                patchKeyed = true;
            }
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mounting_1.mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);
        }
    } else if (inferno_shared_1.isArray(lastChildren)) {
        utils_1.removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
        mounting_1.mount(nextChildren, dom, lifecycle, context, isSVG);
    } else if (VNodes_1.isVNode(nextChildren)) {
        if (VNodes_1.isVNode(lastChildren)) {
            patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);
        } else {
            unmountChildren(lastChildren, dom, lifecycle, isRecycling);
            mounting_1.mount(nextChildren, dom, lifecycle, context, isSVG);
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
function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {
    var lastType = lastVNode.type;
    var nextType = nextVNode.type;
    var lastKey = lastVNode.key;
    var nextKey = nextVNode.key;
    if (lastType !== nextType || lastKey !== nextKey) {
        utils_1.replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);
        return false;
    } else {
        var nextProps = nextVNode.props || utils_1.EMPTY_OBJ;
        if (isClass) {
            var instance = lastVNode.children;
            if (instance._unmounted) {
                if (inferno_shared_1.isNull(parentDom)) {
                    return true;
                }
                utils_1.replaceChild(parentDom, mounting_1.mountComponent(nextVNode, null, lifecycle, context, isSVG, nextVNode.flags & inferno_vnode_flags_1.default.ComponentClass), lastVNode.dom);
            } else {
                var lastState = instance.state;
                var nextState = instance.state;
                var lastProps = instance.props;
                var childContext = instance.getChildContext();
                nextVNode.children = instance;
                instance._isSVG = isSVG;
                instance._syncSetState = false;
                if (inferno_shared_1.isNullOrUndef(childContext)) {
                    childContext = context;
                } else {
                    childContext = inferno_shared_1.assign({}, context, childContext);
                }
                var lastInput = instance._lastInput;
                var nextInput = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false);
                var didUpdate = true;
                instance._childContext = childContext;
                if (inferno_shared_1.isInvalid(nextInput)) {
                    nextInput = VNodes_1.createVoidVNode();
                } else if (nextInput === inferno_shared_1.NO_OP) {
                    nextInput = lastInput;
                    didUpdate = false;
                } else if (inferno_shared_1.isStringOrNumber(nextInput)) {
                    nextInput = VNodes_1.createTextVNode(nextInput, null);
                } else if (inferno_shared_1.isArray(nextInput)) {
                    if (process.env.NODE_ENV !== 'production') {
                        inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
                    }
                    inferno_shared_1.throwError();
                } else if (inferno_shared_1.isObject(nextInput) && nextInput.dom) {
                    nextInput = VNodes_1.cloneVNode(nextInput);
                }
                if (nextInput.flags & inferno_vnode_flags_1.default.Component) {
                    nextInput.parentVNode = nextVNode;
                } else if (lastInput.flags & inferno_vnode_flags_1.default.Component) {
                    lastInput.parentVNode = nextVNode;
                }
                instance._lastInput = nextInput;
                instance._vNode = nextVNode;
                if (didUpdate) {
                    patch(lastInput, nextInput, parentDom, lifecycle, childContext, isSVG, isRecycling);
                    instance.componentDidUpdate(lastProps, lastState);
                    options_1.default.afterUpdate && options_1.default.afterUpdate(nextVNode);
                    options_1.default.findDOMNodeEnabled && rendering_1.componentToDOMNodeMap.set(instance, nextInput.dom);
                }
                instance._syncSetState = true;
                nextVNode.dom = nextInput.dom;
            }
        } else {
            var shouldUpdate = true;
            var lastProps = lastVNode.props;
            var nextHooks = nextVNode.ref;
            var nextHooksDefined = !inferno_shared_1.isNullOrUndef(nextHooks);
            var lastInput = lastVNode.children;
            var nextInput = lastInput;
            nextVNode.dom = lastVNode.dom;
            nextVNode.children = lastInput;
            if (lastKey !== nextKey) {
                shouldUpdate = true;
            } else {
                if (nextHooksDefined && !inferno_shared_1.isNullOrUndef(nextHooks.onComponentShouldUpdate)) {
                    shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps, nextProps);
                }
            }
            if (shouldUpdate !== false) {
                if (nextHooksDefined && !inferno_shared_1.isNullOrUndef(nextHooks.onComponentWillUpdate)) {
                    nextHooks.onComponentWillUpdate(lastProps, nextProps);
                }
                nextInput = nextType(nextProps, context);
                if (inferno_shared_1.isInvalid(nextInput)) {
                    nextInput = VNodes_1.createVoidVNode();
                } else if (inferno_shared_1.isStringOrNumber(nextInput) && nextInput !== inferno_shared_1.NO_OP) {
                    nextInput = VNodes_1.createTextVNode(nextInput, null);
                } else if (inferno_shared_1.isArray(nextInput)) {
                    if (process.env.NODE_ENV !== 'production') {
                        inferno_shared_1.throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');
                    }
                    inferno_shared_1.throwError();
                } else if (inferno_shared_1.isObject(nextInput) && nextInput.dom) {
                    nextInput = VNodes_1.cloneVNode(nextInput);
                }
                if (nextInput !== inferno_shared_1.NO_OP) {
                    patch(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling);
                    nextVNode.children = nextInput;
                    if (nextHooksDefined && !inferno_shared_1.isNullOrUndef(nextHooks.onComponentDidUpdate)) {
                        nextHooks.onComponentDidUpdate(lastProps, nextProps);
                    }
                    nextVNode.dom = nextInput.dom;
                }
            }
            if (nextInput.flags & inferno_vnode_flags_1.default.Component) {
                nextInput.parentVNode = nextVNode;
            } else if (lastInput.flags & inferno_vnode_flags_1.default.Component) {
                lastInput.parentVNode = nextVNode;
            }
        }
    }
    return false;
}
exports.patchComponent = patchComponent;
function patchText(lastVNode, nextVNode) {
    var nextText = nextVNode.children;
    var dom = lastVNode.dom;
    nextVNode.dom = dom;
    if (lastVNode.children !== nextText) {
        dom.nodeValue = nextText;
    }
}
exports.patchText = patchText;
function patchVoid(lastVNode, nextVNode) {
    nextVNode.dom = lastVNode.dom;
}
exports.patchVoid = patchVoid;
function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {
    var lastChildrenLength = lastChildren.length;
    var nextChildrenLength = nextChildren.length;
    var commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;
    var i = 0;
    for (; i < commonLength; i++) {
        var nextChild = nextChildren[i];
        if (nextChild.dom) {
            nextChild = nextChildren[i] = VNodes_1.cloneVNode(nextChild);
        }
        patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);
    }
    if (lastChildrenLength < nextChildrenLength) {
        for (i = commonLength; i < nextChildrenLength; i++) {
            var nextChild = nextChildren[i];
            if (nextChild.dom) {
                nextChild = nextChildren[i] = VNodes_1.cloneVNode(nextChild);
            }
            utils_1.appendChild(dom, mounting_1.mount(nextChild, null, lifecycle, context, isSVG));
        }
    } else if (nextChildrenLength === 0) {
        utils_1.removeAllChildren(dom, lastChildren, lifecycle, isRecycling);
    } else if (lastChildrenLength > nextChildrenLength) {
        for (i = commonLength; i < lastChildrenLength; i++) {
            unmounting_1.unmount(lastChildren[i], dom, lifecycle, false, isRecycling);
        }
    }
}
exports.patchNonKeyedChildren = patchNonKeyedChildren;
function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling) {
    var aLength = a.length;
    var bLength = b.length;
    var aEnd = aLength - 1;
    var bEnd = bLength - 1;
    var aStart = 0;
    var bStart = 0;
    var i;
    var j;
    var aNode;
    var bNode;
    var nextNode;
    var nextPos;
    var node;
    if (aLength === 0) {
        if (bLength !== 0) {
            mounting_1.mountArrayChildren(b, dom, lifecycle, context, isSVG);
        }
        return;
    } else if (bLength === 0) {
        utils_1.removeAllChildren(dom, a, lifecycle, isRecycling);
        return;
    }
    var aStartNode = a[aStart];
    var bStartNode = b[bStart];
    var aEndNode = a[aEnd];
    var bEndNode = b[bEnd];
    if (bStartNode.dom) {
        b[bStart] = bStartNode = VNodes_1.cloneVNode(bStartNode);
    }
    if (bEndNode.dom) {
        b[bEnd] = bEndNode = VNodes_1.cloneVNode(bEndNode);
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
                    b[bStart] = bStartNode = VNodes_1.cloneVNode(bStartNode);
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
                    b[bEnd] = bEndNode = VNodes_1.cloneVNode(bEndNode);
                }
            }
            if (aEndNode.key === bStartNode.key) {
                patch(aEndNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);
                utils_1.insertOrAppend(dom, bStartNode.dom, aStartNode.dom);
                aEnd--;
                bStart++;
                aEndNode = a[aEnd];
                bStartNode = b[bStart];
                if (bStartNode.dom) {
                    b[bStart] = bStartNode = VNodes_1.cloneVNode(bStartNode);
                }
                continue;
            }
            if (aStartNode.key === bEndNode.key) {
                patch(aStartNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);
                nextPos = bEnd + 1;
                nextNode = nextPos < b.length ? b[nextPos].dom : null;
                utils_1.insertOrAppend(dom, bEndNode.dom, nextNode);
                aStart++;
                bEnd--;
                aStartNode = a[aStart];
                bEndNode = b[bEnd];
                if (bEndNode.dom) {
                    b[bEnd] = bEndNode = VNodes_1.cloneVNode(bEndNode);
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
                    b[bStart] = node = VNodes_1.cloneVNode(node);
                }
                bStart++;
                utils_1.insertOrAppend(dom, mounting_1.mount(node, null, lifecycle, context, isSVG), nextNode);
            }
        }
    } else if (bStart > bEnd) {
        while (aStart <= aEnd) {
            unmounting_1.unmount(a[aStart++], dom, lifecycle, false, isRecycling);
        }
    } else {
        aLength = aEnd - aStart + 1;
        bLength = bEnd - bStart + 1;
        var sources = new Array(bLength);
        for (i = 0; i < bLength; i++) {
            sources[i] = -1;
        }
        var moved = false;
        var pos = 0;
        var patched = 0;
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
                                b[j] = bNode = VNodes_1.cloneVNode(bNode);
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
            var keyIndex = new Map();
            for (i = bStart; i <= bEnd; i++) {
                keyIndex.set(b[i].key, i);
            }
            for (i = aStart; i <= aEnd; i++) {
                aNode = a[i];
                if (patched < bLength) {
                    j = keyIndex.get(aNode.key);
                    if (!inferno_shared_1.isUndefined(j)) {
                        bNode = b[j];
                        sources[j - bStart] = i;
                        if (pos > j) {
                            moved = true;
                        } else {
                            pos = j;
                        }
                        if (bNode.dom) {
                            b[j] = bNode = VNodes_1.cloneVNode(bNode);
                        }
                        patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);
                        patched++;
                        a[i] = null;
                    }
                }
            }
        }
        if (aLength === a.length && patched === 0) {
            utils_1.removeAllChildren(dom, a, lifecycle, isRecycling);
            while (bStart < bLength) {
                node = b[bStart];
                if (node.dom) {
                    b[bStart] = node = VNodes_1.cloneVNode(node);
                }
                bStart++;
                utils_1.insertOrAppend(dom, mounting_1.mount(node, null, lifecycle, context, isSVG), null);
            }
        } else {
            i = aLength - patched;
            while (i > 0) {
                aNode = a[aStart++];
                if (!inferno_shared_1.isNull(aNode)) {
                    unmounting_1.unmount(aNode, dom, lifecycle, true, isRecycling);
                    i--;
                }
            }
            if (moved) {
                var seq = lis_algorithm(sources);
                j = seq.length - 1;
                for (i = bLength - 1; i >= 0; i--) {
                    if (sources[i] === -1) {
                        pos = i + bStart;
                        node = b[pos];
                        if (node.dom) {
                            b[pos] = node = VNodes_1.cloneVNode(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        utils_1.insertOrAppend(dom, mounting_1.mount(node, dom, lifecycle, context, isSVG), nextNode);
                    } else {
                        if (j < 0 || i !== seq[j]) {
                            pos = i + bStart;
                            node = b[pos];
                            nextPos = pos + 1;
                            nextNode = nextPos < b.length ? b[nextPos].dom : null;
                            utils_1.insertOrAppend(dom, node.dom, nextNode);
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
                            b[pos] = node = VNodes_1.cloneVNode(node);
                        }
                        nextPos = pos + 1;
                        nextNode = nextPos < b.length ? b[nextPos].dom : null;
                        utils_1.insertOrAppend(dom, mounting_1.mount(node, null, lifecycle, context, isSVG), nextNode);
                    }
                }
            }
        }
    }
}
exports.patchKeyedChildren = patchKeyedChildren;
function lis_algorithm(arr) {
    var p = arr.slice(0);
    var result = [0];
    var i;
    var j;
    var u;
    var v;
    var c;
    var len = arr.length;
    for (i = 0; i < len; i++) {
        var arrI = arr[i];
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
function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {
    if (prop in constants_1.skipProps || hasControlledValue && prop === 'value') {
        return;
    } else if (prop in constants_1.booleanProps) {
        dom[prop] = !!nextValue;
    } else if (prop in constants_1.strictProps) {
        var value = inferno_shared_1.isNullOrUndef(nextValue) ? '' : nextValue;
        if (dom[prop] !== value) {
            dom[prop] = value;
        }
    } else if (lastValue !== nextValue) {
        if (inferno_shared_1.isAttrAnEvent(prop)) {
            patchEvent(prop, lastValue, nextValue, dom);
        } else if (inferno_shared_1.isNullOrUndef(nextValue)) {
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
            var lastHtml = lastValue && lastValue.__html;
            var nextHtml = nextValue && nextValue.__html;
            if (lastHtml !== nextHtml) {
                if (!inferno_shared_1.isNullOrUndef(nextHtml)) {
                    dom.innerHTML = nextHtml;
                }
            }
        } else {
            var ns = isSVG ? constants_1.namespaces[prop] : false;
            if (ns) {
                dom.setAttributeNS(ns, prop, nextValue);
            } else {
                dom.setAttribute(prop, nextValue);
            }
        }
    }
}
exports.patchProp = patchProp;
function patchEvents(lastEvents, nextEvents, dom) {
    lastEvents = lastEvents || utils_1.EMPTY_OBJ;
    nextEvents = nextEvents || utils_1.EMPTY_OBJ;
    if (nextEvents !== utils_1.EMPTY_OBJ) {
        for (var name in nextEvents) {
            patchEvent(name, lastEvents[name], nextEvents[name], dom);
        }
    }
    if (lastEvents !== utils_1.EMPTY_OBJ) {
        for (var name in lastEvents) {
            if (inferno_shared_1.isNullOrUndef(nextEvents[name])) {
                patchEvent(name, lastEvents[name], null, dom);
            }
        }
    }
}
exports.patchEvents = patchEvents;
function patchEvent(name, lastValue, nextValue, dom) {
    if (lastValue !== nextValue) {
        var nameLowerCase = name.toLowerCase();
        var domEvent = dom[nameLowerCase];
        if (domEvent && domEvent.wrapped) {
            return;
        }
        if (constants_1.delegatedProps[name]) {
            delegation_1.handleEvent(name, lastValue, nextValue, dom);
        } else {
            if (lastValue !== nextValue) {
                if (!inferno_shared_1.isFunction(nextValue) && !inferno_shared_1.isNullOrUndef(nextValue)) {
                    var linkEvent_1 = nextValue.event;
                    if (linkEvent_1 && inferno_shared_1.isFunction(linkEvent_1)) {
                        if (!dom._data) {
                            dom[nameLowerCase] = function (e) {
                                linkEvent_1(e.currentTarget._data, e);
                            };
                        }
                        dom._data = nextValue.data;
                    } else {
                        if (process.env.NODE_ENV !== 'production') {
                            inferno_shared_1.throwError('an event on a VNode "' + name + '". was not a function or a valid linkEvent.');
                        }
                        inferno_shared_1.throwError();
                    }
                } else {
                    dom[nameLowerCase] = nextValue;
                }
            }
        }
    }
}
exports.patchEvent = patchEvent;
function patchStyle(lastAttrValue, nextAttrValue, dom) {
    var domStyle = dom.style;
    if (inferno_shared_1.isString(nextAttrValue)) {
        domStyle.cssText = nextAttrValue;
        return;
    }
    for (var style in nextAttrValue) {
        var value = nextAttrValue[style];
        if (inferno_shared_1.isNumber(value) && !(style in constants_1.isUnitlessNumber)) {
            domStyle[style] = value + 'px';
        } else {
            domStyle[style] = value;
        }
    }
    if (!inferno_shared_1.isNullOrUndef(lastAttrValue)) {
        for (var style in lastAttrValue) {
            if (inferno_shared_1.isNullOrUndef(nextAttrValue[style])) {
                domStyle[style] = '';
            }
        }
    }
}
exports.patchStyle = patchStyle;
function removeProp(prop, lastValue, dom) {
    if (prop === 'className') {
        dom.removeAttribute('class');
    } else if (prop === 'value') {
        dom.value = '';
    } else if (prop === 'style') {
        dom.removeAttribute('style');
    } else if (inferno_shared_1.isAttrAnEvent(prop)) {
        delegation_1.handleEvent(name, lastValue, null, dom);
    } else {
        dom.removeAttribute(prop);
    }
}
/* fuse:end-file "packages/inferno/src/DOM/patching.js"*/