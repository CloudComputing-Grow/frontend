import React from 'react';

export default function LastComplete() {
  return (
    <div style={wrapperStyle}>
      <h3 style={{ marginTop: '20px' }}>모든 미션 완료</h3>
      <div style={containerStyle}>
        <img src="/img/lastimg.png" alt="축하 이미지" style={imgStyle} />
        
        <div style={messageStyle}>
          축하드립니다.{"\n"}
          이 기간의 여정을 묵묵히 수행하시느라{"\n"}
          고생하셨습니다.{"\n\n"}
          당신의 하루가, 당신의 일주일이{"\n"}
          조금 더 성장하는 날 함께 보내셨으면 좋겠습니다.{"\n"}
          감사합니다.
        </div>

        <a href="/diary">
          <button style={buttonStyle}>일기 보러가기</button>
        </a>
      </div>
    </div>
  );
}

// 기존 메인 화면 스타일 스타일링과 결을 맞춘 스타일 오브젝트
const wrapperStyle = {
  backgroundColor: '#fff',
  margin: 0,
  padding: 0,
  textAlign: 'center',
  fontFamily: 'sans-serif',
};

const containerStyle = {
  maxWidth: '280px',
  margin: '20px auto',
  padding: '20px',
  boxShadow: '0 0 15px rgba(0,0,0,0.2)',
  borderRadius: '12px',
};

const imgStyle = {
  width: '100%',
  borderRadius: '12px',
};

const messageStyle = {
  fontSize: '12px',
  lineHeight: '1.5',
  whiteSpace: 'pre-line',
  marginTop: '15px',
};

const buttonStyle = {
  marginTop: '20px',
  backgroundColor: '#4c783e',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
  borderRadius: '8px',
  fontWeight: 'bold',
  cursor: 'pointer',
};
