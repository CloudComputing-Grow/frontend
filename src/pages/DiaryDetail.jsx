import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

export default function DiaryDetail() {
  const { diaryId } = useParams()
  const navigate = useNavigate()
  const [diary, setDiary] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get(`/api/v1/growth-diary/diaries/${diaryId}`)
      .then(res => setDiary(res.data.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [diaryId])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>
  if (!diary) return <div style={{ textAlign: 'center', marginTop: '50px' }}>일기를 찾을 수 없습니다.</div>

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <button
        onClick={() => navigate('/diary')}
        style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', marginBottom: '16px' }}
      >
        ← 목록으로
      </button>

      <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
        {diary.title}
      </h2>

      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>
        {new Date(diary.createdAt).toLocaleDateString('ko-KR')}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {diary.emotions?.map(e => (
          <span
            key={e}
            style={{
              padding: '6px 12px',
              borderRadius: '20px',
              background: '#a4c639',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 500
            }}
          >
            #{e}
          </span>
        ))}
      </div>

      <div style={{
        background: '#fff',
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '16px',
        fontSize: '15px',
        lineHeight: '1.7',
        color: '#333',
        whiteSpace: 'pre-wrap'
      }}>
        {diary.content}
      </div>
    </div>
  )
}