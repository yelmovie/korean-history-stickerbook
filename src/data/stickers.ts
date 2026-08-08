import type { Sticker } from '../types'

/** 시대별 10종 × 5시대 = 50종 (설계 JSON sticker_collection_plan 기준).
 *  icon은 에셋 카탈로그 확정 후 채운다. null이면 이름 칩으로 표시된다.
 *  모든 역사 설명 문장은 공식 자료(국가유산포털·국립중앙박물관·국사편찬위원회) 검수 대상. */
export const STICKERS: Sticker[] = [
  // ----- 선사 시대 -----
  { id: 'hand-axe', period: 'prehistoric', name: '주먹도끼', icon: 'i042', hintLine: '주먹도끼는 구석기 사람들이 사냥과 손질에 두루 쓰던 뗀석기이다.', contentReviewNeeded: true },
  { id: 'sumbe-point', period: 'prehistoric', name: '슴베찌르개', icon: null, hintLine: '슴베찌르개는 자루에 꽂아 쓰던 구석기 시대의 뗀석기이다.', contentReviewNeeded: true },
  { id: 'comb-pottery', period: 'prehistoric', name: '빗살무늬 토기', icon: 'i043', hintLine: '빗살무늬 토기는 신석기 사람들이 음식을 저장하고 조리하는 데 쓴 것으로 보이는 토기이다.', contentReviewNeeded: true },
  { id: 'spindle-whorl', period: 'prehistoric', name: '가락바퀴', icon: null, hintLine: '가락바퀴는 실을 뽑을 때 쓰던 신석기 시대 도구이다.', contentReviewNeeded: true },
  { id: 'bone-needle', period: 'prehistoric', name: '뼈바늘', icon: null, hintLine: '뼈바늘은 가죽이나 옷감을 꿰매는 데 쓰던 도구이다.', contentReviewNeeded: true },
  { id: 'polished-stone', period: 'prehistoric', name: '간석기', icon: null, hintLine: '간석기는 돌을 갈아 만든 도구로 신석기 시대부터 널리 쓰였다.', contentReviewNeeded: true },
  { id: 'plain-pottery', period: 'prehistoric', name: '민무늬 토기', icon: null, hintLine: '민무늬 토기는 청동기 시대에 널리 쓰인 무늬 없는 토기이다.', contentReviewNeeded: true },
  { id: 'half-moon-knife', period: 'prehistoric', name: '반달돌칼', icon: null, hintLine: '반달돌칼은 곡식의 이삭을 자르는 데 쓰던 청동기 시대 도구이다.', contentReviewNeeded: true },
  { id: 'bipa-dagger', period: 'prehistoric', name: '비파형 동검', icon: null, hintLine: '비파형 동검은 비파를 닮은 모양의 청동기 시대 검이다.', contentReviewNeeded: true },
  { id: 'dolmen', period: 'prehistoric', name: '고인돌', icon: 'i005', hintLine: '고인돌은 청동기 시대 지배층의 무덤으로 알려진 큰 돌 무덤이다.', contentReviewNeeded: true },
  // ----- 삼국·통일신라 -----
  { id: 'goguryeo-mural', period: 'threeKingdoms', name: '고구려 고분벽화', icon: 'i057', hintLine: '고구려 고분벽화에는 당시 사람들의 생활과 생각이 그림으로 남아 있다.', contentReviewNeeded: true },
  { id: 'gwanggaeto-stele', period: 'threeKingdoms', name: '광개토대왕릉비', icon: null, hintLine: '광개토대왕릉비는 고구려 광개토대왕의 업적을 기록한 비석이다.', contentReviewNeeded: true },
  { id: 'baekje-incense-burner', period: 'threeKingdoms', name: '백제 금동대향로', icon: 'i052', hintLine: '백제 금동대향로는 백제의 섬세한 공예 기술을 보여 주는 향로이다.', contentReviewNeeded: true },
  { id: 'muryeong-ornament', period: 'threeKingdoms', name: '무령왕 금제관식', icon: null, hintLine: '무령왕릉에서 나온 금제관식은 백제 왕실의 화려한 문화를 보여 준다.', contentReviewNeeded: true },
  { id: 'silla-crown', period: 'threeKingdoms', name: '신라 금관', icon: 'i053', hintLine: '신라 금관은 신라 왕의 권위를 보여 주는 금으로 만든 관이다.', contentReviewNeeded: true },
  { id: 'cheomseongdae', period: 'threeKingdoms', name: '첨성대', icon: null, hintLine: '첨성대는 신라 시대에 하늘을 관측한 것과 관련된 건축물로 알려져 있다.', contentReviewNeeded: true },
  { id: 'bulguksa', period: 'threeKingdoms', name: '불국사', icon: null, hintLine: '불국사는 통일신라 불교문화를 대표하는 경주의 절이다.', contentReviewNeeded: true },
  { id: 'seokguram', period: 'threeKingdoms', name: '석굴암', icon: 'i055', hintLine: '석굴암은 돌을 쌓아 만든 인공 석굴 안에 불상을 모신 통일신라 유산이다.', contentReviewNeeded: true },
  { id: 'dabotap', period: 'threeKingdoms', name: '다보탑', icon: null, hintLine: '다보탑은 불국사에 있는 화려하고 독특한 모양의 석탑이다.', contentReviewNeeded: true },
  { id: 'seokgatap', period: 'threeKingdoms', name: '석가탑', icon: null, hintLine: '석가탑은 불국사에 있는 단정하고 균형 잡힌 삼층 석탑이다.', contentReviewNeeded: true },
  // ----- 고려 시대 -----
  { id: 'goryeo-celadon', period: 'goryeo', name: '고려청자', icon: 'i004', hintLine: '고려청자는 아름다운 빛깔과 상감기법으로 고려의 공예 수준을 보여 준다.', contentReviewNeeded: true },
  { id: 'celadon-maebyeong', period: 'goryeo', name: '청자 상감운학문 매병', icon: 'i061', hintLine: '청자 상감운학문 매병은 구름과 학 무늬를 상감기법으로 새긴 대표적인 고려청자이다.', contentReviewNeeded: true },
  { id: 'celadon-melon', period: 'goryeo', name: '청자 참외모양 병', icon: null, hintLine: '청자 참외모양 병은 참외 모양을 본떠 만든 고려청자이다.', contentReviewNeeded: true },
  { id: 'tripitaka', period: 'goryeo', name: '팔만대장경', icon: 'i062', hintLine: '팔만대장경은 부처의 힘으로 나라의 어려움을 이겨 내고자 새긴 목판이다.', contentReviewNeeded: true },
  { id: 'janggyeong-panjeon', period: 'goryeo', name: '해인사 장경판전', icon: 'i065', hintLine: '장경판전은 팔만대장경 목판을 잘 보존하도록 지은 건물이다.', contentReviewNeeded: true },
  { id: 'metal-type', period: 'goryeo', name: '금속활자', icon: 'i063', hintLine: '금속활자는 금속으로 글자를 만들어 책을 찍는 인쇄 기술이다.', contentReviewNeeded: true },
  { id: 'jikji', period: 'goryeo', name: '직지', icon: null, hintLine: '직지는 현재 남아 있는 금속활자 인쇄본 가운데 세계에서 가장 오래된 책으로 알려져 있다.', contentReviewNeeded: true },
  { id: 'goryeo-painting', period: 'goryeo', name: '고려 불화', icon: null, hintLine: '고려 불화는 고려 시대 불교문화의 섬세한 아름다움을 보여 주는 그림이다.', contentReviewNeeded: true },
  { id: 'bronze-hyangwan', period: 'goryeo', name: '청동 은입사 향완', icon: null, hintLine: '청동 은입사 향완은 청동에 은실로 무늬를 넣어 만든 고려의 향로이다.', contentReviewNeeded: true },
  { id: 'manwoldae', period: 'goryeo', name: '개성 만월대', icon: null, hintLine: '만월대는 고려의 도읍 개경에 있던 궁궐 터이다.', contentReviewNeeded: true },
  // ----- 조선 시대 -----
  { id: 'hunminjeongeum', period: 'joseon', name: '훈민정음 해례본', icon: 'i070', hintLine: '훈민정음 해례본은 세종이 만든 글자의 원리와 사용법을 설명한 책이다.', contentReviewNeeded: true },
  { id: 'sillok', period: 'joseon', name: '조선왕조실록', icon: 'i028', hintLine: '조선왕조실록은 조선 왕들의 시대를 날마다 기록한 방대한 역사책이다.', contentReviewNeeded: true },
  { id: 'cheugugi', period: 'joseon', name: '측우기', icon: 'i071', hintLine: '측우기는 비가 내린 양을 재어 농사에 도움을 주고자 만든 기구이다.', contentReviewNeeded: true },
  { id: 'jagyeongnu', period: 'joseon', name: '자격루', icon: 'i073', hintLine: '자격루는 물의 힘으로 스스로 시각을 알려 주던 물시계이다.', contentReviewNeeded: true },
  { id: 'angbuilgu', period: 'joseon', name: '앙부일구', icon: 'i072', hintLine: '앙부일구는 해의 그림자로 시각을 읽던 해시계이다.', contentReviewNeeded: true },
  { id: 'honcheonui', period: 'joseon', name: '혼천의', icon: 'i021', hintLine: '혼천의는 해와 달, 별의 움직임을 관측하기 위해 만든 기구이다.', contentReviewNeeded: true },
  { id: 'geobukseon', period: 'joseon', name: '거북선', icon: 'i003', hintLine: '거북선은 임진왜란 때 활약한 것으로 알려진 조선의 배이다.', contentReviewNeeded: true },
  { id: 'donguibogam', period: 'joseon', name: '동의보감', icon: null, hintLine: '동의보감은 허준이 정리한 조선의 의학 책이다.', contentReviewNeeded: true },
  { id: 'daedongyeojido', period: 'joseon', name: '대동여지도', icon: null, hintLine: '대동여지도는 김정호가 만든 조선의 상세한 전국 지도이다.', contentReviewNeeded: true },
  { id: 'moon-jar', period: 'joseon', name: '백자 달항아리', icon: null, hintLine: '백자 달항아리는 둥근 달을 닮은 조선의 흰 도자기이다.', contentReviewNeeded: true },
  // ----- 근현대 -----
  { id: 'independent-news', period: 'modern', name: '독립신문', icon: null, hintLine: '독립신문은 한글로 소식을 전하며 자주 독립 의식을 높이고자 한 신문이다.', contentReviewNeeded: true },
  { id: 'taegeukgi', period: 'modern', name: '태극기', icon: 'i079', hintLine: '태극기는 우리나라를 상징하는 국기로, 독립운동에서도 중요한 상징이었다.', contentReviewNeeded: true },
  { id: 'declaration', period: 'modern', name: '독립선언서', icon: 'i080', hintLine: '독립선언서는 3·1운동 때 우리 민족의 독립 의지를 세계에 알린 글이다.', contentReviewNeeded: true },
  { id: 'ahn-calligraphy', period: 'modern', name: '안중근 의사 유묵', icon: null, hintLine: '안중근 의사 유묵은 안중근 의사가 남긴 붓글씨이다.', contentReviewNeeded: true },
  { id: 'yu-record', period: 'modern', name: '유관순 열사 기록', icon: null, hintLine: '유관순 열사 기록은 3·1운동에 참여한 유관순 열사와 관련된 자료이다.', contentReviewNeeded: true },
  { id: 'provisional-gov', period: 'modern', name: '대한민국 임시정부 청사', icon: 'i081', hintLine: '대한민국 임시정부는 3·1운동 이후 독립운동을 이끌기 위해 세워졌다.', contentReviewNeeded: true },
  { id: 'gwangbok-record', period: 'modern', name: '광복 기념 자료', icon: null, hintLine: '1945년 광복으로 우리 민족은 일제의 지배에서 벗어났다.', contentReviewNeeded: true },
  { id: 'war-record', period: 'modern', name: '6·25 전쟁 기록 자료', icon: null, hintLine: '6·25 전쟁 기록은 전쟁의 아픔과 평화의 소중함을 알려 주는 자료이다.', contentReviewNeeded: true },
  { id: 'donghak-flag', period: 'modern', name: '동학농민운동 깃발', icon: null, hintLine: '동학농민운동은 낡은 제도를 고치고자 농민들이 일으킨 운동이다.', contentReviewNeeded: true },
  { id: 'daehan-doc', period: 'modern', name: '대한제국 문서', icon: null, hintLine: '대한제국 문서는 대한제국 시기의 나라 운영을 보여 주는 기록이다.', contentReviewNeeded: true },
]

export const stickerById = new Map(STICKERS.map((s) => [s.id, s]))
