import getCurrentUser from "@/api/getCurrentUser";
import getTasks from "@/api/getTasks";
import Dashboard from "@/components/Dashboard";
import { TaskFilterOptions } from "@/services/taskService";

interface IDashboardPageProps {
  searchParams: TaskFilterOptions;
}

export default async function DashboardPage({
  searchParams,
}: IDashboardPageProps) {
  const tasks = await getTasks(searchParams);
  const user = await getCurrentUser();

  return <Dashboard tasks={tasks} user={user} params={searchParams} />;
}
