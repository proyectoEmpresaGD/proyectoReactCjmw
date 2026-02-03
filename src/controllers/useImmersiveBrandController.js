// src/controllers/useImmersiveBrandController.js
import { useMemo } from "react";
import { immersiveBrandPages } from "../models/immersiveBrandModel";

export function useImmersiveBrandController(brandKey) {
  return useMemo(() => immersiveBrandPages[brandKey] ?? null, [brandKey]);
}
