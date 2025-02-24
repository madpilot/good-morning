import { Config } from "@/config";
import { fetchMealPlan as tandoorMealPlan } from "./mealPlan/tandoor";
import { MealPlan } from "./mealPlan/types";

export async function fetchMealPlan(
  config: Config["meal_plan"]
): Promise<Array<MealPlan> | undefined> {
  if (config?.type === "tandoor") {
    return tandoorMealPlan(config);
  }
  return Promise.resolve(undefined);
}
