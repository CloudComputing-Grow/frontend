import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import './App.css'
import Login from './pages/Login'
import Register from './pages/Register'
import RegisterSuccess from './pages/RegisterSuccess';
import MyPage from './pages/MyPage';
import ChangeEmail from './pages/ChangeEmail';
import ChangePassword from './pages/ChangePassword';
import Home from './pages/Home'
import Collection from './pages/Collection'
import Inventory from './pages/Inventory'
import Market from './pages/Market'
import MissionDashboard from './components/MissionDashboard';
import MissionDetail from './components/MissionDetail';
import AdminCertManager from './components/AdminCertManager';
import LastComplete from './components/LastComplete';
import DiaryWrite from './pages/DiaryWrite'
import DiaryList from './pages/DiaryList'
import DiaryDetail from './pages/DiaryDetail'
import AchievementPage from './pages/AchievementPage'
import Community from './pages/Community'
import PostDetail from './pages/PostDetail'
import PostWrite from './pages/PostWrite'
import Scrap from './pages/Scrap'


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 인증 */}
        <Route path="/" element={<Login />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Register />} />
        <Route path="/register-success" element={<RegisterSuccess />} />

        {/* 마이페이지 */}
        <Route path="/user/mypage" element={<MyPage />} />

        {/* 개인정보 수정 */}
        <Route path="/user/change-email" element={<ChangeEmail />} />
        <Route path="/user/change-password" element={<ChangePassword />}  />

        {/* 휘장/업적 */}
        <Route path="/achievements" element={<AchievementPage />} />
        
        <Route path="/home" element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/market" element={<Market />} />
        <Route path="/missions" element={<MissionDashboard />} />
        <Route path="/dashboard" element={<MissionDetail />} />
        <Route path="/api/v1/missions/detail" element={<MissionDetail />} />
        <Route path="/admin/certs" element={<AdminCertManager />} />
        <Route path="/api/v1/admin/certs" element={<AdminCertManager />} />
        <Route path="/last-complete" element={<LastComplete />} />
        <Route path="/dashboard/diary/:missionExecutionId" element={<DiaryWrite />} />
        <Route path="/diary" element={<DiaryList />} />
        <Route path="/diary/:diaryId" element={<DiaryDetail />} />

        {/* 커뮤니티 */}
        <Route path="/community" element={<Community />} />
        <Route path="/community/posts/:postId" element={<PostDetail />} />
        <Route path="/community/write" element={<PostWrite />} />
        <Route path="/scrap" element={<Scrap />} />
      </Routes>
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
