import { useParams } from 'react-router';
import { PROJECTS } from '../introduce/constants/projects';

function ProjectDetail() {
  const { projectId } = useParams();

  const project = PROJECTS.find(
    (p) => p.id === projectId
  );

  if (!project) {
    return <div>프로젝트를 찾을 수 없습니다.</div>;
  }

  return (
    <main>
      <h1>{project.title}</h1>

      <p>{project.description}</p>

      <div>
        {project.stack.map((stack) => (
          <span key={stack}>
            {stack}
          </span>
        ))}
      </div>
    </main>
  );
}

export default ProjectDetail;