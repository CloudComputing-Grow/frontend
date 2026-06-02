import { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import BottomNav from '../components/BottomNav';
import '../styles/mypage.css';

export default function MyPage() {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');

    const loadMyPage = async () => {
        try {
            const res = await api.get('/user/mypage');
            setData(res.data.data);
        } catch (err) {
            setError(err.response?.data?.message || '마이페이지 조회 실패');
        }
    };

    useEffect(() => {
        loadMyPage();
    }, []);

    const handleLogout = async () => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');

            await api.post('/user/logout', { refreshToken });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            window.location.href = '/auth/login';
        } catch {
            alert('로그아웃 중 오류가 발생했습니다.');
        }
    };

    const handleWithdraw = async () => {
        if (!confirm('정말 탈퇴하시겠습니까?')) return;

        try {
            const refreshToken = localStorage.getItem('refreshToken');

            await api.delete('/user/delete-account', {
                data: { refreshToken }
            });

            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');

            alert('탈퇴가 완료되었습니다.');
            window.location.href = '/auth/login';
        } catch {
            alert('탈퇴 중 오류가 발생했습니다.');
        }
    };

    if (error) {
        return <div className="mypage-wrapper">{error}</div>;
    }

    if (!data) {
        return <div className="mypage-wrapper">로딩 중...</div>;
    }

    const completed = data.missionStatus?.completed ?? 0;
    //const total = data.missionStatus?.total ?? 0;
    const total = data.totalCount ?? 0;
    const percent = total > 0 ? (completed / total) * 100 : 0;

    return (
        <>
            <div className="mypage-wrapper">
                <div className="mypage-container">
                    <div className="profile-section">
                        <div className="profile-wrapper">
                            <div className="profile-img">
                                <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="256" cy="256" r="256" fill="black" />
                                    <path
                                        d="M256 128c-35.3 0-64 28.7-64 64s28.7 64 64 64
                                        64-28.7 64-64-28.7-64-64-64zm0 160c-70.7 0-128 
                                        57.3-128 128h256c0-70.7-57.3-128-128-128z"
                                        fill="white"
                                    />
                                </svg>
                            </div>

                            {data.badgeType && (
                                <img
                                    className="badge-overlay"
                                    src={data.badgeType === 'gold' ? '/gold.png' : '/silver.png'}
                                    alt="휘장"
                                />
                            )}
                        </div>

                        <div className="nickname-box">
                            <p className="nickname">{data.nickname} 님</p>
                            <p className="level">{data.level}단계</p>
                        </div>
                    </div>

                    <div className="mission-section">
                        <p className="mission-title">현재 진행 현황</p>
                        <p className="mission-progress-text">
                            현재 진행 {completed} / {total}개 완료
                        </p>

                        <div className="progress-bar">
                            <div
                                className="progress-bar-fill"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                    </div>

                    <div className="menu-buttons">
                        <button onClick={() => window.location.href = '/achievements?category=basic&page=1'}>
                            도감
                        </button>
                        <button onClick={() => window.location.href = '/api/v1/inventory'}>
                            인벤토리
                        </button>
                        <button onClick={() => window.location.href = '/api/v1/growth-diary/diaries'}>
                            내가 쓴 일기
                        </button>
                        <button onClick={() => window.location.href = '/api/v1/community/scraps'}>
                            스크랩한 글
                        </button>
                    </div>

                    <div className="personal-section">
                        <p className="personal-title">개인정보 수정</p>
                        <p className="email-text">{data.email}</p>

                        <div className="small-buttons-vertical">
                            <button onClick={() => window.location.href = '/user/change-email'}>
                                이메일 변경
                            </button>
                            <button onClick={() => window.location.href = '/user/change-password'}>
                                비밀번호 변경
                            </button>
                        </div>
                    </div>

                    <div className="logout-withdraw">
                        <span onClick={handleLogout}>로그아웃</span>
                        <span onClick={handleWithdraw}>탈퇴</span>
                    </div>
                </div>
            </div>

            <BottomNav />
        </>
    );
}