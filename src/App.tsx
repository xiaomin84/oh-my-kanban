/** @jsxImportSource @emotion/react */
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useState } from "react";
import { css } from "@emotion/react";
import { useEffect, useRef } from "react";

const DATA_STORE_KEY = 'kanban-data-store';
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
}: {
  children: React.ReactNode;
  bgColor: string;
  title: React.ReactNode;
}) => {
  return (
    <section
      css={css `
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

const KanbanCard = ({ title, status }: { title: string; status: string }) => {
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
  
  return (
    <li css={kanbanCardStyle}>
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
  useEffect(() => {
    const data = window.localStorage.getItem(DATA_STORE_KEY);
    setInterval(() => {
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

  const handleAdd = (_evt: React.MouseEvent) => {
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
            >
            {showAdd && <KanbanNewCard onSubmit={handleSubmit} />}
            {todoList.map((props, index) => (
              <KanbanCard key={index} {...props} />
            ))}
          </KanbanColumn>
          <KanbanColumn bgColor={COLUMN_BACKGROUND_COLOR.ongoing} title="进行中">
            {ongoingList.map((props, index) => (
              <KanbanCard key={index} {...props} />
            ))}
          </KanbanColumn>
          <KanbanColumn bgColor={COLUMN_BACKGROUND_COLOR.done} title="已完成">
            {doneList.map((props, index) => (
              <KanbanCard key={index} {...props} />
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
