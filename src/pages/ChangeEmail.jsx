import { useState } from 'react';
import api from '../api/axiosInstance';
import '../styles/form.css';

export default function ChangeEmail() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        try {
            const res = await api.patch('/user/change-email', { email });
            setMessage(res.data.message || '이메일 변경 성공. 다시 로그인해주세요.');

            setTimeout(() => {
                window.location.href = '/auth/login';
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || '이메일 변경 실패');
        }
    };

    return (
        <div className="form-container">
            <div className="form-title">이메일 변경</div>

            {message && <div className="message">{message}</div>}
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <label>새 이메일</label>
                <input
                    type="email"
                    value={email}
                    placeholder="새 이메일"
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setForm({ ...form, email: '' })}
                    required
                />

                <button type="submit" className="submit-btn">변경하기</button>
            </form>
        </div>
    );
}