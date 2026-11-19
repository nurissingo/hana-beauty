"use client";

import type { ComponentProps } from "react";
import { useFormStatus } from "react-dom";

function SelectInner(props: ComponentProps<"select">) {
  const { pending } = useFormStatus();
  return (
    <select
      {...props}
      disabled={pending || props.disabled}
      aria-busy={pending}
      className={`${props.className ?? ""}${pending ? " is-busy" : ""}`}
      onChange={(e) => {
        props.onChange?.(e);
        e.currentTarget.form?.requestSubmit();
      }}
    />
  );
}

/** Auto-submits parent form on change; shows busy state while server action runs. */
export function AutoSelect(props: ComponentProps<"select">) {
  return <SelectInner {...props} />;
}
