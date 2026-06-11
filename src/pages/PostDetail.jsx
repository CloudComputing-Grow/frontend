import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosInstance'
import '../styles/community.css'

function PostDetail() {
  const { postId } = useParams()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)

  const fetchPost = () => {
    api.get(`/api/v1/community/posts/${postId}`)
      .then(res => setPost(res.data?.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }

  const fetchComments = () => {
    api.get(`/api/v1/community/posts/${postId}/comments`)
      .then(res => setComments(res.data?.data || []))
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchPost()
    fetchComments()
    api.get('/user/mypage')
      .then(res => {
        const id = Number(res.data?.data?.userId)  // user_id → userId
        console.log('currentUserId:', id, typeof id)
        setCurrentUserId(id)
      })
      .catch(err => console.error(err))
  }, [postId])

  const handleLike = async () => {
    try {
      const res = await api.post(`/api/v1/community/posts/${postId}/like`)
      setPost(prev => ({ ...prev, likeCount: res.data?.data?.likeCount, likedByUser: res.data?.data?.liked }))
    } catch (err) { console.error(err) }
  }

  const handleScrap = async () => {
    try {
      const res = await api.post(`/api/v1/community/posts/${postId}/scrap`)
      setPost(prev => ({ ...prev, scrappedByUser: res.data?.data?.scrapped, scrapCount: res.data?.data?.scrapCount }))
    } catch (err) { console.error(err) }
  }

  const handleDelete = async () => {
    if (!confirm('삭제하시겠습니까?')) return
    try {
      await api.delete(`/api/v1/community/posts/${postId}`)
      navigate('/community')
    } catch (err) { console.error(err) }
  }

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return
    try {
      await api.post(`/api/v1/community/posts/${postId}/comments`, { content: newComment })
      setNewComment('')
      fetchComments()
    } catch (err) { console.error(err) }
  }

  const handleCommentDelete = async (commentId) => {
    try {
      await api.delete(`/api/v1/community/posts/${postId}/comments/${commentId}`)
      fetchComments()
    } catch (err) { console.error(err) }
  }

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>
  if (!post) return <div style={{ textAlign: 'center', marginTop: '50px' }}>게시글을 찾을 수 없습니다.</div>

  return (
    <div style={{ maxWidth: '430px', margin: '0 auto', padding: '20px', paddingBottom: '80px' }}>
      <button onClick={() => navigate('/community')}
        style={{ background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', marginBottom: '16px' }}>
        ← 목록으로
      </button>

      <div style={{ background: '#fff', border: '1px solid #ddd', borderRadius: '10px', padding: '20px', marginBottom: '16px' }}>

        {/* 휘장 */}
        {post.badgeType && (
          <div style={{ fontSize: '12px', marginBottom: '4px' }}>
            {post.badgeType === 'GOLD' && '🥇'}
            {post.badgeType === 'NORMAL' && '🥈'}
          </div>
        )}

        <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>{post.title}</h2>
        <div style={{ fontSize: '13px', color: '#aaa', marginBottom: '16px' }}>
          {new Date(post.createdAt).toLocaleDateString('ko-KR')}
        </div>
        <p style={{ fontSize: '15px', lineHeight: '1.7', whiteSpace: 'pre-wrap', marginBottom: '16px' }}>{post.content}</p>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleLike}
            style={{ padding: '8px 16px', background: post.likedByUser ? '#ff6b6b' : '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            ❤️ {post.likeCount || 0}
          </button>
          <button onClick={handleScrap}
            style={{ padding: '8px 16px', background: post.scrappedByUser ? '#a4c639' : '#f0f0f0', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
            🔖 {post.scrappedByUser ? '스크랩 취소' : '스크랩'}
          </button>
          {/* 내 게시글만 삭제 버튼 표시 */}
          {post.userId === currentUserId && (
            <button onClick={handleDelete}
              style={{ padding: '8px 16px', background: '#ff6b6b', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', marginLeft: 'auto' }}>
              삭제
              </button>
            )}
          </div>
        </div>

      <h3 style={{ marginBottom: '12px' }}>댓글 {comments.length}개</h3>
      {comments.map(comment => {
        console.log('comment.userId:', comment.userId, typeof comment.userId, '=== currentUserId:', currentUserId)  // 추가
        return (
        <div key={comment.commentId}
          style={{ background: '#f9f9f9', borderRadius: '8px', padding: '12px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <p style={{ fontSize: '14px', margin: 0 }}>{comment.content}</p>
          {/* 내 댓글만 삭제 버튼 표시 */}
          {comment.userId === currentUserId && (
            <button onClick={() => handleCommentDelete(comment.commentId)}
              style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer', fontSize: '12px' }}>
              삭제
            </button>
          )}
        </div>
  )})}

      <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
        <input value={newComment} onChange={e => setNewComment(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleCommentSubmit()}
          placeholder="댓글을 입력하세요"
          style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
        <button onClick={handleCommentSubmit}
          style={{ padding: '10px 16px', background: '#a4c639', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          등록
        </button>
      </div>
    </div>
  )
}

export default PostDetail