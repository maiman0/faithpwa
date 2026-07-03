import React, { createContext, useContext } from "react";
import {
  design as defaultDesign,
  type DesignTokens,
} from "../constants/design";

const Ctx = createContext<DesignTokens>(defaultDesign);

export function DesignProvider({ children }: { children: React.ReactNode }) {
  return <Ctx.Provider value={defaultDesign}>{children}</Ctx.Provider>;
}

export const useDesign = () => useContext(Ctx);
