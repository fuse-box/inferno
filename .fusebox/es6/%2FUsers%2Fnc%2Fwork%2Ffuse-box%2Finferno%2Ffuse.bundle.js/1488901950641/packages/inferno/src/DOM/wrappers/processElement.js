"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var InputWrapper_1 = require("./InputWrapper");
var SelectWrapper_1 = require("./SelectWrapper");
var TextareaWrapper_1 = require("./TextareaWrapper");
var inferno_vnode_flags_1 = require("inferno-vnode-flags");
exports.wrappers = new Map();
function processElement(flags, vNode, dom, mounting) {
    if (flags & inferno_vnode_flags_1.default.InputElement) {
        return InputWrapper_1.processInput(vNode, dom);
    }
    if (flags & inferno_vnode_flags_1.default.SelectElement) {
        return SelectWrapper_1.processSelect(vNode, dom, mounting);
    }
    if (flags & inferno_vnode_flags_1.default.TextareaElement) {
        return TextareaWrapper_1.processTextarea(vNode, dom, mounting);
    }
    return false;
}
exports.default = processElement;

/* fuse:end-file "packages/inferno/src/DOM/wrappers/processElement.js"*/