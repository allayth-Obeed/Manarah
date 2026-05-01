import "./App.css";
import AppLayout from "./Pages/MainPage/AppLayout";
import { ThemeProvider } from "./theme/themeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/HomePage/Home";
import Employees from "./Pages/EmployeesPage/Employees";
import Preachers from "./Pages/PreachersPage/Preachers";
import Mosque from "./Pages/MosquesPage/Mosque";

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/preachers" element={<Preachers/>}/>
            <Route path="/mosques" element={<Mosque/>}/>
          </Routes>
        </AppLayout>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
