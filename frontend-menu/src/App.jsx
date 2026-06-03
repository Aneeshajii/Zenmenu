import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerMenu from './pages/CustomerMenu';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerMenu />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
