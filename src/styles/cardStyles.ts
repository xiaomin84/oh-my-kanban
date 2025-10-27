/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

export const kanbanCardStyle = css `
  margin-bottom: 1rem;
  padding: 0.6rem 1rem;
  border: 1px solid gray;
  border-radius: 1rem;
  list-style: none;
  background-color: rgba(255, 255, 255, 0.4);
  text-align: left;
  &:hover {
    box-shadow: 0 0.2rem 0.2rem rgba(0, 0, 0, 0.2),inset 0 1px #fff;
  }
`;

export const kanbanCardTitleStyle = css `min-height: 3rem;`;

