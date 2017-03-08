'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var processElement_1 = require('./processElement');
var utils_1 = require('../utils');
function isControlled(props) {
    return !inferno_shared_1.isNullOrUndef(props.value);
}
function wrappedOnChange(e) {
    var vNode = this.vNode;
    var events = vNode.events || utils_1.EMPTY_OBJ;
    var event = events.onChange;
    if (event.event) {
        event.event(event.data, e);
    } else {
        event(e);
    }
}
function onTextareaInputChange(e) {
    var vNode = this.vNode;
    var events = vNode.events || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    if (events.onInput) {
        var event = events.onInput;
        if (event.event) {
            event.event(event.data, e);
        } else {
            event(e);
        }
    } else if (events.oninput) {
        events.oninput(e);
    }
    applyValue(this.vNode, dom, false);
}
function processTextarea(vNode, dom, mounting) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    applyValue(vNode, dom, mounting);
    var textareaWrapper = processElement_1.wrappers.get(dom);
    if (isControlled(props)) {
        if (!textareaWrapper) {
            textareaWrapper = { vNode: vNode };
            dom.oninput = onTextareaInputChange.bind(textareaWrapper);
            dom.oninput.wrapped = true;
            if (props.onChange) {
                dom.onchange = wrappedOnChange.bind(textareaWrapper);
                dom.onchange.wrapped = true;
            }
            processElement_1.wrappers.set(dom, textareaWrapper);
        }
        textareaWrapper.vNode = vNode;
        return true;
    }
    return false;
}
exports.processTextarea = processTextarea;
function applyValue(vNode, dom, mounting) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var value = props.value;
    var domValue = dom.value;
    if (inferno_shared_1.isNullOrUndef(value)) {
        if (mounting) {
            var defaultValue = props.defaultValue;
            if (!inferno_shared_1.isNullOrUndef(defaultValue)) {
                if (defaultValue !== domValue) {
                    dom.value = defaultValue;
                }
            } else if (domValue !== '') {
                dom.value = '';
            }
        }
    } else {
        if (domValue !== value) {
            dom.value = value;
        }
    }
}
exports.applyValue = applyValue;
/* fuse:end-file "packages/inferno/src/DOM/wrappers/TextareaWrapper.js"*/