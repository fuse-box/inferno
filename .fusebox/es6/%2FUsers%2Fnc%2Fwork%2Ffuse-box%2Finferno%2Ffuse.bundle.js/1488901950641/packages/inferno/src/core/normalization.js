'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var inferno_vnode_flags_1 = require('inferno-vnode-flags');
var VNodes_1 = require('./VNodes');
function applyKey(key, vNode) {
    vNode.key = key;
    return vNode;
}
function applyKeyIfMissing(key, vNode) {
    if (inferno_shared_1.isNumber(key)) {
        key = '.' + key;
    }
    if (inferno_shared_1.isNull(vNode.key) || vNode.key[0] === '.') {
        return applyKey(key, vNode);
    }
    return vNode;
}
function applyKeyPrefix(key, vNode) {
    vNode.key = key + vNode.key;
    return vNode;
}
function _normalizeVNodes(nodes, result, index, currentKey) {
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        var key = currentKey + '.' + index;
        if (!inferno_shared_1.isInvalid(n)) {
            if (inferno_shared_1.isArray(n)) {
                _normalizeVNodes(n, result, 0, key);
            } else {
                if (inferno_shared_1.isStringOrNumber(n)) {
                    n = VNodes_1.createTextVNode(n, null);
                } else if (VNodes_1.isVNode(n) && n.dom || n.key && n.key[0] === '.') {
                    n = VNodes_1.cloneVNode(n);
                }
                if (inferno_shared_1.isNull(n.key) || n.key[0] === '.') {
                    n = applyKey(key, n);
                } else {
                    n = applyKeyPrefix(currentKey, n);
                }
                result.push(n);
            }
        }
    }
}
function normalizeVNodes(nodes) {
    var newNodes;
    if (nodes['$']) {
        nodes = nodes.slice();
    } else {
        nodes['$'] = true;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        var n = nodes[i];
        if (inferno_shared_1.isInvalid(n) || inferno_shared_1.isArray(n)) {
            var result = (newNodes || nodes).slice(0, i);
            _normalizeVNodes(nodes, result, i, '');
            return result;
        } else if (inferno_shared_1.isStringOrNumber(n)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, VNodes_1.createTextVNode(n, null)));
        } else if (VNodes_1.isVNode(n) && n.dom || inferno_shared_1.isNull(n.key) && !(n.flags & inferno_vnode_flags_1.default.HasNonKeyedChildren)) {
            if (!newNodes) {
                newNodes = nodes.slice(0, i);
            }
            newNodes.push(applyKeyIfMissing(i, VNodes_1.cloneVNode(n)));
        } else if (newNodes) {
            newNodes.push(applyKeyIfMissing(i, VNodes_1.cloneVNode(n)));
        }
    }
    return newNodes || nodes;
}
exports.normalizeVNodes = normalizeVNodes;
function normalizeChildren(children) {
    if (inferno_shared_1.isArray(children)) {
        return normalizeVNodes(children);
    } else if (VNodes_1.isVNode(children) && children.dom) {
        return VNodes_1.cloneVNode(children);
    }
    return children;
}
function normalizeProps(vNode, props, children) {
    if (!(vNode.flags & inferno_vnode_flags_1.default.Component) && inferno_shared_1.isNullOrUndef(children) && !inferno_shared_1.isNullOrUndef(props.children)) {
        vNode.children = props.children;
    }
    if (props.ref) {
        vNode.ref = props.ref;
        delete props.ref;
    }
    if (props.events) {
        vNode.events = props.events;
    }
    if (!inferno_shared_1.isNullOrUndef(props.key)) {
        vNode.key = props.key;
        delete props.key;
    }
}
function normalizeElement(type, vNode) {
    if (type === 'svg') {
        vNode.flags = inferno_vnode_flags_1.default.SvgElement;
    } else if (type === 'input') {
        vNode.flags = inferno_vnode_flags_1.default.InputElement;
    } else if (type === 'select') {
        vNode.flags = inferno_vnode_flags_1.default.SelectElement;
    } else if (type === 'textarea') {
        vNode.flags = inferno_vnode_flags_1.default.TextareaElement;
    } else if (type === 'media') {
        vNode.flags = inferno_vnode_flags_1.default.MediaElement;
    } else {
        vNode.flags = inferno_vnode_flags_1.default.HtmlElement;
    }
}
function normalize(vNode) {
    var props = vNode.props;
    var type = vNode.type;
    var children = vNode.children;
    if (vNode.flags & inferno_vnode_flags_1.default.Component) {
        var defaultProps = type.defaultProps;
        if (!inferno_shared_1.isNullOrUndef(defaultProps)) {
            if (!props) {
                props = vNode.props = defaultProps;
            } else {
                for (var prop in defaultProps) {
                    if (inferno_shared_1.isUndefined(props[prop])) {
                        props[prop] = defaultProps[prop];
                    }
                }
            }
        }
        if (inferno_shared_1.isString(type)) {
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
    if (!inferno_shared_1.isInvalid(children)) {
        vNode.children = normalizeChildren(children);
    }
    if (props && !inferno_shared_1.isInvalid(props.children)) {
        props.children = normalizeChildren(props.children);
    }
    if (process.env.NODE_ENV !== 'production') {
        var verifyKeys = function (vNodes) {
            var keyValues = vNodes.map(function (vnode) {
                return vnode.key;
            });
            keyValues.some(function (item, idx) {
                var hasDuplicate = keyValues.indexOf(item) !== idx;
                if (hasDuplicate) {
                    inferno_shared_1.warning('Inferno normalisation(...): Encountered two children with same key, all keys must be unique within its siblings. Duplicated key is:' + item);
                }
                return hasDuplicate;
            });
        };
        if (vNode.children && Array.isArray(vNode.children)) {
            verifyKeys(vNode.children);
        }
    }
}
exports.normalize = normalize;
/* fuse:end-file "packages/inferno/src/core/normalization.js"*/