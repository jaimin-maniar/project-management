import React from "react";
import ReusablePriorityPage from "../reusablePriorityPage";
import { Priority } from "@/state/api";

type Props = {
  priority: Priority;
};

const HighPriority = ({ priority }: Props) => {
  return <ReusablePriorityPage priority={Priority.High} />;
};

export default HighPriority;
