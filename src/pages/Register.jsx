import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

function Register() {
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    if (password.length < 8) {
      setError('비밀번호는 8자 이상이어야 합니다.')
      return
    }
    try {
      await axios.post('/auth/signup', { nickname, email, password })
      alert('회원가입 완료! 로그인해주세요.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || '회원가입에 실패했습니다.')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', textAlign: 'center' }}>
      <div style={{ fontSize: '22px', marginBottom: '30px' }}>
        당신의 정원을 가꿔 보세요.
      </div>
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="이메일 주소"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호 (8자 이상)"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          minLength={8}
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={passwordConfirm}
          onChange={e => setPasswordConfirm(e.target.value)}
          required
        />
        {error && <div style={{ color: 'red', fontSize: '14px' }}>{error}</div>}
        <button type="submit">가입하기</button>
        <a href="/login">로그인</a>
      </form>
    </div>
  )
}

export default Register
