'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var VNodes_1 = require('../../core/VNodes');
var processElement_1 = require('./processElement');
var utils_1 = require('../utils');
function isControlled(props) {
    return !inferno_shared_1.isNullOrUndef(props.value);
}
function updateChildOptionGroup(vNode, value) {
    var type = vNode.type;
    if (type === 'optgroup') {
        var children = vNode.children;
        if (inferno_shared_1.isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                updateChildOption(children[i], value);
            }
        } else if (VNodes_1.isVNode(children)) {
            updateChildOption(children, value);
        }
    } else {
        updateChildOption(vNode, value);
    }
}
function updateChildOption(vNode, value) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    dom.value = props.value;
    if (inferno_shared_1.isArray(value) && value.indexOf(props.value) !== -1 || props.value === value) {
        dom.selected = true;
    } else if (!inferno_shared_1.isNullOrUndef(value) || !inferno_shared_1.isNullOrUndef(props.selected)) {
        dom.selected = props.selected || false;
    }
}
function onSelectChange(e) {
    var vNode = this.vNode;
    var events = vNode.events || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    if (events.onChange) {
        var event = events.onChange;
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
function processSelect(vNode, dom, mounting) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    applyValue(vNode, dom, mounting);
    if (isControlled(props)) {
        var selectWrapper = processElement_1.wrappers.get(dom);
        if (!selectWrapper) {
            selectWrapper = { vNode: vNode };
            dom.onchange = onSelectChange.bind(selectWrapper);
            dom.onchange.wrapped = true;
            processElement_1.wrappers.set(dom, selectWrapper);
        }
        selectWrapper.vNode = vNode;
        return true;
    }
    return false;
}
exports.processSelect = processSelect;
function applyValue(vNode, dom, mounting) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    if (props.multiple !== dom.multiple) {
        dom.multiple = props.multiple;
    }
    var children = vNode.children;
    if (!inferno_shared_1.isInvalid(children)) {
        var value = props.value;
        if (mounting && inferno_shared_1.isNullOrUndef(value)) {
            value = props.defaultValue;
        }
        if (inferno_shared_1.isArray(children)) {
            for (var i = 0, len = children.length; i < len; i++) {
                updateChildOptionGroup(children[i], value);
            }
        } else if (VNodes_1.isVNode(children)) {
            updateChildOptionGroup(children, value);
        }
    }
}
exports.applyValue = applyValue;
/* fuse:end-file "packages/inferno/src/DOM/wrappers/SelectWrapper.js"*/