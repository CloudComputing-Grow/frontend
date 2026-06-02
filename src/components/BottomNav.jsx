import { useNavigate, useLocation } from 'react-router-dom'

function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const hideOn = ['/login', '/register']
  if (hideOn.includes(location.pathname)) return null

  return (
    <div className="bottom-nav">
      <a onClick={() => navigate('/market')}>
        <span>🎁</span>
        <span>그로우마켓</span>
      </a>
      <a onClick={() => navigate('/home')}>
        <span>🏠</span>
        <span>홈</span>
      </a>
      <a onClick={() => navigate('/community')}>
        <span>👥</span>
        <span>커뮤니티</span>
      </a>
      <a onClick={() => navigate('/mypage')}>
        <span>👤</span>
        <span>마이페이지</span>
      </a>
    </div>
  )
}

export default BottomNav
