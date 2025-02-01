import { Task } from "@/interfaces";
import React from "react";
import TaskStatus from "./TaskStatus";
import DeleteTask from "./DeleteTask";
import TaskTitle from "./TaskTitle";
import TaskDescription from "./TaskDescription";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ITaskListProps {
  tasks: Task[];
  translations: { deleteTask: string };
  onDeleteTask?: (taskId: string) => Promise<void>;
}

const TaskList = ({ tasks, translations, onDeleteTask }: ITaskListProps) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <div
          key={task._id}
          className="
            flex 
            items-center 
            justify-between 
            bg-white 
            dark:bg-gray-800 
            p-4 
            rounded-lg 
            shadow-sm 
            hover:shadow-md 
            transition-all 
            duration-300
            border 
            border-gray-200 
            dark:border-gray-700
          "
        >
          <div className="flex-grow pr-4">
            <Link href={`/dashboard/task/${task._id}`}>
              <TaskTitle title={task.title} />
            </Link>
            <TaskDescription description={task.description} />
          </div>
          <div className="flex flex-col items-end space-y-2">
            <TaskStatus status={task.status} />
            <DeleteTask
              onDeleteTask={onDeleteTask}
              task={task}
              translations={{ deleteTask: translations.deleteTask }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
