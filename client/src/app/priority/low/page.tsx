import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/state/api";

type Props = {
  priority: Priority;
};

const LowPriority = ({ priority }: Props) => {
  return <ReusablePriorityPage priority={Priority.Low} />;
};

export default LowPriority;
