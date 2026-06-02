import { useState } from 'react';
import api from '../api/axiosInstance';
import '../styles/auth.css';

export default function Register() {
  const [form, setForm] = useState({
    nickname: '',
    email: '',
    password: '',
    passwordConfirm: '',
    agree: false
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.agree) {
      setError('이용약관에 동의해야 합니다.');
      return;
    }

    try {
      const res = await api.post('/auth/signup', {
        email: form.email,
        nickname: form.nickname,
        password: form.password,
        passwordConfirm: form.passwordConfirm
      });

      localStorage.setItem('accessToken', res.data.data.accessToken);

      window.location.href = '/register-success';
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="register-title">당신의 정원을 가꿔 보세요.</div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>닉네임</label>
          <input
            type="text"
            name="nickname"
            placeholder="닉네임"
            value={form.nickname}
            onChange={handleChange}
            onFocus={() => setForm({ ...form, nickname: '' })}
            required
          />

          <label>이메일</label>
          <input
            type="email"
            name="email"
            placeholder="이메일 주소"
            value={form.email}
            onChange={handleChange}
            onFocus={() => setForm({ ...form, email: '' })}
            required
          />

          <label>비밀번호</label>
          <input
            type="password"
            name="password"
            placeholder="비밀번호 (8자 이상)"
            value={form.password}
            onChange={handleChange}
            minLength={8}
            onFocus={() => setForm({ ...form, password: '' })}
            required
          />

          <label>비밀번호 확인</label>
          <input
            type="password"
            name="passwordConfirm"
            placeholder="비밀번호 확인"
            value={form.passwordConfirm}
            onChange={handleChange}
            onFocus={() => setForm({ ...form, passwordConfirm: '' })}
            required
          />

          {error && <div className="error-message">{error}</div>}

          <div className="checkbox-row">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={handleChange}
            />
            <label>이용약관에 동의합니다.</label>
          </div>

          <button type="submit" className="register-btn">가입하기</button>
        </form>

        <div className="center-link">
          <a href="/auth/login">로그인</a>
        </div>
      </div>
    </div>
  );
}