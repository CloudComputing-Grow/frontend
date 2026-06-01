import { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const getImagePath = (itemName) => {
  const map = {
    '일반 사과': 'apple.png',
    '황금 사과': 'gold_apple.png',
    '일반 체리': 'cherry.png',
    '황금 체리': 'gold_cherry.png',
    '일반 포도': 'grape.png',
    '황금 포도': 'gold_grape.png',
    '일반 자몽': 'grapefruit.png',
    '황금 자몽': 'gold_grapefruit.png',
    '일반 레몬': 'lemon.png',
    '황금 레몬': 'gold_lemon.png',
    '일반 망고': 'mango.png',
    '황금 망고': 'gold_mango.png',
    '일반 오렌지': 'orange.png',
    '황금 오렌지': 'gold_orange.png',
    '일반 복숭아': 'peach.png',
    '황금 복숭아': 'gold_peach.png',
  }
  return map[itemName] || 'seed.png'
}

function Collection() {
  const [tab, setTab] = useState('basic')
  const [items, setItems] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  const navigate = useNavigate()

  const token = localStorage.getItem('token')
  const headers = { Authorization: `Bearer ${token}` }

  useEffect(() => {
    axios.get('/achievement', { headers })
      .then(res => setItems(res.data?.items || res.data?.data?.items || []))
      .catch(err => console.error(err))
  }, [])

  const visibleItems = items.filter(item =>
    tab === 'basic' ? item.category === 'BASIC_FRUIT' : item.category === 'GOLD_FRUIT'
  )

  return (
    <div style={{ maxWidth: '402px', margin: '0 auto', background: '#fff', minHeight: '874px', position: 'relative' }}>
      {/* 헤더 */}
      <div style={{ display: 'flex', alignItems: 'center', padding: '15px', borderBottom: '1px solid #eee' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}>←</button>
        <h2 style={{ margin: '0 auto' }}>📖 도감</h2>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', padding: '15px' }}>
        <button
          onClick={() => setTab('basic')}
          style={{ padding: '6px 20px', borderRadius: '6px', background: tab === 'basic' ? '#000' : '#e8e8e8', color: tab === 'basic' ? '#fff' : '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >기본</button>
        <button
          onClick={() => setTab('gold')}
          style={{ padding: '6px 20px', borderRadius: '6px', background: tab === 'gold' ? '#000' : '#e8e8e8', color: tab === 'gold' ? '#fff' : '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
        >황금</button>
      </div>

      {/* 아이템 그리드 */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', padding: '10px' }}>
        {visibleItems.length === 0 && <p style={{ padding: '20px', color: 'gray' }}>아직 수확한 과일이 없어요!</p>}
        {visibleItems.map(item => (
          <div
            key={item.item_type_id}
            onClick={() => setSelectedItem(item)}
            style={{ cursor: 'pointer', textAlign: 'center', width: '80px' }}
          >
            <img src={`/${getImagePath(item.item_name)}`} alt={item.item_name} width={60} />
            <div style={{ fontSize: '12px' }}>{item.item_name}</div>
          </div>
        ))}
      </div>

      {/* 선택된 아이템 상세 */}
      {selectedItem && (
        <div style={{
          position: 'absolute', bottom: '100px', left: '20px', right: '20px',
          background: '#fff', borderRadius: '10px', padding: '15px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src={`/${getImagePath(selectedItem.item_name)}`} alt={selectedItem.item_name} width={60} />
            <div>
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{selectedItem.item_name}</div>
              <div style={{ fontSize: '14px', color: 'gray' }}>{selectedItem.description || '설명이 없습니다.'}</div>
            </div>
          </div>
          <button
            onClick={() => setSelectedItem(null)}
            style={{ marginTop: '10px', width: '100%', padding: '8px', background: '#eee', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
          >닫기</button>
        </div>
      )}
    </div>
  )
}

export default Collection
