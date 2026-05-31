import './BottomNav.css';

export default function BottomNav() {
    return (
        <div className="bottom-nav">
            <a href="/market">
                <div>🎁</div>
                <div>그로우마켓</div>
            </a>

            <a href="/home">
                <div>🏠</div>
                <div>홈</div>
            </a>

            <a href="/community">
                <div>👥</div>
                <div>커뮤니티</div>
            </a>

            <a href="/user/mypage">
                <div>👤</div>
                <div>마이페이지</div>
            </a>
        </div>
    );
}