import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

function Scrap() {
  const [scraps, setScraps] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/v1/community/scraps')
      .then(res => setScraps(res.data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>🔖 스크랩한 글</h2>

      {scraps.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>스크랩한 글이 없어요.</div>
      ) : (
        scraps.map(scrap => (
          <div key={scrap.scrapId} onClick={() => navigate(`/community/posts/${scrap.postId}`)}
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', border: '1px solid #000', borderRadius: '12px', padding: '16px', marginBottom: '16px', cursor: 'pointer' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{scrap.title}</div>
              <div style={{ fontSize: '14px', color: '#555' }}>
                {scrap.content?.length > 30 ? scrap.content.substring(0, 30) + '...' : scrap.content}
              </div>
            </div>
            <div style={{ fontSize: '20px', color: '#555', marginLeft: '12px' }}>➔</div>
          </div>
        ))
      )}
    </div>
  )
}

export default Scrap