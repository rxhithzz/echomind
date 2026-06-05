"use client";

import { AppProgressBar as ProgressBar } from "next-nprogress-bar";

export default function TopProgressBar() {
  return (
    <ProgressBar
      height="3px"
      color="#2563EB"
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
}
