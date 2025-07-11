import { useEffect, useState, useCallback, useMemo } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);

  // Trie les événements par date décroissante et ajoute un id s'il manque
  const byDateDesc = useMemo(
    () =>
      data?.focus
        ? [...data.focus]
            .map((event, i) => ({ ...event, id: event.id || `event-${i}` }))
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        : [],
    [data]
  );

  const nextCard = useCallback(() => {
    if (byDateDesc.length > 0) {
      setIndex((prevIndex) =>
        prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
      );
    }
  }, [byDateDesc]);

  useEffect(() => {
    if (byDateDesc.length > 0) {
      const timer = setTimeout(nextCard, 5000);
      return () => clearTimeout(timer);
    }
    return undefined; // évite le warning ESLint "consistent-return"
  }, [index, byDateDesc, nextCard]);

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.id}
          className={`SlideCard SlideCard--${index === idx ? "display" : "hide"}`}
        >
          <img src={event.cover} alt={event.title} />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}

      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={`radio-${event.id}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => setIndex(radioIdx)}
              aria-label={`Go to slide ${radioIdx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
