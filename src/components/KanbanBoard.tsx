/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { useState } from "react";
import KanbanColumn from "./KanbanColumn";
import type { KanbanCardProps } from "./KanbanCard";

const COLUMN_BACKGROUND_COLOR = {
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
  loading: "#E3E3E3",
};

export const COLUMN_KEY_TODO = 'todo';
export const COLUMN_KEY_ONGOING = 'ongoing';
export const COLUMN_KEY_DONE = 'done';

interface KanbanBoardProps {
  isLoading: boolean;
  todoList: KanbanCardProps[];
  ongoingList: KanbanCardProps[];
  doneList: KanbanCardProps[];
  onAddCard: (columnKey: string, item: KanbanCardProps) => void;
  onRemoveCard: (columnKey: string, item: KanbanCardProps) => void;
}

const kanbanBoardStyle = css`
  flex: 10;
  display: flex;
  flex-direction: row;
  gap: 1rem;
  margin: 0 1rem 1rem;
`;

export default function KanbanBoard({
  isLoading,
  todoList,
  ongoingList,
  doneList,
  onAddCard,
  onRemoveCard
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<KanbanCardProps | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  const handleDrop = () => {
    if (!draggedItem || !dragSource || !dragTarget || dragSource === dragTarget) {
      return;
    }
    // 从源列表移除卡片
    onRemoveCard(dragSource, draggedItem);
    // 添加到目标列表
    onAddCard(dragTarget, draggedItem);
  };

  return (
    <main css={kanbanBoardStyle}>
      {isLoading ? (
        <KanbanColumn bgColor={COLUMN_BACKGROUND_COLOR.loading} title="加载中" canAddNew={false}>
          <></>
        </KanbanColumn>
      ) : (
        <>
          <KanbanColumn
            bgColor={COLUMN_BACKGROUND_COLOR.todo}
            title="待处理"
            cardList={todoList}
            canAddNew={true}
            setDraggedItem={setDraggedItem}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_TODO : null)}
            onDropEvt={handleDrop}
            onAddCard={(newCard) => onAddCard(COLUMN_KEY_TODO, newCard)}
            onRemoveCard={(item) => onRemoveCard(COLUMN_KEY_TODO, item)}
          />
          <KanbanColumn
            bgColor={COLUMN_BACKGROUND_COLOR.ongoing}
            title="进行中"
            cardList={ongoingList}
            canAddNew={false}
            setDraggedItem={setDraggedItem}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_ONGOING : null)}
            onDropEvt={handleDrop}
            onRemoveCard={(item) => onRemoveCard(COLUMN_KEY_ONGOING, item)}
          />
          <KanbanColumn
            bgColor={COLUMN_BACKGROUND_COLOR.done}
            title="已完成"
            cardList={doneList}
            canAddNew={false}
            setDraggedItem={setDraggedItem}
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_DONE : null)}
            onDropEvt={handleDrop}
            onRemoveCard={(item) => onRemoveCard(COLUMN_KEY_DONE, item)}
            />
        </>
      )}
    </main>
  );
}
