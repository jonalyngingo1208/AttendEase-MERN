
function StatCard({ title, value, icon: Icon, color, description }) {
  return (
    <div className={`stat-card ${color || ''}`}>

      <div className="stat-top">
        <div>
          <p>{title}</p>

          <h2>
            {value ?? 0}
          </h2>
        </div>

        <div className={`stat-icon ${color || ''}`}>
          {Icon && <Icon size={23} />}
        </div>
      </div>

      <span className="stat-description">
        {description}
      </span>

    </div>
  );
}

export default StatCard;
