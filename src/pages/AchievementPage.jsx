import { useEffect, useState } from "react";
import { getAchievements } from "../api/achievementApi";
import "../styles/AchievementPage.css";

const displayNameMap = {
  apple: "사과",
  cherry: "체리",
  grapefruit: "자몽",
  lemon: "레몬",
  mango: "망고",
  orange: "오렌지",
  peach: "복숭아",
  grape: "포도",

  gold_apple: "황금 사과",
  gold_cherry: "황금 체리",
  gold_grape: "황금 포도",
  gold_grapefruit: "황금 자몽",
  gold_lemon: "황금 레몬",
  gold_mango: "황금 망고",
  gold_orange: "황금 오렌지",
  gold_peach: "황금 복숭아",
};

const fruitMessages = [
  "이 과일은 당신이 하루를 이겨낸 증거예요.",
  "오늘도 수고했어요. 이 과일은 당신의 노력의 결과예요.",
  "작은 실천이 큰 열매를 맺었어요!",
  "포기하지 않고 하루를 살아낸 당신, 멋져요!",
  "당신의 하루가 이 과일처럼 영글었어요.",
];

function getRandomMessage() {
  return fruitMessages[Math.floor(Math.random() * fruitMessages.length)];
}

function AchievementPage() {
  const [data, setData] = useState({ items: [] });
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("NORMAL");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [message, setMessage] = useState(getRandomMessage());

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const result = await getAchievements();
        setData(result);
      } catch (error) {
        console.error("도감 조회 실패", error);
        setError(error.message);
      }
    };

    fetchAchievements();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
    setMessage(getRandomMessage());
  }, [category]);

  useEffect(() => {
    setMessage(getRandomMessage());
  }, [currentIndex]);

  if (error) {
    return (
      <div className="collection-container">
        <div
          className="collection-background"
          style={{
            backgroundImage: `url("${import.meta.env.BASE_URL}images/tree/default_0.png")`,
          }}
        />

        <div className="info-box">도감 조회 실패: {error}</div>
      </div>
    );
  }

  const items = data.items || [];

  const filteredItems = items.filter(
    (item) => item.category === category && item.isAchieved
  );

  const currentItem = filteredItems[currentIndex];

  const imageName = currentItem ? currentItem.imageUrl : "default_0.png";

  const imagePath = `${import.meta.env.BASE_URL}images/tree/${imageName}`;

  const displayName = currentItem
    ? displayNameMap[currentItem.fruitName] || currentItem.fruitName
    : category === "GOLD"
      ? "황금 과일"
      : "기본 과일";

  const handleNext = () => {
    if (currentIndex < filteredItems.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCategoryChange = (nextCategory) => {
    setCategory(nextCategory);
  };

  return (
    <div className="collection-container">
      <div
        className="collection-background"
        style={{
          backgroundImage: `url("${imagePath}")`,
        }}
      />

      <div className="category-tabs">
        <button
          type="button"
          className={category === "NORMAL" ? "active" : ""}
          onClick={() => handleCategoryChange("NORMAL")}
        >
          기본
        </button>

        <button
          type="button"
          className={category === "GOLD" ? "active" : ""}
          onClick={() => handleCategoryChange("GOLD")}
        >
          황금
        </button>

        <button
          type="button"
          disabled={!currentItem || currentIndex >= filteredItems.length - 1}
          onClick={handleNext}
        >
          ▶
        </button>
      </div>

      <div className="info-box">
        {currentItem ? (
          <>
            <div className="fruit-name">{displayName}</div>

            <div>
              {currentIndex + 1} / {filteredItems.length}
            </div>

            <div>{message}</div>
          </>
        ) : (
          <>
            <div className="fruit-name">{displayName}</div>
            <div>0 / 0</div>
            <div>아직 수확한 과일이 없어요!</div>
          </>
        )}
      </div>
    </div>
  );
}

export default AchievementPage;