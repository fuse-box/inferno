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
    var vNode = {
        children: isUndefined(children) ? null : children,
        dom: null,
        events: events || null,
        flags: flags,
        key: isUndefined(key) ? null : key,
        props: props || null,
        ref: ref || null,
        type: type
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
    var restParamLength = arguments.length - 2;
    var children;
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
    var newVNode;
    if (isArray(vNodeToClone)) {
        var tmpArray = [];
        for (var i = 0, len = vNodeToClone.length; i < len; i++) {
            tmpArray.push(cloneVNode(vNodeToClone[i]));
        }
        newVNode = tmpArray;
    } else {
        var flags = vNodeToClone.flags;
        var events = vNodeToClone.events || props && props.events || null;
        var key = !isNullOrUndef(vNodeToClone.key) ? vNodeToClone.key : props ? props.key : null;
        var ref = vNodeToClone.ref || (props ? props.ref : null);
        if (flags & VNodeFlags.Component) {
            newVNode = createVNode(flags, vNodeToClone.type, !vNodeToClone.props && !props ? EMPTY_OBJ : assign({}, vNodeToClone.props, props), null, events, key, ref, true);
            var newProps = newVNode.props;
            if (newProps) {
                var newChildren = newProps.children;
                if (newChildren) {
                    if (isArray(newChildren)) {
                        var len = newChildren.length;
                        if (len > 0) {
                            var tmpArray = [];
                            for (var i = 0; i < len; i++) {
                                var child = newChildren[i];
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