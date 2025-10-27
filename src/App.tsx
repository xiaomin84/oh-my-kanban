/** @jsxImportSource @emotion/react */
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useState } from "react";
import { css } from "@emotion/react";
import { useEffect, useRef } from "react";

const DATA_STORE_KEY = 'kanban-data-store';
const COLUMN_KEY_TODO = 'todo';
const COLUMN_KEY_ONGOING = 'ongoing';
const COLUMN_KEY_DONE = 'done';

const COLUMN_BACKGROUND_COLOR = {
  todo: "#C9AF97",
  ongoing: "#FFE799",
  done: "#C0E8BA",
  loading: "#E3E3E3",
};

const kanbanCardStyle = css `
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

const kanbanCardTitleStyle = css `min-height: 3rem;`;

const initialTodoList = [
  { title: "开发任务-1", status: "2025-10-19 22:45" },
  { title: "开发任务-3", status: "2025-10-19 20:45" },
  { title: "开发任务-5", status: "2025-10-18 23:45" },
  { title: "开发任务-1", status: "2025-10-19 22:45" },
  { title: "开发任务-3", status: "2025-10-19 22:45" },
  { title: "开发任务-5", status: "2025-10-19 22:45" },
  { title: "测试任务-3", status: "2025-10-19 22:45" },
];

const initialOngoingList = [
  { title: "开发任务-4", status: "22-05-22 18:15" },
  { title: "开发任务-6", status: "22-05-22 18:15" },
  { title: "测试任务-2", status: "22-05-22 18:15" },
];

const initialDoneList = [
  { title: "开发任务-2", status: "22-05-22 18:15" },
  { title: "测试任务-1", status: "22-05-22 18:15" },
];

const KanbanBoard = ({ children }: { children: React.ReactNode }) => (
  <main
    css={css `
      flex: 10;
      display: flex;
      flex-direction: row;
      gap: 1rem;
      margin: 0 1rem 1rem;
    `}
  >
    {children}
  </main>
);

const KanbanColumn = ({
  children,
  bgColor,
  title, 
  setIsDragSource = () => {},
  setIsDragTarget = () => {},
  onDropEvt
}: {
  children: React.ReactNode;
  bgColor: string;
  title: React.ReactNode;
  setIsDragSource?: (isSrc: boolean) => void;
  setIsDragTarget?: (isTarget: boolean) => void;
  onDropEvt?: (evt: React.DragEvent<HTMLElement>) => void;
}) => {
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

      css={css`
        flex: 1;
        border: 1px solid gray;
        border-radius: 1rem;
        display: flex;
        flex-direction: column;
        background-color: ${bgColor};

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
      `}
    >
      <h2>{title}</h2>
      <ul>{children}</ul>
    </section>
  );
};

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const UPDATE_INTERVAL = MINUTE;

const KanbanCard = ({ title, status, onDragStart = () => {} }: { title: string; status: string; onDragStart?: (evt: React.DragEvent<HTMLLIElement>) => void }) => {
  const [displayTime, setDisplayTime] = useState(status);
  useEffect(() => {
    const updateDisplayTime = () => {
      const timePassed = new Date().getTime() - new Date(status).getTime( );
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
      <div css={css `text-align: right; font-size: 0.8rem; color: #333;`}>{displayTime}</div>
    </li>
  );
};

const KanbanNewCard = ({ onSubmit }: { onSubmit: (title: string) => void }) => {
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
      onSubmit(title);
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
};

function App() {
  const [showAdd, setShowAdd] = useState(false);
  const [todoList, setTodoList] = useState(initialTodoList);
  const [ongoingList, setOngoingList] = useState(initialOngoingList);
  const [doneList, setDoneList] = useState(initialDoneList);
  const [loading, setLoading] = useState(true);
  const [draggedItem, setDraggedItem] = useState<{ title: string; status: string } | null>(null);
  const [dragSource, setDragSource] = useState<string | null>(null);
  const [dragTarget, setDragTarget] = useState<string | null>(null);

  const callCountRef = useRef(0);
  const handleDrop = () => { 
    console.log('handleDrop called', { draggedItem, dragSource, dragTarget });
    console.log('handleDrop call count:', ++callCountRef.current);
    if (!draggedItem )
       { 
          console.log('Early return due to condition1');
          return; 
      }

      if (!dragSource )
      {
        console.log('Early return due to condition2');
        return;
      }

      if (!dragTarget )
      {
        console.log('Early return due to condition3');
        return;
      }

      if (dragSource === dragTarget)
      {
        console.log('Early return due to condition4');
        return;
      }

    const updaters: Record<string, React.Dispatch<React.SetStateAction<{ title: string; status: string; }[]>>> = { 
      [COLUMN_KEY_TODO]: setTodoList, 
      [COLUMN_KEY_ONGOING]: setOngoingList, 
      [COLUMN_KEY_DONE]: setDoneList 
    } 
    if (dragSource) { 
      updaters[dragSource]((currentStat) => currentStat.filter((item) => !Object.is(item, draggedItem)) ); 
    } 
    if (dragTarget) { 
      console.log('dragTarget value:', dragTarget);
      console.log('updaters keys:', Object.keys(updaters));
      console.log('updaters[dragTarget] exists:', !!updaters[dragTarget]);
      console.log('Before update - draggedItem:', draggedItem);
      updaters[dragTarget]((currentStat) => {
        console.log('Inside updater - currentStat:', currentStat);
        // 检查是否已经包含拖拽的项目，避免重复添加
        if (currentStat.some(item => Object.is(item, draggedItem))) {
          console.log('Item already exists, skipping');
          return currentStat;
        }
        const newStat = [draggedItem, ...currentStat];
        console.log('Inside updater - newStat:', newStat);
        return newStat;
      });
      console.log('After update - doneList:', doneList);
    } 
  };
 
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setTimeout(() => {
      if (data) {
        const { todoList, ongoingList, doneList } = JSON.parse(data);
        setTodoList(todoList);
        setOngoingList(ongoingList);
        setDoneList(doneList);
      }
      setLoading(false);
    }, 1000);
    
  }, []);
  const handleSaveAll = () => { 
    const data = JSON.stringify({ todoList, ongoingList, doneList }); 
    window.localStorage.setItem(DATA_STORE_KEY, data);
  };

  const handleAdd = () => {
    setShowAdd(true);
  };

  const handleSubmit = (title: string) => {
    setTodoList((prev) => [
      { title, status: new Date().toDateString() },
      ...prev,
    ]);
    setShowAdd(false);
  };
  return (
    <>
      <div className="App">
        <header className="App-header">
          <button onClick={handleSaveAll}>保存所有卡片状态</button>
          <h1>我的看板 </h1>
          <img src={reactLogo} className="App-logo" alt="logo" />
        </header>
        <KanbanBoard>
          {loading ? (<KanbanColumn bgColor={COLUMN_BACKGROUND_COLOR.loading} title="加载中"><></></KanbanColumn>) :
           ( <>
            <KanbanColumn
            bgColor={COLUMN_BACKGROUND_COLOR.todo}
            title={
              <>
                待处理
                <button onClick={handleAdd} disabled={showAdd}>
                  &#8853; 添加新卡片
                </button>
              </>
            }
            setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_TODO : null)}
            setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_TODO : null)}
            onDropEvt={handleDrop}
            >
            {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
            {todoList.map((props, index) => (
              <KanbanCard key={index} {...props} onDragStart={() => setDraggedItem(props)} />
            ))}
          </KanbanColumn>
          <KanbanColumn bgColor={COLUMN_BACKGROUND_COLOR.ongoing} title="进行中"
                      setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_ONGOING : null)}
                      setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_ONGOING : null)}
                      onDropEvt={handleDrop}>
            {ongoingList.map((props, index) => (
              <KanbanCard key={index} {...props} onDragStart={()=>setDraggedItem(props)} />
            ))}
          </KanbanColumn>
          <KanbanColumn bgColor={COLUMN_BACKGROUND_COLOR.done} title="已完成"
                      setIsDragSource={(isSrc) => setDragSource(isSrc ? COLUMN_KEY_DONE : null)}
                      setIsDragTarget={(isTarget) => setDragTarget(isTarget ? COLUMN_KEY_DONE : null)}
                      onDropEvt={handleDrop}>
            {doneList.map((props, index) => (
              <KanbanCard key={index} {...props} onDragStart={()=>setDraggedItem(props)} />
            ))}
          </KanbanColumn>
          </>)
          }
        </KanbanBoard>
      </div>
    </>
  );
}

export default App;
