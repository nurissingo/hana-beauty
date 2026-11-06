"use client";

import type { ComponentProps } from "react";

export function ConfirmButton({ message, ...props }: ComponentProps<"button"> & { message: string }) {
  return (
    <button
      {...props}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    />
  );
}
