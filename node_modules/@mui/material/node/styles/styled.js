"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.slotShouldForwardProp = exports.rootShouldForwardProp = exports.default = void 0;
var _createStyled = _interopRequireWildcard(require("@mui/system/createStyled"));
var _defaultTheme = _interopRequireDefault(require("./defaultTheme"));
var _identifier = _interopRequireDefault(require("./identifier"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const rootShouldForwardProp = prop => (0, _createStyled.shouldForwardProp)(prop) && prop !== 'classes';
exports.rootShouldForwardProp = rootShouldForwardProp;
const slotShouldForwardProp = exports.slotShouldForwardProp = _createStyled.shouldForwardProp;
const styled = (0, _createStyled.default)({
  themeId: _identifier.default,
  defaultTheme: _defaultTheme.default,
  rootShouldForwardProp
});
var _default = exports.default = styled;