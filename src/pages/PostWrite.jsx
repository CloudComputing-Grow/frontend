import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import '../styles/community.css'

function PostWrite() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      await api.post('/api/v1/community/posts', { title, content })
      navigate('/community')
    } catch (err) {
      console.error(err)
      alert('게시글 작성에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <button onClick={() => navigate('/community')}
        style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', marginBottom: '16px' }}>
        ← 뒤로
      </button>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>✏️ 게시글 작성</h2>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>제목</label>
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="제목을 입력하세요"
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px' }} />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={{ fontWeight: 600, display: 'block', marginBottom: '6px' }}>내용</label>
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="내용을 입력하세요" rows={8}
          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '14px', resize: 'none' }} />
      </div>

      <button onClick={handleSubmit} disabled={loading}
        style={{ width: '100%', padding: '14px', background: '#a4c639', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>
        {loading ? '등록 중...' : '게시글 등록'}
      </button>
    </div>
  )
}

export default PostWrite