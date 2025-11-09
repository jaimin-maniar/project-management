import ProjectHeaderWrapper from "./ProjectHeaderWrapper";

type ProjectPageProps = {
  params: {
    id: string;
  };
};

const Project = async ({ params }: ProjectPageProps) => {
  const { id } = await params;

  return (
    <div>
      <ProjectHeaderWrapper id={id} />
    </div>
  );
};

export default Project;
