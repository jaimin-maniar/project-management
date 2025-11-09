import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/state/api";

type Props = {
  priority: Priority;
};

const Backlog = ({ priority }: Props) => {
  return <ReusablePriorityPage priority={Priority.Backlog} />;
};

export default Backlog;
