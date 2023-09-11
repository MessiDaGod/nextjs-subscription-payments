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
import React from 'react';
import cn from 'classnames';
import s from './Input.module.css';
var Input = function (props) {
    var className = props.className, children = props.children, onChange = props.onChange, rest = __rest(props, ["className", "children", "onChange"]);
    var rootClassName = cn(s.root, {}, className);
    var handleOnChange = function (e) {
        if (onChange) {
            onChange(e.target.value);
        }
        return null;
    };
    return (<label>
      <input className={rootClassName} onChange={handleOnChange} autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" {...rest}/>
    </label>);
};
export default Input;
