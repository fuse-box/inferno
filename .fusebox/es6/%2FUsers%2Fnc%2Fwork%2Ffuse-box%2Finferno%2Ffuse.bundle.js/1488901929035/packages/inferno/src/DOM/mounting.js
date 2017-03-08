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
    var flags = vNode.flags;
    if (flags & VNodeFlags.Element) {
        return mountElement(vNode, parentDom, lifecycle, context, isSVG);
    } else if (flags & VNodeFlags.Component) {
        return mountComponent(vNode, parentDom, lifecycle, context, isSVG, flags & VNodeFlags.ComponentClass);
    } else if (flags & VNodeFlags.Void) {
        return mountVoid(vNode, parentDom);
    } else if (flags & VNodeFlags.Text) {
        return mountText(vNode, parentDom);
    } else {
        if (process.env.NODE_ENV !== 'production') {
            if (typeof vNode === 'object') {
                throwError('mount() received an object that\'s not a valid VNode, you should stringify it first. Object: "' + JSON.stringify(vNode) + '".');
            } else {
                throwError('mount() expects a valid VNode, instead it received an object with the type "' + typeof vNode + '".');
            }
        }
        throwError();
    }
}
export function mountText(vNode, parentDom) {
    var dom = document.createTextNode(vNode.children);
    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}
export function mountVoid(vNode, parentDom) {
    var dom = document.createTextNode('');
    vNode.dom = dom;
    if (parentDom) {
        appendChild(parentDom, dom);
    }
    return dom;
}
export function mountElement(vNode, parentDom, lifecycle, context, isSVG) {
    if (options.recyclingEnabled) {
        var dom_1 = recycleElement(vNode, lifecycle, context, isSVG);
        if (!isNull(dom_1)) {
            if (!isNull(parentDom)) {
                appendChild(parentDom, dom_1);
            }
            return dom_1;
        }
    }
    var flags = vNode.flags;
    if (isSVG || flags & VNodeFlags.SvgElement) {
        isSVG = true;
    }
    var dom = documentCreateElement(vNode.type, isSVG);
    var children = vNode.children;
    var props = vNode.props;
    var events = vNode.events;
    var ref = vNode.ref;
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
    var hasControlledValue = false;
    if (!(flags & VNodeFlags.HtmlElement)) {
        hasControlledValue = processElement(flags, vNode, dom, true);
    }
    if (!isNull(props)) {
        for (var prop in props) {
            patchProp(prop, null, props[prop], dom, isSVG, hasControlledValue);
        }
    }
    if (!isNull(events)) {
        for (var name in events) {
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
    for (var i = 0, len = children.length; i < len; i++) {
        var child = children[i];
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
        var dom_2 = recycleComponent(vNode, lifecycle, context, isSVG);
        if (!isNull(dom_2)) {
            if (!isNull(parentDom)) {
                appendChild(parentDom, dom_2);
            }
            return dom_2;
        }
    }
    var type = vNode.type;
    var props = vNode.props || EMPTY_OBJ;
    var ref = vNode.ref;
    var dom;
    if (isClass) {
        var instance = createClassComponentInstance(vNode, type, props, context, isSVG);
        var input = instance._lastInput;
        instance._vNode = vNode;
        vNode.dom = dom = mount(input, null, lifecycle, instance._childContext, isSVG);
        if (!isNull(parentDom)) {
            appendChild(parentDom, dom);
        }
        mountClassComponentCallbacks(vNode, ref, instance, lifecycle);
        options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, dom);
        vNode.children = instance;
    } else {
        var input = createFunctionalComponentInput(vNode, type, props, context);
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
            if (process.env.NODE_ENV !== 'production') {
                if (isStringOrNumber(ref)) {
                    throwError('string "refs" are not supported in Inferno 1.0. Use callback "refs" instead.');
                } else if (isObject(ref) && vNode.flags & VNodeFlags.ComponentClass) {
                    throwError('functional component lifecycle events are not supported on ES2015 class components.');
                } else {
                    throwError('a bad value for "ref" was used on component: "' + JSON.stringify(ref) + '"');
                }
            }
            throwError();
        }
    }
    var cDM = instance.componentDidMount;
    var afterMount = options.afterMount;
    if (!isUndefined(cDM) || !isNull(afterMount)) {
        lifecycle.addListener(function () {
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
            lifecycle.addListener(function () {
                return ref.onComponentDidMount(dom);
            });
        }
    }
}
export function mountRef(dom, value, lifecycle) {
    if (isFunction(value)) {
        lifecycle.addListener(function () {
            return value(dom);
        });
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