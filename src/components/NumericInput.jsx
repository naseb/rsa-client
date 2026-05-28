/**
 * NumericInput.jsx — Reusable Number Input Component
 * ====================================================
 * Used for ages, dollar amounts, percentages, etc.
 * Supports optional prefix ($) and suffix (%) display.
 * Only commits the value on blur or Enter (not on every keystroke).
 */

import { useState, useEffect, useRef } from "react";
import { FONT_MONO, C } from "../utils/theme";

export default function NumericInput({
  value,
  onChange,
  prefix,
  suffix,
  width = 80,
  step = 1,
  style = {},
  ...rest
}) {
  const [text, setText] = useState(String(value ?? ""));
  const inputRef = useRef(null);

  // Sync external value changes (but not while user is typing)
  useEffect(() => {
    if (document.activeElement !== inputRef.current) {
      setText(String(value ?? ""));
    }
  }, [value]);

  const commit = () => {
    const num = parseFloat(text);
    if (isNaN(num)) {
      onChange(null);
      setText("");
    } else {
      onChange(num);
    }
  };

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      {prefix && (
        <span style={{ fontSize: 12, color: C.gray }}>{prefix}</span>
      )}
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Enter" && e.target.blur()}
        onFocus={(e) => (e.target.style.borderColor = C.accent)}
        style={{
          fontFamily: FONT_MONO,
          fontSize: 12,
          textAlign: "right",
          padding: "6px 8px",
          border: `1px solid ${C.border}`,
          borderRadius: 6,
          width,
          background: "#fff",
          outline: "none",
          ...style,
        }}
        {...rest}
      />
      {suffix && (
        <span style={{ fontSize: 12, color: C.gray }}>{suffix}</span>
      )}
    </div>
  );
}
