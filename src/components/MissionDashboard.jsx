import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MissionDashboard() {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [missions, setMissions] = useState([]);
  const [certStatus, setCertStatus] = useState({});
  const [nickname, setNickname] = useState('');
  const [currentLevel, setCurrentLevel] = useState('');
  const [showFertilizerModal, setShowFertilizerModal] = useState(false);
  const [latestMissionExecutionId, setLatestMissionExecutionId] = useState(null);
  const [showLevelOptionModal, setShowLevelOptionModal] = useState(false);

  // 1. 미션 목록 데이터 로드 (GET /api/v1/missions)
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/missions');
      if (response.data.success) {
        const { data } = response.data;
        setMissions(data.missions || []);
        setCertStatus(data.certStatus || {});
        setNickname(data.nickname || '');
        setCurrentLevel(data.currentLevel || '');
        setShowFertilizerModal(data.showFertilizerModal || false);
        setLatestMissionExecutionId(data.latestMissionExecutionId || null);
        setShowLevelOptionModal(data.showLevelOptionModal || false);
      }
    } catch (err) {
      console.error(err);
      setError('데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 2. 미션 완료 확정 요청 (POST /api/v1/missions/confirm/:mission_execution_id)
  const handleConfirmMission = async (executionId) => {
    try {
      const response = await axios.post(`/api/v1/missions/confirm/${executionId}`);
      if (response.data.success) {
        // 성공 시 데이터 리로드 (기존 모놀로식의 redirect 흐름 대체)
        await fetchDashboardData();
      }
    } catch (err) {
      console.error(err);
      alert('미션 완료 확정에 실패했습니다.');
    }
  };

  // 3. 레벨 옵션 선택 요청 (POST /api/v1/missions/level-option)
  const handleLevelOption = async (option) => {
    try {
      const response = await axios.post('/api/v1/missions/level-option', { option });
      if (response.data.success) {
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
        } else {
          await fetchDashboardData();
        }
      }
    } catch (err) {
      console.error(err);
      alert('레벨 옵션 처리에 실패했습니다.');
    }
  };

  // 4. 인증 버튼 클릭 시 디테일 뷰 이동 처리
  const handleCertClick = (missionId) => {
    window.location.href = `/dashboard?missionId=${missionId}`;
  };

  // 완료일자 KST 변환 보정 및 포맷팅 포팅 (기존 EJS 백엔드 보정 로직과 일치)
  const formatCompletedDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const kstDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
    return kstDate.toISOString().split('T')[0];
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {/* CSS 스타일 시트 주입 */}
      <style>{styles}</style>

      {/* 사용자 정보 */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <div style={{ backgroundColor: '#4CAF50', color: 'white', padding: '10px 20px', borderRadius: '8px', display: 'inline-block' }}>
          {nickname} 님의 현재 단계<br />
          <strong>{currentLevel}</strong>
        </div>
      </div>

      {/* 미완료 미션 목록 */}
      <h3 style={{ textAlign: 'center', marginTop: '30px' }}>미완료 미션</h3>
      {missions
        .filter((m) => !certStatus[m.mission_id]?.status)
        .map((m) => {
          const statusObj = certStatus[m.mission_id];

          return (
            <div key={m.mission_id} className="mission-box">
              <p style={{ margin: 0 }} className="font">
                {m.description}
              </p>

              {statusObj && statusObj.awaitingConfirm ? (
                <button 
                  className="status-btn cert-btn font" 
                  onClick={() => handleConfirmMission(statusObj.mission_execution_id)}
                >
                  완료
                </button>
              ) : statusObj && statusObj.status === false ? (
                <button className="status-btn waiting-btn font" disabled>
                  확인 중
                </button>
              ) : (
                <button 
                  className="status-btn cert-btn font" 
                  onClick={() => handleCertClick(m.mission_id)}
                >
                  인증
                </button>
              )}
            </div>
          );
        })}

      {/* 완료 미션 목록 */}
      <h3 style={{ textAlign: 'center', marginTop: '40px' }}>완료 미션</h3>
      {missions
        .filter((m) => certStatus[m.mission_id]?.status === true)
        .map((m) => {
          const date = certStatus[m.mission_id]?.date;
          return (
            <div key={m.mission_id} className="mission-done-box">
              <p style={{ marginLeft: '20px' }}>{m.description}</p>
              <p className="status-btn done-btn">
                완료일자
                <br />
                {formatCompletedDate(date)}
              </p>
            </div>
          );
        })}

      {/* 팝업 모달 1: 비료 획득 알림 모달 */}
      {showFertilizerModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              <strong>미션 인증이 완료되었어요!</strong>
              <br />
              비료를 획득하셨습니다!
            </p>
            <img src="/img/fertilizer.png" alt="fertilizer" style={{ width: '150px', height: '150px' }} />
            <p>
              비료를 통해
              <br />
              나무를 성장시켜 보세요!
            </p>
          </div>
          <div className="modal-content2">
            <a href={`/dashboard/diary/${latestMissionExecutionId}`}>
              <button className="write-diary-btn">일기 작성</button>
            </a>
          </div>
        </div>
      )}

      {/* 팝업 모달 2: 단계 완료 후 선택 옵션 모달 */}
      {showLevelOptionModal && (
        <div className="modal">
          <div className="modal-content">
            <p>
              <strong>{nickname} 님</strong>
              <br />
              이번 단계의 미션을 모두 완료하셨습니다!
            </p>
            <p>다음 행동을 선택해주세요:</p>

            <button type="button" onClick={() => handleLevelOption('NEXT')} style={{ display: 'block', margin: '10px auto' }}>
              다음 단계로!
            </button>
            <button type="button" onClick={() => handleLevelOption('RETRY')} style={{ display: 'block', margin: '10px auto' }}>
              한 번 더 도전
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = `
  .mission-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto;
    width: 340px;
    height: 50px;
    border: 1px solid black;
    border-radius: 8px;
    background: white;
    padding: 0 14px;
  }
  .mission-done-box {
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px auto;
    width: 340px;
    height: 50px;
    border-radius: 8px;
    padding: 0 14px;
    box-shadow: 0 0 2px rgba(0,0,0,0.1); /* 미션 둔 박스 연출용 보정 */
  }
  .status-btn {
    border-radius: 5px;
    width: 75px;
    height: 34px;
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .cert-btn {
    background-color: #71a304;
    color: white;
    width: 75px;
    height: 34px;
    font-weight: bold;
    font-size: 14px;
  }
  .waiting-btn {
    background-color: #71a304;
    color: white;
    font-weight: bold;
    opacity: 0.6;
    cursor: not-allowed;
    font-size: 13px;
  }
  .done-btn {
    font-size: 12px;
    color: black;
    text-align: center;
    border: none;
    background: transparent;
    cursor: default;
  }
  .modal {
    position: fixed;
    top: 0; left: 0;
    width: 100%; height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* 기존 0에서 가시성 보장을 위해 1000 레이어로 보정 */
    background: rgba(0,0,0,0.4); /* 백드롭 가시성 연출용 */
  }
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 12px;
    text-align: center;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
  }
  .modal-content2 {
    position: absolute;
    top: 75%;
  }
  .write-diary-btn {
    background: white;
    padding: 10px 20px;
    margin-top: 15px;
    border: none;
    border-radius: 8px;
    box-shadow: 0 0 15px rgba(0,0,0,0.2);
    cursor: pointer;
  }
  .font {
    font-size: 18px;
  }
`;
