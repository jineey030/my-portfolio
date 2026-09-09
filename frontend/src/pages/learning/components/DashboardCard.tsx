interface DashboardCardProps {
  label: string;
  value: string;
  description: string;
  type: 'todo' | 'study-log' | 'study-days';
  progress?: number;
}

function DashboardCard({
  label,
  value,
  description,
  type,
  progress,
}: DashboardCardProps) {
  return (
    <div
      className={`learning-summary-card dashboard-card dashboard-card-${type}`}
    >
      <span className="learning-summary-label">
        {label}
      </span>

      <strong>{value}</strong>

      {progress !== undefined && (
        <div className="dashboard-progress">
          <div className="dashboard-progress-track">
            <div
              className="dashboard-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <span>{progress}%</span>
        </div>
      )}

      <p>{description}</p>
    </div>
  );
}

export default DashboardCard;
