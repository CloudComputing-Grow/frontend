import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminCertManager() {
  // 백엔드 응답 명세 데이터 구조 상태 정의
  const [certs, setCerts] = useState([]);                 // 검증 대기 목록 (formattedPending)
  const [approvedCerts, setApprovedCerts] = useState([]); // 최근 승인 완료 목록 (formattedApproved)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. 관리자 인증 목록 로드 (GET /api/v1/admin/certs)
  const fetchAdminCerts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/v1/admin/certs');
      if (response.data.success) {
        const { data } = response.data;
        setCerts(data.certs || []);
        setApprovedCerts(data.approvedCerts || []);
      }
    } catch (err) {
      console.error(err);
      setError('관리자 인증 목록을 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminCerts();
  }, []);

  // 2. 인증 승인 핸들러 (POST /api/v1/admin/certs/:id/approve)
  const handleApprove = async (certificationId) => {
    if (!window.confirm('이 미션을 승인하시겠습니까?')) return;
    
    try {
      const response = await axios.post(`/api/v1/admin/certs/${certificationId}/approve`);
      if (response.data.success) {
        alert(response.data.message || '인증 승인이 완료되었습니다.');
        await fetchAdminCerts(); // 목록 갱신 (리다이렉트 흐름 대체)
      }
    } catch (err) {
      console.error(err);
      alert('인증 승인 처리 중 오류가 발생했습니다.');
    }
  };

  // 3. 인증 취소 핸들러 (POST /api/v1/admin/certs/:id/cancel)
  const handleCancel = async (certificationId) => {
    if (!window.confirm('인증을 취소하고 지급된 보상을 회수하시겠습니까?')) return;

    try {
      const response = await axios.post(`/api/v1/admin/certs/${certificationId}/cancel`);
      if (response.data.success) {
        alert(response.data.message || '인증 취소 및 보상 회수가 완료되었습니다.');
        await fetchAdminCerts(); // 목록 갱신
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || '인증 취소 처리 중 오류가 발생했습니다.';
      alert(errMsg);
    }
  };

  // 날짜 변환 보정 및 데이터 맵핑 헬퍼 함수
  const formatIsoDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    // ISOString 포맷팅 처리
    const date = new Date(dateInput);
    return date.toISOString().split('T')[0];
  };

  // 이미지 소스 래퍼 (GCS 전환 대응용 구조화 유지)
  const renderImage = (imageSource) => {
    if (!imageSource) return null;
    const srcPath = imageSource.startsWith('http') ? imageSource : `/uploads/${imageSource}`;
    return <img src={srcPath} alt="인증 사진" />;
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>보안 세션 확인 및 데이터 로딩 중...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div style={{ fontFamily: 'sans-serif', paddingBottom: '6px' }}>
      <style>{styles}</style>

      <h2 style={{ textAlign: 'center', marginTop: '20px' }}>🔒 관리자 인증 승인 페이지</h2>

      {/* 검증 대기 중인 미션 섹션 */}
      {certs.length === 0 ? (
        <p style={{ textAlign: 'center' }}>확인할 인증이 없습니다.</p>
      ) : (
        certs.map((cert) => (
          <div key={cert.certification_id} className="cert-box">
            <p><strong>사용자:</strong> {cert.nickname}</p>
            {/* 백엔드 아웃풋 속성명인 mission_description 스펙과 동기화 */}
            <p><strong>미션:</strong> {cert.mission_description}</p> 
            {renderImage(cert.image_source)}
            <div>
              <button 
                type="button" 
                className="approve-btn"
                onClick={() => handleApprove(cert.certification_id)}
              >
                승인하기 ✅
              </button>
            </div>
          </div>
        ))
      )}

      {/* 인증 완료된 목록 섹션 */}
      <h2 style={{ textAlign: 'center', marginTop: '50px' }}>✅ 인증 완료된 미션</h2>

      {approvedCerts.length === 0 ? (
        <p style={{ textAlign: 'center' }}>완료된 인증이 없습니다.</p>
      ) : (
        approvedCerts.map((cert) => (
          <div key={cert.certification_id} className="cert-box" style={{ opacity: 0.7 }}>
            <p><strong>사용자:</strong> {cert.nickname}</p>
            <p><strong>미션:</strong> {cert.mission_description}</p>
            <p><strong>완료일자:</strong> {formatIsoDate(cert.certification_date)}</p>
            {renderImage(cert.image_source)}
            <div>
              {/* 인증 취소 버튼 스타일 인라인 스펙 동기화 */}
              <button 
                type="button" 
                className="approve-btn" 
                style={{ backgroundColor: '#e74c3c' }}
                onClick={() => handleCancel(cert.certification_id)}
              >
                인증 취소
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// 오리지널 인하우스 관리자 뷰 전용 스타일시트 캡슐화
const styles = `
  .cert-box {
    border: 1px solid #ccc; 
    padding: 20px; 
    margin: 15px auto; /* 가독성을 위한 중앙정렬 패치 추가 */
    max-width: 500px;
    border-radius: 10px; 
    background-color: #f9f9f9;
  }
  .cert-box img { 
    display: block;
    max-width: 200px; 
    margin-bottom: 15px; 
    border-radius: 6px;
  }
  .approve-btn {
    background-color: #4CAF50; 
    color: white; 
    border: none;
    padding: 8px 12px; 
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
  }
  .approve-btn:hover {
    opacity: 0.9;
  }
`;
