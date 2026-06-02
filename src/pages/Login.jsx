import { useState } from 'react';
import api from '../api/axiosInstance';
import '../styles/auth.css';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await api.post('/auth/login', form);

            localStorage.setItem('accessToken', res.data.data.accessToken);
            localStorage.setItem('refreshToken', res.data.data.refreshToken);

            window.location.href = '/user/mypage';
        } catch (err) {
            setError(err.response?.data?.message || '로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="login-title">
                    나의 일상이 자라는 정원,<br />
                    <span>GROW</span>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
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
                        placeholder="비밀번호"
                        value={form.password}
                        onChange={handleChange}
                        onFocus={() => setForm({ ...form, password: '' })}
                        required
                    />

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="login-btn">로그인</button>
                    <button type="button" className="register-btn" onClick={() => window.location.href = '/auth/signup'}> 회원가입 </button>
                </form>
            </div>
        </div>
    );
}