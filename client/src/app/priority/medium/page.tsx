import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/state/api";

type Props = {
  priority: Priority;
};

const MediumPriority = ({ priority }: Props) => {
  return <ReusablePriorityPage priority={Priority.Medium} />;
};

export default MediumPriority;
