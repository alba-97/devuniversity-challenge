import getTasks from "@/api/getTasks";
import Dashboard from "@/components/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { TaskFilterOptions } from "@/services/taskService";

interface IDashboardPageProps {
  searchParams?: TaskFilterOptions;
}

export default async function DashboardPage({
  searchParams = {},
}: IDashboardPageProps) {
  const tasks = await getTasks(searchParams);

  return (
    <ProtectedRoute>
      <Dashboard tasks={tasks} params={searchParams} />
    </ProtectedRoute>
  );
}
