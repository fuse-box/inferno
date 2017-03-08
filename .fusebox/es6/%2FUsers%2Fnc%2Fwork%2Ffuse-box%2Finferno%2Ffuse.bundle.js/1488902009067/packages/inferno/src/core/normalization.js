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
        key = '.' + key;
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
    for (var len = nodes.length; index < len; index++) {
        var n = nodes[index];
        var key = currentKey + '.' + index;
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
    var newNodes;
    if (nodes['$']) {
        nodes = nodes.slice();
    } else {
        nodes['$'] = true;
    }
    for (var i = 0, len = nodes.length; i < len; i++) {
        var n = nodes[i];
        if (isInvalid(n) || isArray(n)) {
            var result = (newNodes || nodes).slice(0, i);
            _normalizeVNodes(nodes, result, i, '');
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
    var props = vNode.props;
    var type = vNode.type;
    var children = vNode.children;
    if (vNode.flags & VNodeFlags.Component) {
        var defaultProps = type.defaultProps;
        if (!isNullOrUndef(defaultProps)) {
            if (!props) {
                props = vNode.props = defaultProps;
            } else {
                for (var prop in defaultProps) {
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
    if (process.env.NODE_ENV !== 'production') {
        var verifyKeys = function (vNodes) {
            var keyValues = vNodes.map(function (vnode) {
                return vnode.key;
            });
            keyValues.some(function (item, idx) {
                var hasDuplicate = keyValues.indexOf(item) !== idx;
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