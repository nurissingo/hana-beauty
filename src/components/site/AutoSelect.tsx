"use client";

import type { ComponentProps } from "react";

export function AutoSelect(props: ComponentProps<"select">) {
  return <select {...props} onChange={(e) => e.currentTarget.form?.requestSubmit()} />;
}
