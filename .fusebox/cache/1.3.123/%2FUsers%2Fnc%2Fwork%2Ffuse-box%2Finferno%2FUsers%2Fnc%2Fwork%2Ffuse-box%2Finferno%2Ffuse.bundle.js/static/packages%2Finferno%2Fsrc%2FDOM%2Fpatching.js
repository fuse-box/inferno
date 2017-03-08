module.exports = { contents : "import {\n    assign,\n    isArray,\n    isAttrAnEvent,\n    isFunction,\n    isInvalid,\n    isNull,\n    isNullOrUndef,\n    isNumber,\n    isObject,\n    isString,\n    isStringOrNumber,\n    isUndefined,\n    NO_OP,\n    throwError\n} from '~/packages/inferno-shared/dist-es';\nimport VNodeFlags from 'inferno-vnode-flags';\nimport options from '../core/options';\nimport {\n    cloneVNode,\n    createTextVNode,\n    createVoidVNode,\n    isVNode\n} from '../core/VNodes';\nimport {\n    booleanProps,\n    delegatedProps,\n    isUnitlessNumber,\n    namespaces,\n    skipProps,\n    strictProps\n} from './constants';\nimport { handleEvent } from './events/delegation';\nimport {\n    mount,\n    mountArrayChildren,\n    mountComponent,\n    mountElement,\n    mountRef,\n    mountText,\n    mountVoid\n} from './mounting';\nimport {\n    appendChild,\n    insertOrAppend,\n    isKeyed,\n    removeAllChildren,\n    replaceChild,\n    replaceLastChildAndUnmount,\n    replaceVNode,\n    replaceWithNewNode,\n    setTextContent,\n    updateTextContent,\n    EMPTY_OBJ\n} from './utils';\nimport { componentToDOMNodeMap } from './rendering';\nimport { unmount } from './unmounting';\nimport processElement from './wrappers/processElement';\nexport function patch(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {\n    if (lastVNode !== nextVNode) {\n        const lastFlags = lastVNode.flags;\n        const nextFlags = nextVNode.flags;\n        if (nextFlags & VNodeFlags.Component) {\n            if (lastFlags & VNodeFlags.Component) {\n                patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, nextFlags & VNodeFlags.ComponentClass, isRecycling);\n            } else {\n                replaceVNode(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, nextFlags & VNodeFlags.ComponentClass), lastVNode, lifecycle, isRecycling);\n            }\n        } else if (nextFlags & VNodeFlags.Element) {\n            if (lastFlags & VNodeFlags.Element) {\n                patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);\n            } else {\n                replaceVNode(parentDom, mountElement(nextVNode, null, lifecycle, context, isSVG), lastVNode, lifecycle, isRecycling);\n            }\n        } else if (nextFlags & VNodeFlags.Text) {\n            if (lastFlags & VNodeFlags.Text) {\n                patchText(lastVNode, nextVNode);\n            } else {\n                replaceVNode(parentDom, mountText(nextVNode, null), lastVNode, lifecycle, isRecycling);\n            }\n        } else if (nextFlags & VNodeFlags.Void) {\n            if (lastFlags & VNodeFlags.Void) {\n                patchVoid(lastVNode, nextVNode);\n            } else {\n                replaceVNode(parentDom, mountVoid(nextVNode, null), lastVNode, lifecycle, isRecycling);\n            }\n        } else {\n            replaceLastChildAndUnmount(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);\n        }\n    }\n}\nfunction unmountChildren(children, dom, lifecycle, isRecycling) {\n    if (isVNode(children)) {\n        unmount(children, dom, lifecycle, true, isRecycling);\n    } else if (isArray(children)) {\n        removeAllChildren(dom, children, lifecycle, isRecycling);\n    } else {\n        dom.textContent = '';\n    }\n}\nexport function patchElement(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling) {\n    const nextTag = nextVNode.type;\n    const lastTag = lastVNode.type;\n    if (lastTag !== nextTag) {\n        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);\n    } else {\n        const dom = lastVNode.dom;\n        const lastProps = lastVNode.props;\n        const nextProps = nextVNode.props;\n        const lastChildren = lastVNode.children;\n        const nextChildren = nextVNode.children;\n        const lastFlags = lastVNode.flags;\n        const nextFlags = nextVNode.flags;\n        const nextRef = nextVNode.ref;\n        const lastEvents = lastVNode.events;\n        const nextEvents = nextVNode.events;\n        nextVNode.dom = dom;\n        if (isSVG || nextFlags & VNodeFlags.SvgElement) {\n            isSVG = true;\n        }\n        if (lastChildren !== nextChildren) {\n            patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);\n        }\n        let hasControlledValue = false;\n        if (!(nextFlags & VNodeFlags.HtmlElement)) {\n            hasControlledValue = processElement(nextFlags, nextVNode, dom, false);\n        }\n        if (lastProps !== nextProps) {\n            const lastPropsOrEmpty = lastProps || EMPTY_OBJ;\n            const nextPropsOrEmpty = nextProps || EMPTY_OBJ;\n            if (nextPropsOrEmpty !== EMPTY_OBJ) {\n                for (let prop in nextPropsOrEmpty) {\n                    const nextValue = nextPropsOrEmpty[prop];\n                    const lastValue = lastPropsOrEmpty[prop];\n                    if (isNullOrUndef(nextValue)) {\n                        removeProp(prop, nextValue, dom);\n                    } else {\n                        patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue);\n                    }\n                }\n            }\n            if (lastPropsOrEmpty !== EMPTY_OBJ) {\n                for (let prop in lastPropsOrEmpty) {\n                    if (isNullOrUndef(nextPropsOrEmpty[prop])) {\n                        removeProp(prop, lastPropsOrEmpty[prop], dom);\n                    }\n                }\n            }\n        }\n        if (lastEvents !== nextEvents) {\n            patchEvents(lastEvents, nextEvents, dom);\n        }\n        if (nextRef) {\n            if (lastVNode.ref !== nextRef || isRecycling) {\n                mountRef(dom, nextRef, lifecycle);\n            }\n        }\n    }\n}\nfunction patchChildren(lastFlags, nextFlags, lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {\n    let patchArray = false;\n    let patchKeyed = false;\n    if (nextFlags & VNodeFlags.HasNonKeyedChildren) {\n        patchArray = true;\n    } else if (lastFlags & VNodeFlags.HasKeyedChildren && nextFlags & VNodeFlags.HasKeyedChildren) {\n        patchKeyed = true;\n        patchArray = true;\n    } else if (isInvalid(nextChildren)) {\n        unmountChildren(lastChildren, dom, lifecycle, isRecycling);\n    } else if (isInvalid(lastChildren)) {\n        if (isStringOrNumber(nextChildren)) {\n            setTextContent(dom, nextChildren);\n        } else {\n            if (isArray(nextChildren)) {\n                mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);\n            } else {\n                mount(nextChildren, dom, lifecycle, context, isSVG);\n            }\n        }\n    } else if (isStringOrNumber(nextChildren)) {\n        if (isStringOrNumber(lastChildren)) {\n            updateTextContent(dom, nextChildren);\n        } else {\n            unmountChildren(lastChildren, dom, lifecycle, isRecycling);\n            setTextContent(dom, nextChildren);\n        }\n    } else if (isArray(nextChildren)) {\n        if (isArray(lastChildren)) {\n            patchArray = true;\n            if (isKeyed(lastChildren, nextChildren)) {\n                patchKeyed = true;\n            }\n        } else {\n            unmountChildren(lastChildren, dom, lifecycle, isRecycling);\n            mountArrayChildren(nextChildren, dom, lifecycle, context, isSVG);\n        }\n    } else if (isArray(lastChildren)) {\n        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);\n        mount(nextChildren, dom, lifecycle, context, isSVG);\n    } else if (isVNode(nextChildren)) {\n        if (isVNode(lastChildren)) {\n            patch(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);\n        } else {\n            unmountChildren(lastChildren, dom, lifecycle, isRecycling);\n            mount(nextChildren, dom, lifecycle, context, isSVG);\n        }\n    }\n    if (patchArray) {\n        if (patchKeyed) {\n            patchKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);\n        } else {\n            patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling);\n        }\n    }\n}\nexport function patchComponent(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isClass, isRecycling) {\n    const lastType = lastVNode.type;\n    const nextType = nextVNode.type;\n    const lastKey = lastVNode.key;\n    const nextKey = nextVNode.key;\n    if (lastType !== nextType || lastKey !== nextKey) {\n        replaceWithNewNode(lastVNode, nextVNode, parentDom, lifecycle, context, isSVG, isRecycling);\n        return false;\n    } else {\n        const nextProps = nextVNode.props || EMPTY_OBJ;\n        if (isClass) {\n            const instance = lastVNode.children;\n            if (instance._unmounted) {\n                if (isNull(parentDom)) {\n                    return true;\n                }\n                replaceChild(parentDom, mountComponent(nextVNode, null, lifecycle, context, isSVG, nextVNode.flags & VNodeFlags.ComponentClass), lastVNode.dom);\n            } else {\n                const lastState = instance.state;\n                const nextState = instance.state;\n                const lastProps = instance.props;\n                let childContext = instance.getChildContext();\n                nextVNode.children = instance;\n                instance._isSVG = isSVG;\n                instance._syncSetState = false;\n                if (isNullOrUndef(childContext)) {\n                    childContext = context;\n                } else {\n                    childContext = assign({}, context, childContext);\n                }\n                const lastInput = instance._lastInput;\n                let nextInput = instance._updateComponent(lastState, nextState, lastProps, nextProps, context, false, false);\n                let didUpdate = true;\n                instance._childContext = childContext;\n                if (isInvalid(nextInput)) {\n                    nextInput = createVoidVNode();\n                } else if (nextInput === NO_OP) {\n                    nextInput = lastInput;\n                    didUpdate = false;\n                } else if (isStringOrNumber(nextInput)) {\n                    nextInput = createTextVNode(nextInput, null);\n                } else if (isArray(nextInput)) {\n                    if (process.env.NODE_ENV !== 'production') {\n                        throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');\n                    }\n                    throwError();\n                } else if (isObject(nextInput) && nextInput.dom) {\n                    nextInput = cloneVNode(nextInput);\n                }\n                if (nextInput.flags & VNodeFlags.Component) {\n                    nextInput.parentVNode = nextVNode;\n                } else if (lastInput.flags & VNodeFlags.Component) {\n                    lastInput.parentVNode = nextVNode;\n                }\n                instance._lastInput = nextInput;\n                instance._vNode = nextVNode;\n                if (didUpdate) {\n                    patch(lastInput, nextInput, parentDom, lifecycle, childContext, isSVG, isRecycling);\n                    instance.componentDidUpdate(lastProps, lastState);\n                    options.afterUpdate && options.afterUpdate(nextVNode);\n                    options.findDOMNodeEnabled && componentToDOMNodeMap.set(instance, nextInput.dom);\n                }\n                instance._syncSetState = true;\n                nextVNode.dom = nextInput.dom;\n            }\n        } else {\n            let shouldUpdate = true;\n            const lastProps = lastVNode.props;\n            const nextHooks = nextVNode.ref;\n            const nextHooksDefined = !isNullOrUndef(nextHooks);\n            const lastInput = lastVNode.children;\n            let nextInput = lastInput;\n            nextVNode.dom = lastVNode.dom;\n            nextVNode.children = lastInput;\n            if (lastKey !== nextKey) {\n                shouldUpdate = true;\n            } else {\n                if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentShouldUpdate)) {\n                    shouldUpdate = nextHooks.onComponentShouldUpdate(lastProps, nextProps);\n                }\n            }\n            if (shouldUpdate !== false) {\n                if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentWillUpdate)) {\n                    nextHooks.onComponentWillUpdate(lastProps, nextProps);\n                }\n                nextInput = nextType(nextProps, context);\n                if (isInvalid(nextInput)) {\n                    nextInput = createVoidVNode();\n                } else if (isStringOrNumber(nextInput) && nextInput !== NO_OP) {\n                    nextInput = createTextVNode(nextInput, null);\n                } else if (isArray(nextInput)) {\n                    if (process.env.NODE_ENV !== 'production') {\n                        throwError('a valid Inferno VNode (or null) must be returned from a component render. You may have returned an array or an invalid object.');\n                    }\n                    throwError();\n                } else if (isObject(nextInput) && nextInput.dom) {\n                    nextInput = cloneVNode(nextInput);\n                }\n                if (nextInput !== NO_OP) {\n                    patch(lastInput, nextInput, parentDom, lifecycle, context, isSVG, isRecycling);\n                    nextVNode.children = nextInput;\n                    if (nextHooksDefined && !isNullOrUndef(nextHooks.onComponentDidUpdate)) {\n                        nextHooks.onComponentDidUpdate(lastProps, nextProps);\n                    }\n                    nextVNode.dom = nextInput.dom;\n                }\n            }\n            if (nextInput.flags & VNodeFlags.Component) {\n                nextInput.parentVNode = nextVNode;\n            } else if (lastInput.flags & VNodeFlags.Component) {\n                lastInput.parentVNode = nextVNode;\n            }\n        }\n    }\n    return false;\n}\nexport function patchText(lastVNode, nextVNode) {\n    const nextText = nextVNode.children;\n    const dom = lastVNode.dom;\n    nextVNode.dom = dom;\n    if (lastVNode.children !== nextText) {\n        dom.nodeValue = nextText;\n    }\n}\nexport function patchVoid(lastVNode, nextVNode) {\n    nextVNode.dom = lastVNode.dom;\n}\nexport function patchNonKeyedChildren(lastChildren, nextChildren, dom, lifecycle, context, isSVG, isRecycling) {\n    const lastChildrenLength = lastChildren.length;\n    const nextChildrenLength = nextChildren.length;\n    const commonLength = lastChildrenLength > nextChildrenLength ? nextChildrenLength : lastChildrenLength;\n    let i = 0;\n    for (; i < commonLength; i++) {\n        let nextChild = nextChildren[i];\n        if (nextChild.dom) {\n            nextChild = nextChildren[i] = cloneVNode(nextChild);\n        }\n        patch(lastChildren[i], nextChild, dom, lifecycle, context, isSVG, isRecycling);\n    }\n    if (lastChildrenLength < nextChildrenLength) {\n        for (i = commonLength; i < nextChildrenLength; i++) {\n            let nextChild = nextChildren[i];\n            if (nextChild.dom) {\n                nextChild = nextChildren[i] = cloneVNode(nextChild);\n            }\n            appendChild(dom, mount(nextChild, null, lifecycle, context, isSVG));\n        }\n    } else if (nextChildrenLength === 0) {\n        removeAllChildren(dom, lastChildren, lifecycle, isRecycling);\n    } else if (lastChildrenLength > nextChildrenLength) {\n        for (i = commonLength; i < lastChildrenLength; i++) {\n            unmount(lastChildren[i], dom, lifecycle, false, isRecycling);\n        }\n    }\n}\nexport function patchKeyedChildren(a, b, dom, lifecycle, context, isSVG, isRecycling) {\n    let aLength = a.length;\n    let bLength = b.length;\n    let aEnd = aLength - 1;\n    let bEnd = bLength - 1;\n    let aStart = 0;\n    let bStart = 0;\n    let i;\n    let j;\n    let aNode;\n    let bNode;\n    let nextNode;\n    let nextPos;\n    let node;\n    if (aLength === 0) {\n        if (bLength !== 0) {\n            mountArrayChildren(b, dom, lifecycle, context, isSVG);\n        }\n        return;\n    } else if (bLength === 0) {\n        removeAllChildren(dom, a, lifecycle, isRecycling);\n        return;\n    }\n    let aStartNode = a[aStart];\n    let bStartNode = b[bStart];\n    let aEndNode = a[aEnd];\n    let bEndNode = b[bEnd];\n    if (bStartNode.dom) {\n        b[bStart] = bStartNode = cloneVNode(bStartNode);\n    }\n    if (bEndNode.dom) {\n        b[bEnd] = bEndNode = cloneVNode(bEndNode);\n    }\n    outer:\n        while (true) {\n            while (aStartNode.key === bStartNode.key) {\n                patch(aStartNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);\n                aStart++;\n                bStart++;\n                if (aStart > aEnd || bStart > bEnd) {\n                    break outer;\n                }\n                aStartNode = a[aStart];\n                bStartNode = b[bStart];\n                if (bStartNode.dom) {\n                    b[bStart] = bStartNode = cloneVNode(bStartNode);\n                }\n            }\n            while (aEndNode.key === bEndNode.key) {\n                patch(aEndNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);\n                aEnd--;\n                bEnd--;\n                if (aStart > aEnd || bStart > bEnd) {\n                    break outer;\n                }\n                aEndNode = a[aEnd];\n                bEndNode = b[bEnd];\n                if (bEndNode.dom) {\n                    b[bEnd] = bEndNode = cloneVNode(bEndNode);\n                }\n            }\n            if (aEndNode.key === bStartNode.key) {\n                patch(aEndNode, bStartNode, dom, lifecycle, context, isSVG, isRecycling);\n                insertOrAppend(dom, bStartNode.dom, aStartNode.dom);\n                aEnd--;\n                bStart++;\n                aEndNode = a[aEnd];\n                bStartNode = b[bStart];\n                if (bStartNode.dom) {\n                    b[bStart] = bStartNode = cloneVNode(bStartNode);\n                }\n                continue;\n            }\n            if (aStartNode.key === bEndNode.key) {\n                patch(aStartNode, bEndNode, dom, lifecycle, context, isSVG, isRecycling);\n                nextPos = bEnd + 1;\n                nextNode = nextPos < b.length ? b[nextPos].dom : null;\n                insertOrAppend(dom, bEndNode.dom, nextNode);\n                aStart++;\n                bEnd--;\n                aStartNode = a[aStart];\n                bEndNode = b[bEnd];\n                if (bEndNode.dom) {\n                    b[bEnd] = bEndNode = cloneVNode(bEndNode);\n                }\n                continue;\n            }\n            break;\n        }\n    if (aStart > aEnd) {\n        if (bStart <= bEnd) {\n            nextPos = bEnd + 1;\n            nextNode = nextPos < b.length ? b[nextPos].dom : null;\n            while (bStart <= bEnd) {\n                node = b[bStart];\n                if (node.dom) {\n                    b[bStart] = node = cloneVNode(node);\n                }\n                bStart++;\n                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);\n            }\n        }\n    } else if (bStart > bEnd) {\n        while (aStart <= aEnd) {\n            unmount(a[aStart++], dom, lifecycle, false, isRecycling);\n        }\n    } else {\n        aLength = aEnd - aStart + 1;\n        bLength = bEnd - bStart + 1;\n        const sources = new Array(bLength);\n        for (i = 0; i < bLength; i++) {\n            sources[i] = -1;\n        }\n        let moved = false;\n        let pos = 0;\n        let patched = 0;\n        if (bLength <= 4 || aLength * bLength <= 16) {\n            for (i = aStart; i <= aEnd; i++) {\n                aNode = a[i];\n                if (patched < bLength) {\n                    for (j = bStart; j <= bEnd; j++) {\n                        bNode = b[j];\n                        if (aNode.key === bNode.key) {\n                            sources[j - bStart] = i;\n                            if (pos > j) {\n                                moved = true;\n                            } else {\n                                pos = j;\n                            }\n                            if (bNode.dom) {\n                                b[j] = bNode = cloneVNode(bNode);\n                            }\n                            patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);\n                            patched++;\n                            a[i] = null;\n                            break;\n                        }\n                    }\n                }\n            }\n        } else {\n            const keyIndex = new Map();\n            for (i = bStart; i <= bEnd; i++) {\n                keyIndex.set(b[i].key, i);\n            }\n            for (i = aStart; i <= aEnd; i++) {\n                aNode = a[i];\n                if (patched < bLength) {\n                    j = keyIndex.get(aNode.key);\n                    if (!isUndefined(j)) {\n                        bNode = b[j];\n                        sources[j - bStart] = i;\n                        if (pos > j) {\n                            moved = true;\n                        } else {\n                            pos = j;\n                        }\n                        if (bNode.dom) {\n                            b[j] = bNode = cloneVNode(bNode);\n                        }\n                        patch(aNode, bNode, dom, lifecycle, context, isSVG, isRecycling);\n                        patched++;\n                        a[i] = null;\n                    }\n                }\n            }\n        }\n        if (aLength === a.length && patched === 0) {\n            removeAllChildren(dom, a, lifecycle, isRecycling);\n            while (bStart < bLength) {\n                node = b[bStart];\n                if (node.dom) {\n                    b[bStart] = node = cloneVNode(node);\n                }\n                bStart++;\n                insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), null);\n            }\n        } else {\n            i = aLength - patched;\n            while (i > 0) {\n                aNode = a[aStart++];\n                if (!isNull(aNode)) {\n                    unmount(aNode, dom, lifecycle, true, isRecycling);\n                    i--;\n                }\n            }\n            if (moved) {\n                const seq = lis_algorithm(sources);\n                j = seq.length - 1;\n                for (i = bLength - 1; i >= 0; i--) {\n                    if (sources[i] === -1) {\n                        pos = i + bStart;\n                        node = b[pos];\n                        if (node.dom) {\n                            b[pos] = node = cloneVNode(node);\n                        }\n                        nextPos = pos + 1;\n                        nextNode = nextPos < b.length ? b[nextPos].dom : null;\n                        insertOrAppend(dom, mount(node, dom, lifecycle, context, isSVG), nextNode);\n                    } else {\n                        if (j < 0 || i !== seq[j]) {\n                            pos = i + bStart;\n                            node = b[pos];\n                            nextPos = pos + 1;\n                            nextNode = nextPos < b.length ? b[nextPos].dom : null;\n                            insertOrAppend(dom, node.dom, nextNode);\n                        } else {\n                            j--;\n                        }\n                    }\n                }\n            } else if (patched !== bLength) {\n                for (i = bLength - 1; i >= 0; i--) {\n                    if (sources[i] === -1) {\n                        pos = i + bStart;\n                        node = b[pos];\n                        if (node.dom) {\n                            b[pos] = node = cloneVNode(node);\n                        }\n                        nextPos = pos + 1;\n                        nextNode = nextPos < b.length ? b[nextPos].dom : null;\n                        insertOrAppend(dom, mount(node, null, lifecycle, context, isSVG), nextNode);\n                    }\n                }\n            }\n        }\n    }\n}\nfunction lis_algorithm(arr) {\n    const p = arr.slice(0);\n    const result = [0];\n    let i;\n    let j;\n    let u;\n    let v;\n    let c;\n    const len = arr.length;\n    for (i = 0; i < len; i++) {\n        let arrI = arr[i];\n        if (arrI === -1) {\n            continue;\n        }\n        j = result[result.length - 1];\n        if (arr[j] < arrI) {\n            p[i] = j;\n            result.push(i);\n            continue;\n        }\n        u = 0;\n        v = result.length - 1;\n        while (u < v) {\n            c = (u + v) / 2 | 0;\n            if (arr[result[c]] < arrI) {\n                u = c + 1;\n            } else {\n                v = c;\n            }\n        }\n        if (arrI < arr[result[u]]) {\n            if (u > 0) {\n                p[i] = result[u - 1];\n            }\n            result[u] = i;\n        }\n    }\n    u = result.length;\n    v = result[u - 1];\n    while (u-- > 0) {\n        result[u] = v;\n        v = p[v];\n    }\n    return result;\n}\nexport function patchProp(prop, lastValue, nextValue, dom, isSVG, hasControlledValue) {\n    if (prop in skipProps || hasControlledValue && prop === 'value') {\n        return;\n    } else if (prop in booleanProps) {\n        dom[prop] = !!nextValue;\n    } else if (prop in strictProps) {\n        const value = isNullOrUndef(nextValue) ? '' : nextValue;\n        if (dom[prop] !== value) {\n            dom[prop] = value;\n        }\n    } else if (lastValue !== nextValue) {\n        if (isAttrAnEvent(prop)) {\n            patchEvent(prop, lastValue, nextValue, dom);\n        } else if (isNullOrUndef(nextValue)) {\n            dom.removeAttribute(prop);\n        } else if (prop === 'className') {\n            if (isSVG) {\n                dom.setAttribute('class', nextValue);\n            } else {\n                dom.className = nextValue;\n            }\n        } else if (prop === 'style') {\n            patchStyle(lastValue, nextValue, dom);\n        } else if (prop === 'dangerouslySetInnerHTML') {\n            const lastHtml = lastValue && lastValue.__html;\n            const nextHtml = nextValue && nextValue.__html;\n            if (lastHtml !== nextHtml) {\n                if (!isNullOrUndef(nextHtml)) {\n                    dom.innerHTML = nextHtml;\n                }\n            }\n        } else {\n            const ns = isSVG ? namespaces[prop] : false;\n            if (ns) {\n                dom.setAttributeNS(ns, prop, nextValue);\n            } else {\n                dom.setAttribute(prop, nextValue);\n            }\n        }\n    }\n}\nexport function patchEvents(lastEvents, nextEvents, dom) {\n    lastEvents = lastEvents || EMPTY_OBJ;\n    nextEvents = nextEvents || EMPTY_OBJ;\n    if (nextEvents !== EMPTY_OBJ) {\n        for (let name in nextEvents) {\n            patchEvent(name, lastEvents[name], nextEvents[name], dom);\n        }\n    }\n    if (lastEvents !== EMPTY_OBJ) {\n        for (let name in lastEvents) {\n            if (isNullOrUndef(nextEvents[name])) {\n                patchEvent(name, lastEvents[name], null, dom);\n            }\n        }\n    }\n}\nexport function patchEvent(name, lastValue, nextValue, dom) {\n    if (lastValue !== nextValue) {\n        const nameLowerCase = name.toLowerCase();\n        const domEvent = dom[nameLowerCase];\n        if (domEvent && domEvent.wrapped) {\n            return;\n        }\n        if (delegatedProps[name]) {\n            handleEvent(name, lastValue, nextValue, dom);\n        } else {\n            if (lastValue !== nextValue) {\n                if (!isFunction(nextValue) && !isNullOrUndef(nextValue)) {\n                    const linkEvent = nextValue.event;\n                    if (linkEvent && isFunction(linkEvent)) {\n                        if (!dom._data) {\n                            dom[nameLowerCase] = function (e) {\n                                linkEvent(e.currentTarget._data, e);\n                            };\n                        }\n                        dom._data = nextValue.data;\n                    } else {\n                        if (process.env.NODE_ENV !== 'production') {\n                            throwError(`an event on a VNode \"${ name }\". was not a function or a valid linkEvent.`);\n                        }\n                        throwError();\n                    }\n                } else {\n                    dom[nameLowerCase] = nextValue;\n                }\n            }\n        }\n    }\n}\nexport function patchStyle(lastAttrValue, nextAttrValue, dom) {\n    const domStyle = dom.style;\n    if (isString(nextAttrValue)) {\n        domStyle.cssText = nextAttrValue;\n        return;\n    }\n    for (let style in nextAttrValue) {\n        const value = nextAttrValue[style];\n        if (isNumber(value) && !(style in isUnitlessNumber)) {\n            domStyle[style] = value + 'px';\n        } else {\n            domStyle[style] = value;\n        }\n    }\n    if (!isNullOrUndef(lastAttrValue)) {\n        for (let style in lastAttrValue) {\n            if (isNullOrUndef(nextAttrValue[style])) {\n                domStyle[style] = '';\n            }\n        }\n    }\n}\nfunction removeProp(prop, lastValue, dom) {\n    if (prop === 'className') {\n        dom.removeAttribute('class');\n    } else if (prop === 'value') {\n        dom.value = '';\n    } else if (prop === 'style') {\n        dom.removeAttribute('style');\n    } else if (isAttrAnEvent(prop)) {\n        handleEvent(name, lastValue, null, dom);\n    } else {\n        dom.removeAttribute(prop);\n    }\n}", 
dependencies : ["~/packages/inferno-shared/dist-es","inferno-vnode-flags","../core/options","../core/VNodes","./constants","./events/delegation","./mounting","./utils","./rendering","./unmounting","./wrappers/processElement","process"], 
sourceMap : {},
headerContent : ["/* fuse:injection: */ var process = require(\"process\");"], 
mtime : 1488885249000
};