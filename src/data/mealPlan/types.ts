export type MealPlan = {
  day: string;
  meals: Array<{
    meal: string;
    title: string;
    image: string | unknown;
  }>;
};
