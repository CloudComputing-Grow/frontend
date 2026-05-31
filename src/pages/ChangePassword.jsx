import { useState } from 'react';
import api from '../api/axiosInstance';
import '../styles/form.css';

export default function ChangePassword() {
    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        newPasswordConfirm: ''
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');

        if (form.newPassword !== form.newPasswordConfirm) {
            setError('새 비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const res = await api.patch('/change-password', {
                oldPassword: form.oldPassword,
                newPassword: form.newPassword
            });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            setMessage(res.data.message || '비밀번호 변경 성공. 다시 로그인해주세요.');

            setTimeout(() => {
                window.location.href = '/login';
            }, 1000);
        } catch (err) {
            setError(err.response?.data?.message || '비밀번호 변경 실패');
        }
    };

    return (
        <div className="form-container">
            <div className="form-title">비밀번호 변경</div>

            {message && <div className="message">{message}</div>}
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit}>
                <label>현재 비밀번호</label>
                <input
                    type="password"
                    name="oldPassword"
                    value={form.oldPassword}
                    onChange={handleChange}
                    onFocus={() => setForm({ ...form, oldPassword: '' })}
                    required
                />

                <label>새 비밀번호</label>
                <input
                    type="password"
                    name="newPassword"
                    value={form.newPassword}
                    onChange={handleChange}
                    minLength={8}
                    onFocus={() => setForm({ ...form, newPassword: '' })}
                    required
                />

                <label>비밀번호 확인</label>
                <input
                    type="password"
                    name="newPasswordConfirm"
                    value={form.newPasswordConfirm}
                    onChange={handleChange}
                    onFocus={() => setForm({ ...form, newPasswordConfirm: '' })}
                    required
                />

                <button type="submit" className="submit-btn">변경하기</button>
            </form>
        </div>
    );
}