/* */ 
"format cjs";
"use strict";

exports.__esModule = true;

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj["default"] = obj; return newObj; } }

var _types = require("../../../types");

var t = _interopRequireWildcard(_types);

function buildAssert(node, file) {
  return t.callExpression(file.addHelper("temporal-assert-defined"), [node, t.literal(node.name), file.addHelper("temporal-undefined")]);
}

function references(node, scope, state) {
  var declared = state.letRefs[node.name];
  if (!declared) return false;

  // declared node is different in this scope
  return scope.getBindingIdentifier(node.name) === declared;
}

var visitor = {
  ReferencedIdentifier: function ReferencedIdentifier(node, parent, scope, state) {
    if (t.isFor(parent) && parent.left === node) return;

    if (!references(node, scope, state)) return;

    var assert = buildAssert(node, state.file);

    this.skip();

    if (t.isUpdateExpression(parent)) {
      if (parent._ignoreBlockScopingTDZ) return;
      this.parentPath.replaceWith(t.sequenceExpression([assert, parent]));
    } else {
      return t.logicalExpression("&&", assert, node);
    }
  },

  AssignmentExpression: {
    exit: function exit(node, parent, scope, state) {
      if (node._ignoreBlockScopingTDZ) return;

      var nodes = [];
      var ids = this.getBindingIdentifiers();

      for (var name in ids) {
        var id = ids[name];

        if (references(id, scope, state)) {
          nodes.push(buildAssert(id, state.file));
        }
      }

      if (nodes.length) {
        node._ignoreBlockScopingTDZ = true;
        nodes.push(node);
        return nodes.map(t.expressionStatement);
      }
    }
  }
};

var metadata = {
  optional: true,
  group: "builtin-advanced"
};

exports.metadata = metadata;
var BlockStatement = {
  exit: function exit(node, parent, scope, file) {
    var letRefs = node._letReferences;
    if (!letRefs) return;

    this.traverse(visitor, {
      letRefs: letRefs,
      file: file
    });
  }
};

exports.BlockStatement = BlockStatement;
exports.Program = BlockStatement;
exports.Loop = BlockStatement;