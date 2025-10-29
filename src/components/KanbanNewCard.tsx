/** @jsxImportSource @emotion/react */
import { useState, useEffect, useRef } from "react";
import { css } from "@emotion/react";
import { kanbanCardStyle, kanbanCardTitleStyle } from "../styles/cardStyles";
import type { KanbanCardProps } from "./KanbanCard";

interface KanbanNewCardProps {
  onSubmit: (newCard: KanbanCardProps) => void;
}

export default function KanbanNewCard({ onSubmit }: KanbanNewCardProps) {
  const [title, setTitle] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  const handleKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === "Enter") {
      const newCard = { title, status: new Date().toISOString() };
      onSubmit(newCard);
    }
  };

  return (
    <li css={kanbanCardStyle}>
      <h3>添加新卡片</h3>
      <div
        css={[
          kanbanCardTitleStyle,
          css`
            & >input[type="text"] {
              width: 80%;
            }
          `]
        }
      >
        <input
          type="text"
          value={title}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          ref={inputRef}
          />
      </div>
    </li>
  );
}

