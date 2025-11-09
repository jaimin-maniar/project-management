import { Task } from "@/state/api";
import { format } from "date-fns";
import Image from "next/image";

const TaskCard = ({ task }: { task: Task }) => {
  const priorityColors = {
    Urgent:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    High: "bg-yellow-100/10 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-800",
    Medium:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    Low: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800",
    Default:
      "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700",
  };

  const priorityClass =
    priorityColors[
      (task?.priority as keyof typeof priorityColors) || "Default"
    ];
  return (
    <div
      className={`group dark:bg-dark-secondary relative mb-4 overflow-hidden rounded-2xl border-2 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:text-gray-100 ${priorityClass}`}
    >
      {/* Accent bar on the left */}
      <div className="absolute top-0 left-0 h-full w-1.5 bg-linear-to-b from-current to-transparent opacity-60"></div>

      {/* Header */}
      <div className="border-b border-gray-200/50 bg-linear-to-r from-transparent via-white/30 to-transparent p-5 dark:border-gray-700/50 dark:via-gray-800/30">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="group-hover:text-opacity-80 mb-1.5 truncate text-xl font-bold tracking-tight transition-colors">
              {task?.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="rounded-md bg-gray-100 px-2 py-0.5 font-mono dark:bg-gray-800">
                #{task?.id}
              </span>
              <span className="h-1 w-1 rounded-full bg-gray-400"></span>
              <span className="font-medium tracking-wide uppercase">
                {task?.status}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center rounded-full border-2 px-4 py-1.5 text-xs font-bold tracking-wider uppercase shadow-sm`}
          >
            {task?.priority || "No Priority"}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4 p-5">
        {/* Description */}
        <div className="border-b border-gray-100 pb-3 dark:border-gray-700/50">
          <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
            {task?.description || (
              <span className="text-gray-400 italic">
                No description provided
              </span>
            )}
          </p>
        </div>

        {/* Attachments */}
        {task && task.attachments && task?.attachments?.length > 0 && (
          <div className="border-b border-gray-100 pb-3 dark:border-gray-700/50">
            <p className="mb-2.5 text-xs font-bold tracking-wider text-gray-500 uppercase dark:text-gray-400">
              Attachments ({task?.attachments?.length})
            </p>
            <div className="flex flex-wrap gap-3">
              {task.attachments?.map((attachment, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-lg border-2 border-gray-200 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md dark:border-gray-700"
                >
                  <Image
                    src={`/${attachment.fileURL}`}
                    alt={attachment.fileName}
                    width={200}
                    height={100}
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Details List */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between rounded-lg bg-gray-50/50 px-3 py-2 transition-colors hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
            <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Tags
            </dt>
            <dd className="text-right text-sm font-medium">
              {task?.tags || <span className="text-gray-400">None</span>}
            </dd>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50/50 px-3 py-2 transition-colors hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
            <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Start Date
            </dt>
            <dd className="text-right text-sm font-medium">
              {task?.startDate ? (
                format(new Date(task.startDate), "P")
              ) : (
                <span className="text-gray-400">Not set</span>
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50/50 px-3 py-2 transition-colors hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
            <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Due Date
            </dt>
            <dd className="text-right text-sm font-medium">
              {task?.dueDate ? (
                format(new Date(task.dueDate), "P")
              ) : (
                <span className="text-gray-400">Not set</span>
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50/50 px-3 py-2 transition-colors hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
            <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Author
            </dt>
            <dd className="text-right text-sm font-medium">
              {task?.author?.username || (
                <span className="text-gray-400">Unknown</span>
              )}
            </dd>
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gray-50/50 px-3 py-2 transition-colors hover:bg-gray-100/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/50">
            <dt className="text-xs font-semibold tracking-wide text-gray-500 uppercase dark:text-gray-400">
              Assignee
            </dt>
            <dd className="text-right text-sm font-medium">
              {task?.assignee?.username || (
                <span className="text-gray-400">Unassigned</span>
              )}
            </dd>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
