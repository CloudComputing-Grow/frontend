import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function MissionDetail() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mission, setMission] = useState(null);
  const [result, setResult] = useState(null);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const getQueryMissionId = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('missionId');
  };

  const fetchMissionDetail = async () => {
    try {
      setLoading(true);
      const missionId = getQueryMissionId();
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('파일을 선택해 주세요.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('missionId', mission.mission_id);
      formData.append('photo', selectedFile); 

      const response = await axios.post('/api/v1/missions/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        alert(response.data.message || '미션 제출 완료');
        if (response.data.redirectUrl) {
          window.location.href = response.data.redirectUrl;
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
            <div className="mission-title">{mission.description}</div>

            {result ? (
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
                <div style={{ marginTop: '15px' }}>
                  <a href="/missions" style={{ color: '#71a304', fontWeight: 'bold', textDecoration: 'none' }}>
                    다음 미션 보기
                  </a>
                </div>
              </>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="upload-box">
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

                <button type="submit" className="submit-button">
                  완료하기
                </button>
              </form>
            )}
          </>
        ) : (
          <a href="/last-complete" style={{ textDecoration: 'none', color: 'inherit' }}>
            <h2>🎉 모든 미션을 완료했습니다!</h2>
          </a>
        )}
      </div>
    </div>
  );
}

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
