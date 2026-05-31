import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import RegisterSuccess from './pages/RegisterSuccess';

import MyPage from './pages/MyPage';

import ChangeEmail from './pages/ChangeEmail';
import ChangePassword from './pages/ChangePassword';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 인증 */}

        <Route path="/" element={<Login />} />

        <Route path="/auth/login" element={<Login />} />

        <Route path="/auth/signup" element={<Register />} />

        <Route
          path="/register-success"
          element={<RegisterSuccess />}
        />

        {/* 마이페이지 */}

        <Route
          path="/user/mypage"
          element={<MyPage />}
        />

        {/* 개인정보 수정 */}

        <Route
          path="/user/change-email"
          element={<ChangeEmail />}
        />

        <Route
          path="/user/change-password"
          element={<ChangePassword />}
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;