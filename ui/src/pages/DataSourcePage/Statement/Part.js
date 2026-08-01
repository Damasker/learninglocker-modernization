// @ll-compat-audit: ok 2026-08-01
import React from 'react';

/**
 * @param {{
 *  onSetFilter: () => void;
 *  value: any;
 *  children: React.ReactNode;
 * }} props
 */
export function Part(props) {
  return (
    <span
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        props.onSetFilter();
      }} title={JSON.stringify(props.value.toJS(), null, 2)}>
      {props.children}
    </span>
  );
}
