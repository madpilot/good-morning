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

const UsersSchema = zod.object({
  name: zod.string(),
  color: zod.optional(zod.string()),
  nicknames: zod.optional(zod.array(zod.string())),
});

const ConfigSchema = zod.object({
  title: zod.string(),
  accounts: zod.array(iCloudAccountSchema),
  users: zod.array(UsersSchema),
});

export type Config = zod.infer<typeof ConfigSchema>;

export type iCloudAccountConfig = zod.infer<typeof iCloudAccountSchema>;
export type UsersSchema = zod.infer<typeof UsersSchema>;

export async function readConfig(): Promise<Config> {
  const data = await readFile("./config.yaml", { encoding: "utf-8" });
  const parsed = parse(data);
  return ConfigSchema.parse(parsed);
}
