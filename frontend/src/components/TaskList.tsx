import { Task } from "@/interfaces";
import React from "react";
import TaskItem from "./TaskItem";

interface ITaskListProps {
  tasks: Task[];
  onDeleteTask?: (taskId: string) => Promise<void>;
  depth?: number;
}

const TaskList = ({
  tasks,
  onDeleteTask,
  depth = 0,
}: ITaskListProps & { depth?: number }) => {
  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          onDeleteTask={onDeleteTask}
          depth={depth}
        />
      ))}
    </div>
  );
};

export default TaskList;
