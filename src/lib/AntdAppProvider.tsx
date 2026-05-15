"use client";

import { App } from "antd";
import type { ReactNode } from "react";

/**
 * Wraps the tree with Ant Design's <App> component so that static utilities
 * like message.error() can consume the dynamic theme context.
 * Must be a client component because App uses React context internally.
 */
export default function AntdAppProvider({ children }: { children: ReactNode }) {
  return <App>{children}</App>;
}
