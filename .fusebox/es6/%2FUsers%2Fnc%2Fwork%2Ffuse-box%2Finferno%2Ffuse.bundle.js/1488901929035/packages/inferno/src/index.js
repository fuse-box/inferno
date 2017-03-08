import {
    warning,
    NO_OP
} from '~/packages/inferno-shared/dist-es';
import {
    Props,
    VNode,
    createVNode,
    cloneVNode,
    InfernoInput,
    InfernoChildren
} from './core/VNodes';
import linkEvent from './DOM/events/linkEvent';
import options from './core/options';
import {
    render,
    findDOMNode,
    createRenderer
} from './DOM/rendering';
import { EMPTY_OBJ } from './DOM/utils';
if (process.env.NODE_ENV !== 'production') {
    var testFunc = function testFn() {
    };
    if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
        warning('It looks like you\'re using a minified copy of the development build ' + 'of Inferno. When deploying Inferno apps to production, make sure to use ' + 'the production build which skips development warnings and is faster. ' + 'See http://infernojs.org for more details.');
    }
}
export var version = 'VERSION';
export default {
    linkEvent: linkEvent,
    createVNode: createVNode,
    cloneVNode: cloneVNode,
    NO_OP: NO_OP,
    EMPTY_OBJ: EMPTY_OBJ,
    render: render,
    findDOMNode: findDOMNode,
    createRenderer: createRenderer,
    options: options,
    version: version
};
export {
    Props,
    VNode,
    InfernoChildren,
    InfernoInput,
    linkEvent,
    createVNode,
    cloneVNode,
    NO_OP,
    EMPTY_OBJ,
    render,
    findDOMNode,
    createRenderer,
    options
};
export {
    isUnitlessNumber as internal_isUnitlessNumber
} from './DOM/constants';
export {
    normalize as internal_normalize
} from './core/normalization';
/* fuse:end-file "packages/inferno/src/index.js"*/