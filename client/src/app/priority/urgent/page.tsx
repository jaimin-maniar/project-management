import { Priority } from "@/state/api";
import ReusablePriorityPage from "../reusablePriorityPage";

type Props = {};

const UrgentTasks = (props: Props) => {
  return <ReusablePriorityPage priority={Priority.Urgent} />;
};

export default UrgentTasks;
