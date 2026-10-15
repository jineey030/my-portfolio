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
  // 계산 오류로 NaN이나 0~100 밖의 값이 들어와도 막대가 깨지지 않도록
  const safeProgress =
    progress === undefined || Number.isNaN(progress)
      ? undefined
      : Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div
      className={`learning-summary-card dashboard-card dashboard-card-${type}`}
    >
      <span className="learning-summary-label">
        {label}
      </span>

      <strong>{value}</strong>

      {safeProgress !== undefined && (
        <div className="dashboard-progress">
          <div
            className="dashboard-progress-track"
            role="progressbar"
            aria-label={`${label} 진행률`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={safeProgress}
          >
            <div
              className="dashboard-progress-bar"
              style={{ width: `${safeProgress}%` }}
            />
          </div>
        </div>
      )}

      <p>{description}</p>
    </div>
  );
}

export default DashboardCard;
