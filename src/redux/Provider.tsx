"use client";

import { store } from "./store";
import { Provider as _Provider } from "react-redux";

type Props = {
  children: React.ReactNode;
};

/** Redux Provider */
export default function Provider({ children }: Props) {
  return <_Provider store={store}>{children}</_Provider>;
}
