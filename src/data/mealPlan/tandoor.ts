import { Tandoor } from "@/config";
import zod from "zod";
import { MealPlan } from "./types";
import { DateTime } from "luxon";
import MealPlan from "@/app/meal-plan/page";

const TandoorMealSchema = zod.array(
  zod
    .object({
      id: zod.number(),
      title: zod.string(),
      recipe: zod.nullable(
        zod.object({
          id: zod.number(),
          name: zod.string(),
          description: zod.string(),
          image: zod.string(),
        })
      ),
      recipe_name: zod.optional(zod.string()),
      from_date: zod.string(),
      meal_type_name: zod.string(),
    })
    .passthrough()
);

type TandoorMeal = zod.infer<typeof TandoorMealSchema>;

export function isTandoorMeal(obj: unknown): obj is TandoorMeal {
  try {
    TandoorMealSchema.parse(obj);
    return true;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (e: unknown) {
    return false;
  }
}

export async function fetchMealPlan(config: Tandoor): Promise<Array<MealPlan>> {
  const start = DateTime.now().startOf("week").toISO();
  const end = DateTime.now().endOf("week").toISO();
  const params = new URLSearchParams({
    from_date: start,
    to_date: end,
  });
  const response = await fetch(
    `${config.server}/api/meal-plan?${params.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${config.api_key}`,
      },
    }
  );
  const plans = await response.json();

  if (!isTandoorMeal(plans)) {
    throw new Error("Invalid response");
  }

  const byDay = plans.reduce<Record<string, typeof plans>>((acc, plan) => {
    const day = DateTime.fromISO(plan.from_date).toISODate();
    if (!day) {
      return acc;
    }
    if (typeof acc[day] === "undefined") {
      acc[day] = [];
    }
    acc[day].push(plan);
    return acc;
  }, {});

  return Object.keys(byDay).map((day) => ({
    day: day,
    meals: byDay[day].map((plan) => ({
      meal: plan.meal_type_name,
      title: plan.recipe_name || plan.title,
      image: plan.recipe?.image,
    })),
  }));
}
