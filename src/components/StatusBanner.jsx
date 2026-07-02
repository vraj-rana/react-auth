const StatusBanner = ({ tone = 'error', children }) => {
  if (!children) return null;
  return <div className={`status-banner status-banner--${tone}`}>{children}</div>;
};

export default StatusBanner;
