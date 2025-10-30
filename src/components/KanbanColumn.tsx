/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import KanbanCard from "./KanbanCard";
import KanbanNewCard from "./KanbanNewCard";

interface KanbanCardData {
  title: string;
  status: string;
}

interface KanbanColumnProps {
  children?: React.ReactNode;
  bgColor: string;
  title: React.ReactNode;
  cardList?: KanbanCardData[];
  canAddNew: boolean;
  setDraggedItem?: (item: KanbanCardData) => void;
  setIsDragSource?: (isSrc: boolean) => void;
  setIsDragTarget?: (isTarget: boolean) => void;
  onDropEvt?: () => void;
  onAddCard?: (newCard:KanbanCardData) => void;
  onRemoveCard?: (item: KanbanCardData) => void;
}

const kanbanColumnStyle = `
flex: 1;
border: 1px solid gray;
border-radius: 1rem;
display: flex;
flex-direction: column;


& > h2 {
  margin: 0.6rem 1rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid gray;

  & > button {
    float: right;
    margin-top: 0.2rem;
    padding: 0.2rem 2rem;
    border: 0;
    border-radius: 1rem;
    height: 1.8rem;
    line-height: 1rem;
    font-size: 1rem;
  }
}

& > ul {
  flex: 1;
  flex-basis: 0;
  margin: 1rem;
  padding: 0;
  overflow: auto;
}
`;

export default function KanbanColumn({
  bgColor,
  title,
  cardList = [],
  canAddNew = false,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  setDraggedItem,
  onDropEvt,
  onAddCard,
  onRemoveCard,
}: KanbanColumnProps) {
  const [showAdd, setShowAdd] = useState(false);

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleSubmit = (newCard: KanbanCardData) => {
    if (onAddCard) {
      onAddCard(newCard);
    }
    setShowAdd(false);
  };
 
  return (
    <section
      onDragStart={() => {
        setIsDragSource(true);
      }}
      onDragOver={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "move";
        setIsDragTarget(true);
      }}
      onDragLeave={(evt) => {
        evt.preventDefault();
        evt.dataTransfer.dropEffect = "none";
        setIsDragTarget(false);
      }}
      onDrop={(evt) => {
        console.log('onDrop triggered');
        evt.preventDefault();
        if (onDropEvt) {
          onDropEvt();
        }
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={ css `${kanbanColumnStyle} background-color: ${bgColor};`}
    >
      <h2>
        {title}
        {canAddNew && (
          <button onClick={handleAdd} disabled={showAdd}>
            &#8853; 添加新卡片
          </button>
        )}
      </h2>
      <ul>
        {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
        {cardList.map((card, index) => (
          <KanbanCard key={`${card.title}-${index}`} {...card} onDragStart={() => setDraggedItem && setDraggedItem(card)} onRemove={onRemoveCard} />
        ))}
      </ul>
    </section>
  );
}
