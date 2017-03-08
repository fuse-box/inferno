module.exports = { contents : "import { isNullOrUndef } from '~/packages/inferno-shared/dist-es';\nimport { wrappers } from './processElement';\nimport { EMPTY_OBJ } from '../utils';\nfunction isCheckedType(type) {\n    return type === 'checkbox' || type === 'radio';\n}\nfunction isControlled(props) {\n    const usesChecked = isCheckedType(props.type);\n    return usesChecked ? !isNullOrUndef(props.checked) : !isNullOrUndef(props.value);\n}\nfunction onTextInputChange(e) {\n    let vNode = this.vNode;\n    const events = vNode.events || EMPTY_OBJ;\n    const dom = vNode.dom;\n    if (events.onInput) {\n        const event = events.onInput;\n        if (event.event) {\n            event.event(event.data, e);\n        } else {\n            event(e);\n        }\n    } else if (events.oninput) {\n        events.oninput(e);\n    }\n    applyValue(this.vNode, dom);\n}\nfunction wrappedOnChange(e) {\n    let vNode = this.vNode;\n    const events = vNode.events || EMPTY_OBJ;\n    const event = events.onChange;\n    if (event.event) {\n        event.event(event.data, e);\n    } else {\n        event(e);\n    }\n}\nfunction onCheckboxChange(e) {\n    const vNode = this.vNode;\n    const events = vNode.events || EMPTY_OBJ;\n    const dom = vNode.dom;\n    if (events.onClick) {\n        const event = events.onClick;\n        if (event.event) {\n            event.event(event.data, e);\n        } else {\n            event(e);\n        }\n    } else if (events.onclick) {\n        events.onclick(e);\n    }\n    applyValue(this.vNode, dom);\n}\nfunction handleAssociatedRadioInputs(name) {\n    const inputs = document.querySelectorAll(`input[type=\"radio\"][name=\"${ name }\"]`);\n    [].forEach.call(inputs, dom => {\n        const inputWrapper = wrappers.get(dom);\n        if (inputWrapper) {\n            const props = inputWrapper.vNode.props;\n            if (props) {\n                dom.checked = inputWrapper.vNode.props.checked;\n            }\n        }\n    });\n}\nexport function processInput(vNode, dom) {\n    const props = vNode.props || EMPTY_OBJ;\n    applyValue(vNode, dom);\n    if (isControlled(props)) {\n        let inputWrapper = wrappers.get(dom);\n        if (!inputWrapper) {\n            inputWrapper = { vNode };\n            if (isCheckedType(props.type)) {\n                dom.onclick = onCheckboxChange.bind(inputWrapper);\n                dom.onclick.wrapped = true;\n            } else {\n                dom.oninput = onTextInputChange.bind(inputWrapper);\n                dom.oninput.wrapped = true;\n            }\n            if (props.onChange) {\n                dom.onchange = wrappedOnChange.bind(inputWrapper);\n                dom.onchange.wrapped = true;\n            }\n            wrappers.set(dom, inputWrapper);\n        }\n        inputWrapper.vNode = vNode;\n        return true;\n    }\n    return false;\n}\nexport function applyValue(vNode, dom) {\n    const props = vNode.props || EMPTY_OBJ;\n    const type = props.type;\n    const value = props.value;\n    const checked = props.checked;\n    const multiple = props.multiple;\n    const defaultValue = props.defaultValue;\n    const hasValue = !isNullOrUndef(value);\n    if (type && type !== dom.type) {\n        dom.type = type;\n    }\n    if (multiple && multiple !== dom.multiple) {\n        dom.multiple = multiple;\n    }\n    if (!isNullOrUndef(defaultValue) && !hasValue) {\n        dom.defaultValue = defaultValue + '';\n    }\n    if (isCheckedType(type)) {\n        if (hasValue) {\n            dom.value = value;\n        }\n        if (!isNullOrUndef(checked)) {\n            dom.checked = checked;\n        }\n        if (type === 'radio' && props.name) {\n            handleAssociatedRadioInputs(props.name);\n        }\n    } else {\n        if (hasValue && dom.value !== value) {\n            dom.value = value;\n        } else if (!isNullOrUndef(checked)) {\n            dom.checked = checked;\n        }\n    }\n}", 
dependencies : ["~/packages/inferno-shared/dist-es","./processElement","../utils"], 
sourceMap : {},
headerContent : undefined, 
mtime : 1488885249000
};