// src/App.jsx
import React from 'react';
import MissionDashboard from './components/MissionDashboard';
import MissionDetail from './components/MissionDetail';
import AdminCertManager from './components/AdminCertManager';
import LastComplete from './components/LastComplete';

export default function App() {
  // 현재 브라우저 주소창의 경로를 가져옴
  const path = window.location.pathname;

  // 경로에 따라 어떤 컴포넌트를 보여줄지 분기 처리
  switch (path) {
    case '/missions':
      return <MissionDashboard />;
      
    case '/dashboard':
    case '/api/v1/missions/detail':
      return <MissionDetail />;
      
    case '/admin/certs':
    case '/api/v1/admin/certs':
      return <AdminCertManager />;
    
    case '/last-complete':
      return <LastComplete />;

    default:
      // 기본 메인 화면일 때 쉽게 이동할 수 있도록 안내 링크 제공
      return (
        <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
          <h2>🌱 미션 서비스 프론트엔드 테스트 메인</h2>
          <p>아래 링크를 클릭하거나 주소창에 경로를 입력해 화면을 테스트해 보세요.</p>
          <hr style={{ width: '300px', margin: '20px auto' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', alignItems: 'center' }}>
            <a href="/missions" style={linkStyle}>1. 유저 미션 대시보드 화면 ➡️</a>
            <a href="/dashboard" style={linkStyle}>2. 유저 미션 상세 / 제출 화면 ➡️</a>
            <a href="/admin/certs" style={linkStyle}>3. 관리자 인증 승인 화면 ➡️</a>
	    <a href="/last-complete" style={linkStyle}>4. 모든 미션 완료 화면 </a>
          </div>
        </div>
      );
  }
}

const linkStyle = {
  fontSize: '18px',
  color: '#4CAF50',
  fontWeight: 'bold',
  textDecoration: 'none',
  padding: '10px 20px',
  border: '1px solid #4CAF50',
  borderRadius: '8px',
  width: '250px',
  backgroundColor: '#f9fff3'
};
