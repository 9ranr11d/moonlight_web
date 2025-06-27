import React from "react";

interface ISection {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

interface IContainer {
  children?: React.ReactNode;
  style?: React.CSSProperties;
}

function Section({ children, style }: ISection) {
  return <div style={style}>{children}</div>;
}

export default function Container({ children, style }: IContainer) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
        background: "white",
        marginTop: 100,
        padding: 20,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

Container.Section = Section;
