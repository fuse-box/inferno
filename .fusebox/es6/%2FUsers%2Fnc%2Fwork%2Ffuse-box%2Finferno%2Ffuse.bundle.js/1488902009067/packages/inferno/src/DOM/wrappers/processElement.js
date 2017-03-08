import { processInput } from './InputWrapper';
import { processSelect } from './SelectWrapper';
import { processTextarea } from './TextareaWrapper';
import VNodeFlags from 'inferno-vnode-flags';
export var wrappers = new Map();
export default function processElement(flags, vNode, dom, mounting) {
    if (flags & VNodeFlags.InputElement) {
        return processInput(vNode, dom);
    }
    if (flags & VNodeFlags.SelectElement) {
        return processSelect(vNode, dom, mounting);
    }
    if (flags & VNodeFlags.TextareaElement) {
        return processTextarea(vNode, dom, mounting);
    }
    return false;
}

/* fuse:end-file "packages/inferno/src/DOM/wrappers/processElement.js"*/