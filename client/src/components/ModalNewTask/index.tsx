import Modal from "@/components/Modal";
import { Priority, Status, useCreateTaskMutation } from "@/state/api";
import { useState } from "react";
import { formatISO } from "date-fns";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  id?: string | null;
};

const ModalNewTask = ({ isOpen, onClose, id = null }: Props) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();
  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<Status>(Status.ToDo);
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>(Priority.Backlog);
  const [tags, setTags] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [authorUserId, setAuthorUserId] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [projectId, setProjectId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const handleSubmit = async () => {
    const hasProject = id != null || projectId.trim() !== "";
    if (!title.trim() || !authorUserId.trim() || !hasProject) return;

    const formattedStartDate = startDate
      ? formatISO(new Date(startDate), { representation: "complete" })
      : null;
    const formattedDueDate = dueDate
      ? formatISO(new Date(dueDate), { representation: "complete" })
      : null;

    try {
      const task = await createTask({
        projectId: id != null ? Number(id) : Number(projectId),
        title,
        description,
        status,
        priority,
        tags,
        startDate: formattedStartDate ?? undefined,
        dueDate: formattedDueDate ?? undefined,
        authorUserId: parseInt(authorUserId, 10),
        assignedUserId: parseInt(assignedUserId || "0", 10) || undefined,
      });

      if (task) {
        setSuccessMessage("✅ Task created successfully!");
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
        setErrorMessage("");
      }
    } catch (err) {
      setErrorMessage("❌ Failed to create task");
      setSuccessMessage("");
      console.error(err);
    }
  };
  const isFormValid = () => {
    const hasProject = id != null || projectId.trim() !== "";
    return Boolean(title.trim() && authorUserId.trim() && hasProject);
  };

  const inputStyles =
    "w-full rounded border border-gray-300 p-2 shadow-sm dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  const selectStyles =
    "mb-4 block w-full rounded border border-gray-300 px-3 py-2 dark:border-dark-tertiary dark:bg-dark-tertiary dark:text-white dark:focus:outline-none";

  return (
    <Modal isOpen={isOpen} onClose={onClose} name="Create New Task">
      <form
        className="mt-4 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
      >
        <input
          type="text"
          className={inputStyles}
          value={title}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className={inputStyles}
          value={description}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <select
            className={selectStyles}
            value={status}
            onChange={(e) => setStatus(e.target.value as Status)}
          >
            <option value="">Select Status</option>
            {(Object.values(Status) as string[]).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
          <select
            className={selectStyles}
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="">Select Priority</option>
            {(Object.values(Priority) as string[]).map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </div>
        <input
          type="text"
          className={inputStyles}
          value={tags}
          placeholder="Tags (comma seperated)"
          onChange={(e) => setTags(e.target.value)}
        />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-2">
          <input
            type="date"
            className={inputStyles}
            value={startDate}
            placeholder="Start Date"
            onChange={(e) => setStartDate(e.target.value)}
          />
          <input
            type="date"
            className={inputStyles}
            value={dueDate}
            placeholder="Due Date"
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <input
          type="text"
          className={inputStyles}
          value={authorUserId}
          placeholder="Author User ID"
          onChange={(e) => setAuthorUserId(e.target.value)}
        />
        <input
          type="text"
          className={inputStyles}
          value={assignedUserId}
          placeholder="Assigned User ID"
          onChange={(e) => setAssignedUserId(e.target.value)}
        />
        {id === null && (
          <input
            type="text"
            className={inputStyles}
            value={projectId}
            placeholder="Project ID"
            onChange={(e) => setProjectId(e.target.value)}
          />
        )}
        <button
          type="submit"
          className={`focus:offset-2 mt-4 flex w-full justify-center rounded-md border border-transparent bg-blue-700 px-4 py-2 text-base font-medium text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-600 focus:outline-none ${!isFormValid() || isLoading ? "cursor-not-allowed opacity-50" : ""}`}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? "Creating..." : "Create Task"}
        </button>
        {errorMessage && errorMessage}
        {successMessage && successMessage}
      </form>
    </Modal>
  );
};

export default ModalNewTask;
