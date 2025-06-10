"use client";

import { store } from "./store";
import { Provider as _Provider } from "react-redux";

/** Provider Interface */
type TProvider = {
  children: React.ReactNode;
};

/** Redux Provider */
export default function Provider({ children }: TProvider) {
  return <_Provider store={store}>{children}</_Provider>;
}
