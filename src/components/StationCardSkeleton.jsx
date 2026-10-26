export default function StationCardSkeleton() {
  return (
    <div className="station-card" aria-hidden="true">
      <div className="skeleton skeleton-line" style={{ width: "70%", height: 18 }} />
      <div className="skeleton skeleton-line" style={{ width: "50%" }} />
      <hr className="divider" style={{ margin: "2px 0" }} />
      <div className="skeleton skeleton-line" style={{ width: "85%" }} />
    </div>
  );
}
