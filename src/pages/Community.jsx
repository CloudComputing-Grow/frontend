import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import '../styles/community.css'

function Community() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const fetchPosts = (keyword = '') => {
    api.get('/api/v1/community/posts', {
      params: keyword ? { search: keyword } : {}
    })
      .then(res => setPosts(res.data?.data || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPosts() }, [])

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '16px' }}>💬 커뮤니티</h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && fetchPosts(search)}
          placeholder="검색어를 입력하세요"
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
        <button onClick={() => fetchPosts(search)}
          style={{ padding: '10px 16px', background: '#a4c639', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          검색
        </button>
      </div>

      <div style={{ textAlign: 'right', marginBottom: '12px' }}>
        <button onClick={() => navigate('/community/write')}
          style={{ padding: '8px 16px', background: '#a4c639', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
          ✏️ 글쓰기
        </button>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: '50px' }}>게시글이 없어요.</div>
      ) : (
        posts.map(post => (
          <div key={post.postId} onClick={() => navigate(`/community/posts/${post.postId}`)}
            style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '15px', marginBottom: '12px', cursor: 'pointer' }}>

            {/* 휘장 */}
            {post.badgeType && (
              <div style={{ fontSize: '12px', marginBottom: '4px' }}>
                {post.badgeType === 'GOLD' && '🥇'}
                {post.badgeType === 'NORMAL' && '🥈'}
              </div>
            )}

            <div style={{ fontWeight: 700, fontSize: '16px', marginBottom: '6px' }}>{post.title}</div>
            <div style={{ fontSize: '13px', color: '#555', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {post.content}
            </div>
            <div style={{ fontSize: '12px', color: '#aaa', display: 'flex', gap: '12px' }}>
              <span>❤️ {post.likeCount || 0}</span>
              <span>💬 {post.commentCount || 0}</span>
              <span>🔖 {post.scrapCount || 0}</span>
              <span>{new Date(post.createdAt).toLocaleDateString('ko-KR')}</span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default Community