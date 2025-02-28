import { Config } from "@/config";
import { MealPlan } from "@/data/mealPlan/types";
import { DateTime } from "luxon";

type MealPlanProps = {
  config: Config;
  mealPlan: Array<MealPlan>;
};

function days(mealPlans: Array<MealPlan>): Array<DateTime> {
  return mealPlans.map((plan) => DateTime.fromISO(plan.day));
}

function meals(mealPlans: Array<MealPlan>, day: DateTime): MealPlan["meals"] {
  return mealPlans
    .filter((mealPlan) => DateTime.fromISO(mealPlan.day) === day)
    .map((mealPlans) => mealPlans.meals)
    .flat();
}

export function MealPlanTable({ mealPlan }: MealPlanProps) {
  return (
    <table>
      <thead>
        <tr>
          {days(mealPlan).map((date) => (
            <th key={date.toISO()}>
              {date.toFormat("EEE")}{" "}
              <span className="fc-day-today-highlight">
                {date.toFormat("d")}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody></tbody>
    </table>
  );
}
