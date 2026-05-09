import { COLOR } from "@/constant/Colors";
import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  // allow callers to control the minus (indeterminate) icon size in px
  indeterminateWidth?: number;
  indeterminateHeight?: number;
  style?: React.CSSProperties;
  className?: string;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, indeterminate, indeterminateWidth = 12, indeterminateHeight = 2, style, className }) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  React.useEffect(() => {
    if (inputRef.current) {
      // Set native input indeterminate state for accessibility and proper browser rendering
      inputRef.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);
  return (
    <label style={{ display: "inline-block", cursor: "pointer" }}>
      <input
        ref={inputRef}
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ display: "none" }}
      />
      <span
        className={className}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: style?.width ?? 20,
          height: style?.height ?? 20,
          borderRadius: style?.borderRadius ?? 4,
          background: (checked || indeterminate) ? COLOR.primaryDarkBlue : '#fff',
          border: `1.5px solid ${(checked || indeterminate) ? COLOR.primaryDarkBlue : 'var(--color-grey)'}`,
          position: style?.position ?? "relative",
          top: style?.top ?? 2.5,
          left: style?.left ?? 2.5,
          transform: style?.transform ?? "rotate(0deg)",
          opacity: style?.opacity ?? 1,
          accentColor: style?.accentColor ?? COLOR.primaryDarkBlue,
          transition: "background 0.2s, border 0.2s",
          ...style,
        }}
      >
        {checked && (
          <svg width="18" height="14" viewBox="0 0 20 20" fill="none" style={{ position: "absolute" }}>
            <path
              d="M5 10.5L9 14.5L15 7.5"
              stroke="#fff"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}

        {!checked && !!indeterminate && (
          <svg
            width="8px"
            height={indeterminateHeight}
            viewBox={`0 0 ${indeterminateWidth} ${indeterminateHeight}`}
            fill="none"
            style={{ position: "absolute" }}
          >
            <rect width="17px" height="17px" rx={Math.max(1, indeterminateHeight / 2)} fill="#fff" />
          </svg>
        )}
      </span>
    </label>
  );
};

export default CustomCheckbox;
