import { Routes, Route } from 'react-router-dom';
import App from './App';
import MovieDetail from './components/MovieDetail';

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/movie/:id" element={<MovieDetail />} />
  </Routes>
);

export default AppRoutes;
