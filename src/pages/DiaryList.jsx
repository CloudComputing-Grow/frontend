import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import '../styles/diary.css'

export default function DiaryList() {
  const [diaries, setDiaries] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/api/v1/growth-diary/diaries')
      .then(res => setDiaries(res.data.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>📔 나의 일기</h2>
      {diaries.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>아직 작성한 일기가 없어요.</div>
      ) : (
        diaries.map(diary => (
          <div key={diary.diaryId} onClick={() => navigate(`/diary/${diary.diaryId}`)}
            style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '15px', marginBottom: '12px', cursor: 'pointer' }}>
            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{diary.title}</div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px' }}>
              {new Date(diary.createdAt).toLocaleDateString('ko-KR')}
            </div>
            <div style={{ fontSize: '14px', color: '#555' }}>
              {diary.emotions?.map(e => `#${e}`).join(' ')}
            </div>
          </div>
        ))
      )}
    </div>
  )
}