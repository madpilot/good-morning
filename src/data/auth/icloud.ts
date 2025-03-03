import { iCloudAccountConfig } from "@/config";
import { DAVClient, getBasicAuthHeaders } from "tsdav";

export function iCloudAuth(config: iCloudAccountConfig): DAVClient {
  return new DAVClient({
    serverUrl: "https://caldav.icloud.com",
    credentials: {
      username: config.username,
      password: config.password,
    },
    authMethod: "Custom",
    defaultAccountType: "caldav",
    authFunction: async (credentials) => {
      return {
        ...getBasicAuthHeaders(credentials),
        "accept-language": "en_AU,en;q=0.5",
      };
    },
  });
}
