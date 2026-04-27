import "./App.css";
import AppLayout from "./Pages/MainPage/AppLayout";
import { ThemeProvider } from "./theme/themeProvider";

function App() {
  return (
    <ThemeProvider>
      <AppLayout>
        <div style={{ padding: "1rem" }}>
          <h1 style={{ marginTop: 0 , fontSize: "1.5rem" }}>ادارة المساجد</h1>
          <p>links</p>
        </div>
      </AppLayout>
    </ThemeProvider>
  );
}

export default App;
