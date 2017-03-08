'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
var inferno_shared_1 = require('~/packages/inferno-shared/dist-es');
exports.NO_OP = inferno_shared_1.NO_OP;
var VNodes_1 = require('./core/VNodes');
exports.Props = VNodes_1.Props;
exports.VNode = VNodes_1.VNode;
exports.createVNode = VNodes_1.createVNode;
exports.cloneVNode = VNodes_1.cloneVNode;
exports.InfernoInput = VNodes_1.InfernoInput;
exports.InfernoChildren = VNodes_1.InfernoChildren;
var linkEvent_1 = require('./DOM/events/linkEvent');
exports.linkEvent = linkEvent_1.default;
var options_1 = require('./core/options');
exports.options = options_1.default;
var rendering_1 = require('./DOM/rendering');
exports.render = rendering_1.render;
exports.findDOMNode = rendering_1.findDOMNode;
exports.createRenderer = rendering_1.createRenderer;
var utils_1 = require('./DOM/utils');
exports.EMPTY_OBJ = utils_1.EMPTY_OBJ;
if (process.env.NODE_ENV !== 'production') {
    var testFunc = function testFn() {
    };
    if ((testFunc.name || testFunc.toString()).indexOf('testFn') === -1) {
        inferno_shared_1.warning('It looks like you\'re using a minified copy of the development build ' + 'of Inferno. When deploying Inferno apps to production, make sure to use ' + 'the production build which skips development warnings and is faster. ' + 'See http://infernojs.org for more details.');
    }
}
exports.version = 'VERSION';
exports.default = {
    linkEvent: linkEvent_1.default,
    createVNode: VNodes_1.createVNode,
    cloneVNode: VNodes_1.cloneVNode,
    NO_OP: inferno_shared_1.NO_OP,
    EMPTY_OBJ: utils_1.EMPTY_OBJ,
    render: rendering_1.render,
    findDOMNode: rendering_1.findDOMNode,
    createRenderer: rendering_1.createRenderer,
    options: options_1.default,
    version: exports.version
};
var constants_1 = require('./DOM/constants');
exports.internal_isUnitlessNumber = constants_1.isUnitlessNumber;
var normalization_1 = require('./core/normalization');
exports.internal_normalize = normalization_1.normalize;
/* fuse:end-file "packages/inferno/src/index.js"*/