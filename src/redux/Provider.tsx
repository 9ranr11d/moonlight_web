"use client";

import { store } from "./store";
import { Provider as _Provider } from "react-redux";

/** Provider 자식 */
type IProvider = {
  children: React.ReactNode;
};

/** Redux Provider */
export default function Provider({ children }: IProvider) {
  return <_Provider store={store}>{children}</_Provider>;
}
