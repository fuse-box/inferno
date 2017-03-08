module.exports = { contents : "import { processInput } from './InputWrapper';\nimport { processSelect } from './SelectWrapper';\nimport { processTextarea } from './TextareaWrapper';\nimport VNodeFlags from 'inferno-vnode-flags';\nexport const wrappers = new Map();\nexport default function processElement(flags, vNode, dom, mounting) {\n    if (flags & VNodeFlags.InputElement) {\n        return processInput(vNode, dom);\n    }\n    if (flags & VNodeFlags.SelectElement) {\n        return processSelect(vNode, dom, mounting);\n    }\n    if (flags & VNodeFlags.TextareaElement) {\n        return processTextarea(vNode, dom, mounting);\n    }\n    return false;\n}\n", 
dependencies : ["./InputWrapper","./SelectWrapper","./TextareaWrapper","inferno-vnode-flags"], 
sourceMap : {},
headerContent : undefined, 
mtime : 1488885249000
};