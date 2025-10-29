/** @jsxImportSource @emotion/react */
import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import { kanbanCardStyle, kanbanCardTitleStyle } from "../styles/cardStyles";

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

export interface KanbanCardProps {
  title: string;
  status: string;
  onDragStart?: (evt: React.DragEvent<HTMLLIElement>) => void;
}

export default function KanbanCard({ title, status, onDragStart = () => { } }: KanbanCardProps) {
    const [displayTime, setDisplayTime] = useState(status);
    useEffect(() => {
        const updateDisplayTime = () => {
            const timePassed = new Date().getTime() - new Date(status).getTime();
            let relativeTime = "刚刚";
            if (MINUTE <= timePassed && timePassed < HOUR) {
                relativeTime = `${Math.ceil(timePassed / MINUTE)} 分钟前`;
            } else if (HOUR <= timePassed && timePassed < DAY) {
                relativeTime = `${Math.ceil(timePassed / HOUR)} 小时前`;
            } else if (DAY <= timePassed) {
                relativeTime = `${Math.ceil(timePassed / DAY)} 天前`;
            }
            setDisplayTime(relativeTime);
        };
        const intervalId = setInterval(updateDisplayTime, UPDATE_INTERVAL);

        updateDisplayTime();

        return function cleanup() {
            clearInterval(intervalId);
        };
    }, [status]);

    const handleDragStart = (evt: React.DragEvent<HTMLLIElement>) => {
        evt.dataTransfer.effectAllowed = "move";
        evt.dataTransfer.setData("text/plain", title);
        if (onDragStart) {
            onDragStart(evt);
        }
    };

    return (
        <li css={kanbanCardStyle} draggable={true} onDragStart={handleDragStart}>
            <div css={kanbanCardTitleStyle}>{title}</div>
            <div css={css`text-align: right; font-size: 0.8rem; color: #333;`}>{displayTime}</div>
        </li>
    );
}

