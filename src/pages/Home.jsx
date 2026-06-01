import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

// 성장률에 따른 나무 이미지
const getTreeImage = (growthRate, itemTypeId) => {
  if (!itemTypeId) return null
  const step = growthRate >= 100 ? 5
    : growthRate >= 80 ? 4
    : growthRate >= 60 ? 3
    : growthRate >= 40 ? 2
    : growthRate >= 20 ? 1
    : 0
  return step === 0 ? null : `/img/tree_${step}.png`
}

function Home() {
  const [garden, setGarden] = useState(null)
  const [progress, setProgress] = useState(null)
  const [user, setUser] = useState(null)
  const [showPopup, setShowPopup] = useState(false)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    // 정원 상태 조회
    axios.get('/api/v1/growth-diary/garden', { headers })
      .then(res => {
        const data = res.data
        setGarden(data)
        if (!data.growthStatusId) setShowPopup(true)
      })
      .catch(err => {
        console.error(err)
        setShowPopup(true)
      })

    // 미션 진행상황 조회
    axios.get('/api/v1/growth-diary/progress', { headers })
      .then(res => setProgress(res.data))
      .catch(err => console.error(err))

    // 유저 정보 조회
    axios.get('/user/mypage', { headers })
      .then(res => setUser(res.data))
      .catch(err => console.error(err))
  }, [])

  const hasPlanted = !!garden?.growthStatusId
  const treeImage = garden ? getTreeImage(garden.growthRate, garden.itemTypeId) : null

  return (
    <div style={{ display: 'flex', justifyContent: 'center', background: '#F4F4F4', minHeight: '100vh' }}>
      <div style={{
        position: 'relative',
        width: '402px',
        minHeight: '874px',
        backgroundImage: treeImage ? `url(${treeImage})` : 'none',
        backgroundColor: '#e8f5e9',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        overflow: 'hidden'
      }}>
        {/* 헤더 */}
        <div style={{ position: 'absolute', top: '45px', width: '100%', textAlign: 'center', fontWeight: 700, fontSize: '30px' }}>
          {user?.nickname || ''}님의 정원
        </div>
        <div style={{ position: 'absolute', top: '88px', width: '100%', textAlign: 'center', fontSize: '20px' }}>
          {user?.level || 1}단계
        </div>

        {/* 버튼 그룹 */}
        <div style={{ position: 'absolute', top: '125px', width: '100%', display: 'flex', justifyContent: 'center', gap: '15px' }}>
          <button
            onClick={() => navigate('/collection')}
            style={{ width: '131px', height: '46px', background: '#fff', borderRadius: '10px', border: '2px solid #000', fontWeight: 700, fontSize: '18px', cursor: 'pointer' }}
          >📖 도감</button>
          <button
            onClick={() => navigate('/inventory')}
            style={{ width: '131px', height: '46px', background: '#fff', borderRadius: '10px', border: '2px solid #000', fontWeight: 700, fontSize: '18px', cursor: 'pointer' }}
          >👜 인벤토리</button>
        </div>

        {/* 미션 상태 박스 */}
        <div style={{
          position: 'absolute', top: '648px', left: '42px', width: '318px', height: '109px',
          background: '#fff', border: '1px solid #000', borderRadius: '8px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
            현재 진행 {progress?.completedCount || 0} / 5 완료
          </div>
          <button
            onClick={() => hasPlanted && navigate('/missions')}
            disabled={!hasPlanted}
            style={{
              width: '298px', height: '42px',
              background: hasPlanted ? '#F5B600' : '#ccc',
              borderRadius: '20px', fontWeight: 700, fontSize: '20px',
              border: 'none', cursor: hasPlanted ? 'pointer' : 'not-allowed'
            }}
          >오늘의 미션 하러 가기</button>
        </div>
      </div>

      {/* 씨앗 심기 팝업 */}
      {showPopup && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
        }}>
          <div style={{ background: '#fff', padding: '25px', borderRadius: '10px', textAlign: 'center', fontSize: '16px', fontWeight: 500 }}>
            🌱 씨앗을 먼저 심어주세요!<br /><br />
            나무가 자라려면 과일을 심는 것부터 시작해요.
            <br /><br />
            <button
              onClick={() => { setShowPopup(false); navigate('/inventory') }}
              style={{ padding: '8px 16px', background: '#F5B600', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: 'pointer' }}
            >🌰 씨앗 심으러 가기</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
