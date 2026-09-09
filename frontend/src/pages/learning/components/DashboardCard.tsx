interface DashboardCardProps {
  label: string;
  value: string;
  description: string;
}

function DashboardCard({
  label,
  value,
  description,
}: DashboardCardProps) {
  return (
    <div className="learning-summary-card">
      <span className="learning-summary-label">
        {label}
      </span>

      <strong>{value}</strong>

      <p>{description}</p>
    </div>
  );
}

export default DashboardCard;