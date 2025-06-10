import React from "react";

export default function Container({
  children,
}: {
  children?: React.ReactNode;
}) {
  return <div style={{ background: "white", padding: 20 }}>{children}</div>;
}
