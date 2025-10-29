/** @jsxImportSource @emotion/react */
import reactLogo from "./assets/react.svg";
import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import KanbanBoard, { COLUMN_KEY_TODO, COLUMN_KEY_ONGOING, COLUMN_KEY_DONE } from "./components/KanbanBoard";
import type { KanbanCardProps } from "./components/KanbanCard";

const DATA_STORE_KEY = 'kanban-data-store';


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




function App() {
  const [todoList, setTodoList] = useState(initialTodoList);
  const [ongoingList, setOngoingList] = useState(initialOngoingList);
  const [doneList, setDoneList] = useState(initialDoneList);
  const [loading, setLoading] = useState(true);
 
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

  const handleAddCardToColumn = (columnKey: string, item: KanbanCardProps) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<KanbanCardProps[]>>> = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };

    if (setters[columnKey]) {
      setters[columnKey]((prev) => {
        // 检查是否已经包含，避免重复添加
        if (prev.some((existingItem) => existingItem === item)) {
          return prev;
        }
        return [item, ...prev];
      });
    }
  };

  const handleRemoveCardFromColumn = (columnKey: string, item: KanbanCardProps) => {
    const setters: Record<string, React.Dispatch<React.SetStateAction<KanbanCardProps[]>>> = {
      [COLUMN_KEY_TODO]: setTodoList,
      [COLUMN_KEY_ONGOING]: setOngoingList,
      [COLUMN_KEY_DONE]: setDoneList,
    };

    if (setters[columnKey]) {
      setters[columnKey]((prev) => prev.filter((existingItem) => existingItem !== item));
    }
  };

  return (
    <>
      <div className="App">
        <header className="App-header">
          <button onClick={handleSaveAll}>保存所有卡片状态</button>
          <h1>我的看板 </h1>
          <img src={reactLogo} className="App-logo" alt="logo" />
        </header>
        <KanbanBoard
          isLoading={loading}
          todoList={todoList}
          ongoingList={ongoingList}
          doneList={doneList}
          onAddCard={handleAddCardToColumn}
          onRemoveCard={handleRemoveCardFromColumn}
        />
      </div>
    </>
  );
}

export default App;
