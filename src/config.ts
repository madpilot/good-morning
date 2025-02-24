"use server";

import zod from "zod";
import { readFile } from "fs/promises";
import { parse } from "yaml";

const iCloudAccountSchema = zod.object({
  type: zod.enum(["icloud"]),
  username: zod.string(),
  password: zod.string(),
  calendars: zod.array(zod.string()),
});

const TandoorSchema = zod.object({
  type: zod.enum(["tandoor"]),
  server: zod.string(),
  api_key: zod.string(),
});

const UsersSchema = zod.object({
  name: zod.string(),
  color: zod.optional(zod.string()),
  nicknames: zod.optional(zod.array(zod.string())),
});

const GoodnightSchema = zod.object({
  images: zod.array(zod.string()),
  background_color: zod.string(),
  speed: zod.number(),
  transition_speed: zod.optional(zod.number()),
  start: zod.string(),
  end: zod.string(),
});

const ConfigSchema = zod.object({
  title: zod.string(),
  accounts: zod.array(iCloudAccountSchema),
  users: zod.array(UsersSchema),
  goodnight: zod.optional(GoodnightSchema),
  meal_plan: zod.optional(TandoorSchema),
});

export type Config = zod.infer<typeof ConfigSchema>;

export type iCloudAccountConfig = zod.infer<typeof iCloudAccountSchema>;
export type GoodnightConfig = zod.infer<typeof GoodnightSchema>;
export type Users = zod.infer<typeof UsersSchema>;
export type Tandoor = zod.infer<typeof TandoorSchema>;

export async function readConfig(): Promise<Config> {
  const data = await readFile("./config.yaml", { encoding: "utf-8" });
  const parsed = parse(data);
  return ConfigSchema.parse(parsed);
}
