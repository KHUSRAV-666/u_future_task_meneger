import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskList from "./pages/task_list";
import AddTask from "./pages/task_edit_modal";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<TaskList />} />
      </Routes>
    </Router>
  );
};

export default App;

// import TaskList from './pages/task_list'

// function App() {

//   return (
//     <div className='container'>
//       <h1>Менеджер Задач</h1>
//       <TaskList />
//     </div>
//   )
// }

// export default App
