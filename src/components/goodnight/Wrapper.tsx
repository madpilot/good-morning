"use server";

import { readConfig } from "@/config";
import { Goodnight } from "./Goodnight";

export default async function Wrapper() {
  const config = await readConfig();
  if (!config.goodnight) {
    return <></>;
  }

  return <Goodnight config={config.goodnight} />;
}
