import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MissionDetail() {
  // 상태 관리 정의
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mission, setMission] = useState(null);
  const [result, setResult] = useState(null);
  
  // 폼 입력 상태 관리
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null); // 이미지 미리보기용 (선택 사항 추가)
  const [memo, setMemo] = useState('');

  // 1. URL 쿼리 스트링에서 missionId 가져오기
  const getQueryMissionId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('missionId');
  };

  // 2. 미션 상세 데이터 로드 (GET /api/v1/missions/detail?missionId=...)
  const fetchMissionDetail = async () => {
    try {
      setLoading(true);
      const missionId = getQueryMissionId();
      // query parameter가 있으면 넘겨주고, 없으면 백엔드가 다음 미션을 자동으로 찾아옴
      const url = missionId ? `/api/v1/missions/detail?missionId=${missionId}` : '/api/v1/missions/detail';
      
      const response = await axios.get(url);
      if (response.data.success) {
        const { data } = response.data;
        setMission(data.mission || null);
        setResult(data.result || null);
      }
    } catch (err) {
      console.error(err);
      setError('미션 데이터를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionDetail();
  }, []);

  // 3. 파일 선택 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성
    }
  };

  // 4. 미션 제출 핸들러 (POST /api/v1/missions/submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('파일을 선택해 주세요.');
      return;
    }

    try {
      // multipart/form-data 전송을 위한 FormData 객체 생성
      const formData = new FormData();
      formData.append('missionId', mission.mission_id);
      formData.append('photo', selectedFile); // uploader.single('photo')와 매칭
      formData.append('memo', memo);

      const response = await axios.post('/api/v1/missions/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert(response.data.message || '미션 제출 완료');
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl; // 기존 리다이렉트 흐름 유지
        } else {
          await fetchMissionDetail();
        }
      }
    } catch (err) {
      console.error(err);
      alert('미션 제출에 실패했습니다.');
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '50px' }}>로딩 중...</div>;
  if (error) return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>{error}</div>;

  return (
    <div className="mission-detail-body">
      <style>{styles}</style>

      <div className="mission-container">
        {mission ? (
          <>
            {/* 미션 설명 */}
            <div className="mission-title">{mission.description}</div>

            {result ? (
              /* 케이스 1: 이미 완료한 미션인 경우 */
              <>
                <p style={{ color: 'green' }}>✅ 완료한 미션입니다</p>
                {result.image_source && (
                  <img 
                    src={result.image_source.startsWith('http') ? result.image_source : `/uploads/${result.image_source}`} 
                    width="200" 
                    alt="인증 사진" 
                    style={{ borderRadius: '8px', marginBottom: '15px' }}
                  />
                )}
                {result.memo && (
                  <p>
                    <strong>소감:</strong> {result.memo}
                  </p>
                )}
                <div style={{ marginTop: '15px' }}>
                  <a href="/api/v1/missions" style={{ color: '#71a304', fontWeight: 'bold', textDecoration: 'none' }}>
                    다음 미션 보기
                  </a>
                </div>
              </>
            ) : (
              /* 케이스 2: 아직 완료하지 않아 제출 폼을 보여주는 경우 */
              <form onSubmit={handleSubmit}>
                <div className="upload-box">
                  {/* 파일이 선택되면 구름 이미지 대신 선택된 파일 미리보기를 보여줌 */}
                  {previewUrl ? (
                    <img src={previewUrl} alt="preview" style={{ objectFit: 'cover', borderRadius: '6px' }} />
                  ) : (
                    <img src="/img/cloud.png" alt="upload" />
                  )}
                  
                  <label htmlFor="file" className="file-label">
                    {selectedFile ? '파일 변경' : '파일 선택'}
                  </label>
                  <input 
                    type="file" 
                    name="photo" 
                    id="file" 
                    accept="image/*"
                    onChange={handleFileChange} 
                    required 
                  />
                </div>

                {/* 기존 EJS 코드에서는 체크박스 전환 형태의 스크립트 흔적이 있었으나 HTML엔 마크업이 생략되어 있었음.
                  리액트 환경에 맞춰 파일이 업로드되면 소감 박스가 자연스럽게 나타나도록 UI 사용성을 보정
                */}
                {selectedFile && (
                  <div id="memo-box">
                    <textarea 
                      name="memo" 
                      placeholder="소감 작성 (선택)" 
                      rows="3"
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                    />
                  </div>
                )}

                <button type="submit" className="submit-button">
                  완료하기
                </button>
              </form>
            )}
          </>
        ) : (
          /* 케이스 3: 모든 미션을 완료한 경우 */
          <a href="/last-complete" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>🎉 모든 미션을 완료했습니다!</h2>
          </a>
        )}
      </div>
    </div>
  );
}

// 기존 모놀로식 CSS 명세를 완벽히 박아넣은 스타일 규칙
const styles = `
  .mission-detail-body {
    margin: 0;
    padding-bottom: 80px;
    background-color: #f9fff3;
    min-height: 100vh;
    font-family: sans-serif;
  }

  .mission-container {
    max-width: 400px;
    margin: 40px auto;
    padding: 20px;
    background-color: white;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.05);
    text-align: center;
  }

  .mission-title {
    background-color: #eee;
    padding: 10px;
    border-radius: 8px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .upload-box {
    border: 2px dashed #83b3dd;
    border-radius: 10px;
    padding: 30px;
    background-color: #f0f7fc;
    margin-bottom: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .upload-box img {
    width: 150px;
    height: 150px;
    margin-bottom: 10px;
    display: flex;
  }

  .file-label {
    background-color: #ccc;
    color: black;
    padding: 6px 12px;
    border-radius: 5px;
    display: inline-block;
    margin-top: 10px;
    cursor: pointer;
    font-size: 14px;
  }

  input[type="file"] {
    display: none;
  }

  #memo-box {
    margin-top: 10px;
    width: 100%;
  }

  textarea {
    width: 95%;
    padding: 8px;
    border-radius: 5px;
    border: 1px solid #ccc;
    resize: none;
    font-family: inherit;
  }

  .submit-button {
    background-color: #4CAF50;
    color: white;
    border: none;
    padding: 12px 20px;
    border-radius: 8px;
    font-size: 16px;
    margin-top: 15px;
    cursor: pointer;
    width: 100%;
    font-weight: bold;
  }
`;
