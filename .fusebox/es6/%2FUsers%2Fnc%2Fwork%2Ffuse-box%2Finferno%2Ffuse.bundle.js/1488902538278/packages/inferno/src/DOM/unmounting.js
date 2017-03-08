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
        if (process.env.NODE_ENV !== 'production') {
            throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
        }
        throwError();
    }
}
/* fuse:end-file "packages/inferno/src/DOM/unmounting.js"*/