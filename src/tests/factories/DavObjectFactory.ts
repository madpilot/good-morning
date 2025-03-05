import { Factory } from "fishery";
import { DAVObject } from "tsdav";
import { faker } from "@faker-js/faker";
import { ICSFactory } from "./ICSFactory";

export const DavObjectFactory = Factory.define<DAVObject>(() => ({
  url: faker.internet.url(),
  data: ICSFactory.build(),
}));
