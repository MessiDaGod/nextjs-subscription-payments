'use client';
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import cn from 'classnames';
import React, { forwardRef, useRef } from 'react';
import { mergeRefs } from 'react-merge-refs';
import LoadingDots from '@/components/ui/LoadingDots';
import styles from './Button.module.css';
var Button = forwardRef(function (props, buttonRef) {
    var _a;
    var className = props.className, _b = props.variant, variant = _b === void 0 ? 'flat' : _b, children = props.children, active = props.active, width = props.width, _c = props.loading, loading = _c === void 0 ? false : _c, _d = props.disabled, disabled = _d === void 0 ? false : _d, _e = props.style, style = _e === void 0 ? {} : _e, _f = props.Component, Component = _f === void 0 ? 'button' : _f, rest = __rest(props, ["className", "variant", "children", "active", "width", "loading", "disabled", "style", "Component"]);
    var ref = useRef(null);
    var rootClassName = cn(styles.root, (_a = {},
        _a[styles.slim] = variant === 'slim',
        _a[styles.loading] = loading,
        _a[styles.disabled] = disabled,
        _a), className);
    return (<Component aria-pressed={active} data-variant={variant} ref={mergeRefs([ref, buttonRef])} className={rootClassName} disabled={disabled} style={__assign({ width: width }, style)} {...rest}>
      {children}
      {loading && (<i className="flex pl-2 m-0">
          <LoadingDots />
        </i>)}
    </Component>);
});
export default Button;
