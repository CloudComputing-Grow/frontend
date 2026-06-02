import '../styles/auth.css';

export default function RegisterSuccess() {
    return (
        <div className="success-container">
            <div className="success-check">✔</div>
            <div className="success-title">가입 완료</div>
            <div className="success-welcome">환영합니다!</div>
            <div className="success-desc">
                로그인하여 당신의 정원에서 첫 씨앗을 심어보세요!
            </div>

            <button
                className="success-btn"
                onClick={() => window.location.href = '/auth/login'}
            >
                로그인하러 가기
            </button>
        </div>
    );
}