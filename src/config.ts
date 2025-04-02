"use server";

import zod from "zod";
import { readFile } from "fs/promises";
import { parse } from "yaml";

const CalendarSchema = zod.array(
  zod.union([
    zod.string(),
    zod.object({
      slug: zod.string(),
      url: zod.string(),
      color: zod.optional(zod.string()),
      type: zod.optional(zod.enum(["birthday"])),
    }),
  ])
);

const iCloudAccountSchema = zod.object({
  type: zod.enum(["icloud"]),
  username: zod.string(),
  password: zod.string(),
  calendars: CalendarSchema,
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
});

export type Config = zod.infer<typeof ConfigSchema>;
export type CalendarConfig = zod.infer<typeof CalendarSchema>;
export type iCloudAccountConfig = zod.infer<typeof iCloudAccountSchema>;
export type UsersConfig = zod.infer<typeof UsersSchema>;
export type GoodnightConfig = zod.infer<typeof GoodnightSchema>;

export async function readConfig(): Promise<Config> {
  const data = await readFile("./config.yaml", { encoding: "utf-8" });
  const parsed = parse(data);
  return ConfigSchema.parse(parsed);
}
