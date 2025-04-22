import { Outlet, Link } from "react-router-dom";
import Header from "../Header/Header";

const RootLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Header />
      <main className="max-w-7xl mx-auto p-4 md:p-8">
        <Outlet />
      </main>
      <footer className="bg-white py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-gray-600 text-sm">
          <p>© {new Date().getFullYear()} Air Quality Dashboard. All data provided by OpenWeather API.</p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;