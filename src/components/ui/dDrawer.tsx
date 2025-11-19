// dDrawer.tsx
import * as React from "react";

export function Drawer({ children }: { children: React.ReactNode }) {
  return <div className="drawer">{children}</div>;
}

export function DrawerContent({ children }: { children: React.ReactNode }) {
  return <div className="drawer-content">{children}</div>;
}

export function DrawerHeader({ children }: { children: React.ReactNode }) {
  return <div className="drawer-header">{children}</div>;
}

export function DrawerTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="drawer-title">{children}</h2>;
}

export function DrawerDescription({ children }: { children: React.ReactNode }) {
  return <p className="drawer-description">{children}</p>;
}

export function DrawerFooter({ children }: { children: React.ReactNode }) {
  return <div className="drawer-footer">{children}</div>;
}

export function DrawerClose({ onClick }: { onClick?: () => void }) {
  return (
    <button className="drawer-close" onClick={onClick}>
      Close
    </button>
  );
}
