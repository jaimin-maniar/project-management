import Header from "@/components/Header";
import TaskCard from "@/components/TaskCard/TaskCard";
import { useGetTasksQuery } from "@/state/api";
import { Task } from "@/state/api";

type Props = {
  id: string;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};

const ListView = ({ id, setIsModalNewTaskOpen }: Props) => {
  const {
    data: tasks,
    error,
    isLoading,
  } = useGetTasksQuery({ projectId: Number(id) });
  if (error) return <div>Error occured while fetching tasks</div>;
  if (isLoading) return <div>Loading...</div>;
  return (
    <div className="xl:ppx-8 px-4 pb-8">
      <div className="pt-5">
        <Header
          name="List"
          buttonComponent={
            <button
              className="item-center flex rounded bg-blue-600 px-3 py-2 text-white hover:bg-blue-600"
              onClick={() => setIsModalNewTaskOpen(true)}
            >
              Add Task
            </button>
          }
          isSmallText
        />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
        {tasks?.map((task: Task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default ListView;
