'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
var processElement_1 = require('./processElement');
var utils_1 = require('../utils');
function isCheckedType(type) {
    return type === 'checkbox' || type === 'radio';
}
function isControlled(props) {
    var usesChecked = isCheckedType(props.type);
    return usesChecked ? !inferno_shared_1.isNullOrUndef(props.checked) : !inferno_shared_1.isNullOrUndef(props.value);
}
function onTextInputChange(e) {
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
    applyValue(this.vNode, dom);
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
function onCheckboxChange(e) {
    var vNode = this.vNode;
    var events = vNode.events || utils_1.EMPTY_OBJ;
    var dom = vNode.dom;
    if (events.onClick) {
        var event = events.onClick;
        if (event.event) {
            event.event(event.data, e);
        } else {
            event(e);
        }
    } else if (events.onclick) {
        events.onclick(e);
    }
    applyValue(this.vNode, dom);
}
function handleAssociatedRadioInputs(name) {
    var inputs = document.querySelectorAll('input[type="radio"][name="' + name + '"]');
    [].forEach.call(inputs, function (dom) {
        var inputWrapper = processElement_1.wrappers.get(dom);
        if (inputWrapper) {
            var props = inputWrapper.vNode.props;
            if (props) {
                dom.checked = inputWrapper.vNode.props.checked;
            }
        }
    });
}
function processInput(vNode, dom) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    applyValue(vNode, dom);
    if (isControlled(props)) {
        var inputWrapper = processElement_1.wrappers.get(dom);
        if (!inputWrapper) {
            inputWrapper = { vNode: vNode };
            if (isCheckedType(props.type)) {
                dom.onclick = onCheckboxChange.bind(inputWrapper);
                dom.onclick.wrapped = true;
            } else {
                dom.oninput = onTextInputChange.bind(inputWrapper);
                dom.oninput.wrapped = true;
            }
            if (props.onChange) {
                dom.onchange = wrappedOnChange.bind(inputWrapper);
                dom.onchange.wrapped = true;
            }
            processElement_1.wrappers.set(dom, inputWrapper);
        }
        inputWrapper.vNode = vNode;
        return true;
    }
    return false;
}
exports.processInput = processInput;
function applyValue(vNode, dom) {
    var props = vNode.props || utils_1.EMPTY_OBJ;
    var type = props.type;
    var value = props.value;
    var checked = props.checked;
    var multiple = props.multiple;
    var defaultValue = props.defaultValue;
    var hasValue = !inferno_shared_1.isNullOrUndef(value);
    if (type && type !== dom.type) {
        dom.type = type;
    }
    if (multiple && multiple !== dom.multiple) {
        dom.multiple = multiple;
    }
    if (!inferno_shared_1.isNullOrUndef(defaultValue) && !hasValue) {
        dom.defaultValue = defaultValue + '';
    }
    if (isCheckedType(type)) {
        if (hasValue) {
            dom.value = value;
        }
        if (!inferno_shared_1.isNullOrUndef(checked)) {
            dom.checked = checked;
        }
        if (type === 'radio' && props.name) {
            handleAssociatedRadioInputs(props.name);
        }
    } else {
        if (hasValue && dom.value !== value) {
            dom.value = value;
        } else if (!inferno_shared_1.isNullOrUndef(checked)) {
            dom.checked = checked;
        }
    }
}
exports.applyValue = applyValue;
/* fuse:end-file "packages/inferno/src/DOM/wrappers/InputWrapper.js"*/