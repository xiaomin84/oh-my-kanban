/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";

interface KanbanColumnProps {
  children: React.ReactNode;
  bgColor: string;
  title: React.ReactNode;
  setIsDragSource?: (isSrc: boolean) => void;
  setIsDragTarget?: (isTarget: boolean) => void;
  onDropEvt?: (evt: React.DragEvent<HTMLElement>) => void;
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
  children,
  bgColor,
  title,
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDropEvt
}: KanbanColumnProps) {
 
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
          onDropEvt(evt);
        }
      }}
      onDragEnd={(evt) => {
        evt.preventDefault();
        setIsDragSource(false);
        setIsDragTarget(false);
      }}
      css={ css `${kanbanColumnStyle} background-color: ${bgColor};`}
    >
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
}
