import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'

const EMOTION_OPTIONS = ['기쁨', '뿌듯함', '설렘', '평온', '슬픔', '불안', '화남', '지침']

export default function DiaryWrite() {
  const { missionExecutionId } = useParams()
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [emotions, setEmotions] = useState([])
  const [loading, setLoading] = useState(false)

  const toggleEmotion = (emotion) => {
    setEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    )
  }

  const handleSubmit = async () => {
    if (!title || !content || emotions.length === 0) {
      alert('제목, 내용, 감정을 모두 입력해주세요.')
      return
    }

    setLoading(true)
    try {
      await api.post('/api/v1/growth-diary/diaries', {
        missionExecutionId: Number(missionExecutionId),
        title,
        content,
        emotions
      })
      alert('일기가 작성되었습니다!')
      navigate('/diary')
    } catch (err) {
      console.error(err)
      alert('일기 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>✏️ 일기 작성</h2>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>제목</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="제목을 입력하세요"
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>내용</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="오늘의 미션을 수행하며 느낀 점을 적어보세요."
          rows={6}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'none' }}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '10px' }}>감정 선택</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {EMOTION_OPTIONS.map(emotion => (
            <button
              key={emotion}
              onClick={() => toggleEmotion(emotion)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                border: '1px solid #ddd',
                background: emotions.includes(emotion) ? '#a4c639' : '#fff',
                color: emotions.includes(emotion) ? '#fff' : '#333',
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: '#a4c639', color: '#fff',
          border: 'none', borderRadius: '10px',
          fontSize: '16px', fontWeight: 700, cursor: 'pointer'
        }}
      >
        {loading ? '저장 중...' : '일기 저장'}
      </button>
    </div>
  )
}