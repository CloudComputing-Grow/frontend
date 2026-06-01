import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await axios.post('/auth/login', { email, password })
      localStorage.setItem('token', res.data.data.accessToken)
      navigate('/home')
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', marginBottom: '30px' }}>
        나의 일상이 자라는 정원,<br />
        <span style={{ fontWeight: 'bold', color: 'green' }}>GROW</span>
      </div>
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
        <button type="submit">로그인</button>
        <a href="/register">회원가입</a>
      </form>
    </div>
  )
}

export default Login
