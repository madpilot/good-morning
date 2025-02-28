import { readConfig } from "@/config";
import { fetchMealPlan } from "@/data/mealPlan";
import { DateTime } from "luxon";
import { Metadata } from "next";
import { MealPlanTable } from "@/components/meal-plan/MealPlan";

export default async function MealPlan(): Promise<React.ReactElement> {
  const config = await readConfig();
  const mealPlan = await fetchMealPlan(config.meal_plan);
  if (typeof mealPlan === "undefined") {
    return <></>;
  }

  return (
    <section>
      <MealPlanTable config={config} mealPlan={mealPlan} />
      {mealPlan
        .sort((x, y) => x.day.localeCompare(y.day))
        .map((plan) => (
          <div key={`meal-plan-${plan.day}`}>
            <h2>{DateTime.fromISO(plan.day).toFormat("EEE dd")}</h2>
            <ul>
              {plan.meals.map((meal) => (
                <li key={meal.title}>
                  {meal.meal}: {meal.title}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </section>
  );
}

export const metadata: Metadata = {
  title: "Meal Plan - Good Morning!",
};
