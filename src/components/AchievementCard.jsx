function AchievementCard({ item }) {
  return (
    <div className="achievement-card">
      <img src={item.imageUrl} alt={item.name} className="fruit-image" />

      <h3>{item.name}</h3>

      <p>{item.fruitName}</p>

      <p>{item.isAchieved ? "획득 완료" : "미획득"}</p>
    </div>
  );
}

export default AchievementCard;