'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var inferno_vnode_flags_1 = require('inferno-vnode-flags');
var normalization_1 = require('./normalization');
var options_1 = require('./options');
var utils_1 = require('../DOM/utils');
function createVNode(flags, type, props, children, events, key, ref, noNormalise) {
    if (flags & inferno_vnode_flags_1.default.ComponentUnknown) {
        flags = inferno_shared_1.isStatefulComponent(type) ? inferno_vnode_flags_1.default.ComponentClass : inferno_vnode_flags_1.default.ComponentFunction;
    }
    var vNode = {
        children: inferno_shared_1.isUndefined(children) ? null : children,
        dom: null,
        events: events || null,
        flags: flags,
        key: inferno_shared_1.isUndefined(key) ? null : key,
        props: props || null,
        ref: ref || null,
        type: type
    };
    if (!noNormalise) {
        normalization_1.normalize(vNode);
    }
    if (options_1.default.createVNode) {
        options_1.default.createVNode(vNode);
    }
    return vNode;
}
exports.createVNode = createVNode;
function cloneVNode(vNodeToClone, props) {
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
        if (inferno_shared_1.isUndefined(props.children)) {
            props.children = children;
        } else {
            if (inferno_shared_1.isArray(children)) {
                if (inferno_shared_1.isArray(props.children)) {
                    props.children = props.children.concat(children);
                } else {
                    props.children = [props.children].concat(children);
                }
            } else {
                if (inferno_shared_1.isArray(props.children)) {
                    props.children.push(children);
                } else {
                    props.children = [props.children];
                    props.children.push(children);
                }
            }
        }
    }
    var newVNode;
    if (inferno_shared_1.isArray(vNodeToClone)) {
        var tmpArray = [];
        for (var i = 0, len = vNodeToClone.length; i < len; i++) {
            tmpArray.push(cloneVNode(vNodeToClone[i]));
        }
        newVNode = tmpArray;
    } else {
        var flags = vNodeToClone.flags;
        var events = vNodeToClone.events || props && props.events || null;
        var key = !inferno_shared_1.isNullOrUndef(vNodeToClone.key) ? vNodeToClone.key : props ? props.key : null;
        var ref = vNodeToClone.ref || (props ? props.ref : null);
        if (flags & inferno_vnode_flags_1.default.Component) {
            newVNode = createVNode(flags, vNodeToClone.type, !vNodeToClone.props && !props ? utils_1.EMPTY_OBJ : inferno_shared_1.assign({}, vNodeToClone.props, props), null, events, key, ref, true);
            var newProps = newVNode.props;
            if (newProps) {
                var newChildren = newProps.children;
                if (newChildren) {
                    if (inferno_shared_1.isArray(newChildren)) {
                        var len = newChildren.length;
                        if (len > 0) {
                            var tmpArray = [];
                            for (var i = 0; i < len; i++) {
                                var child = newChildren[i];
                                if (!inferno_shared_1.isInvalid(child) && isVNode(child)) {
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
        } else if (flags & inferno_vnode_flags_1.default.Element) {
            children = props && props.children || vNodeToClone.children;
            newVNode = createVNode(flags, vNodeToClone.type, !vNodeToClone.props && !props ? utils_1.EMPTY_OBJ : inferno_shared_1.assign({}, vNodeToClone.props, props), children, events, key, ref, !children);
        } else if (flags & inferno_vnode_flags_1.default.Text) {
            newVNode = createTextVNode(vNodeToClone.children, key);
        }
    }
    return newVNode;
}
exports.cloneVNode = cloneVNode;
function createVoidVNode() {
    return createVNode(inferno_vnode_flags_1.default.Void);
}
exports.createVoidVNode = createVoidVNode;
function createTextVNode(text, key) {
    return createVNode(inferno_vnode_flags_1.default.Text, null, null, text, null, key);
}
exports.createTextVNode = createTextVNode;
function isVNode(o) {
    return !!o.flags;
}
exports.isVNode = isVNode;
/* fuse:end-file "packages/inferno/src/core/VNodes.js"*/