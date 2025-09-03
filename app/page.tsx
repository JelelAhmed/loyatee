import { getDataPlans } from "./actions/data.actions";
import HomePage from "@/components/HomePage";

export default async function ServerHomePage() {
  // Fetch data plans server-side
  const { plans, error } = await getDataPlans();

  return <HomePage plans={plans} error={error} />;
}
