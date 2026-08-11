import type { Sticker } from '../types'

/** 시대별 10종 × 5시대 = 50종 (설계 JSON sticker_collection_plan 기준).
 *  icon은 에셋 카탈로그 확정 후 채운다. null이면 이름 칩으로 표시된다.
 *  모든 역사 설명 문장은 공식 자료(국가유산포털·국립중앙박물관·국사편찬위원회) 검수 대상. */
export const STICKERS: Sticker[] = [
  // ----- 선사 시대 -----
  { id: 'hand-axe', period: 'prehistoric', name: '주먹도끼', icon: 'i195', hintLine: '주먹도끼는 구석기 사람들이 사냥과 손질에 두루 쓰던 뗀석기이다.', contentReviewNeeded: true },
  { id: 'sumbe-point', period: 'prehistoric', name: '슴베찌르개', icon: 'i196', hintLine: '슴베찌르개는 자루에 꽂아 쓰던 구석기 시대의 뗀석기이다.', contentReviewNeeded: true },
  { id: 'comb-pottery', period: 'prehistoric', name: '빗살무늬 토기', icon: 'i043', hintLine: '빗살무늬 토기는 신석기 사람들이 음식을 저장하고 조리하는 데 쓴 것으로 보이는 토기이다.', contentReviewNeeded: true },
  { id: 'spindle-whorl', period: 'prehistoric', name: '가락바퀴', icon: 'i118', hintLine: '가락바퀴는 실을 뽑을 때 쓰던 신석기 시대 도구이다.', contentReviewNeeded: true },
  { id: 'bone-needle', period: 'prehistoric', name: '뼈바늘', icon: 'i119', hintLine: '뼈바늘은 가죽이나 옷감을 꿰매는 데 쓰던 도구이다.', contentReviewNeeded: true },
  { id: 'polished-stone', period: 'prehistoric', name: '간석기', icon: 'i202', hintLine: '간석기는 돌을 갈아 만든 도구로 신석기 시대부터 널리 쓰였다.', contentReviewNeeded: true },
  { id: 'half-moon-knife', period: 'prehistoric', name: '반달돌칼', icon: 'i201', hintLine: '반달돌칼은 곡식의 이삭을 자르는 데 쓰던 청동기 시대 도구이다.', contentReviewNeeded: true },
  { id: 'bipa-dagger', period: 'prehistoric', name: '비파형 동검', icon: 'i203', hintLine: '비파형 동검은 비파를 닮은 모양의 청동기 시대 검이다.', contentReviewNeeded: true },
  { id: 'dolmen', period: 'prehistoric', name: '고인돌', icon: 'i005', hintLine: '고인돌은 청동기 시대 지배층의 무덤으로 알려진 큰 돌 무덤이다.', contentReviewNeeded: true },
  // ----- 삼국·통일신라 -----
  { id: 'goguryeo-mural', period: 'threeKingdoms', name: '고구려 고분벽화', icon: 'i057', hintLine: '고구려 고분벽화에는 당시 사람들의 생활과 생각이 그림으로 남아 있다.', contentReviewNeeded: true },
  { id: 'gwanggaeto-stele', period: 'threeKingdoms', name: '광개토대왕릉비', icon: 'i204', hintLine: '광개토대왕릉비는 광개토대왕의 업적을 네 면에 빼곡히 새긴 고구려의 커다란 비석이다.', contentReviewNeeded: true, sourceNote: '사진은 국립문화유산연구원 국가유산 지식이음의 비석 실물 사진(공공누리 제1유형)' },
  { id: 'baekje-incense-burner', period: 'threeKingdoms', name: '백제 금동대향로', icon: 'i206', hintLine: '백제 금동대향로는 백제의 섬세한 공예 기술을 보여 주는 향로이다.', contentReviewNeeded: true },
  { id: 'muryeong-ornament', period: 'threeKingdoms', name: '무령왕 금제관식', icon: 'i207', hintLine: '무령왕릉에서 나온 금제관식은 백제 왕실의 화려한 문화를 보여 준다.', contentReviewNeeded: true },
  { id: 'silla-crown', period: 'threeKingdoms', name: '신라 금관', icon: 'i209', hintLine: '신라 금관은 신라 왕의 권위를 보여 주는 금으로 만든 관이다.', contentReviewNeeded: true },
  { id: 'cheomseongdae', period: 'threeKingdoms', name: '첨성대', icon: 'i125', hintLine: '첨성대는 신라 시대에 하늘을 관측한 것과 관련된 건축물로 알려져 있다.', contentReviewNeeded: true },
  { id: 'bulguksa', period: 'threeKingdoms', name: '불국사', icon: 'i126', hintLine: '불국사는 통일신라 불교문화를 대표하는 경주의 절이다.', contentReviewNeeded: true },
  { id: 'seokguram', period: 'threeKingdoms', name: '석굴암', icon: 'i055', hintLine: '석굴암은 돌을 쌓아 만든 인공 석굴 안에 불상을 모신 통일신라 유산이다.', contentReviewNeeded: true },
  { id: 'dabotap', period: 'threeKingdoms', name: '다보탑', icon: 'i127', hintLine: '다보탑은 불국사에 있는 화려하고 독특한 모양의 석탑이다.', contentReviewNeeded: true },
  { id: 'seokgatap', period: 'threeKingdoms', name: '석가탑', icon: 'i128', hintLine: '석가탑은 불국사에 있는 단정하고 균형 잡힌 삼층 석탑이다.', contentReviewNeeded: true },
  // ----- 고려 시대 -----
  { id: 'goryeo-celadon', period: 'goryeo', name: '고려청자', icon: 'i004', hintLine: '고려청자는 아름다운 빛깔과 상감기법으로 고려의 공예 수준을 보여 준다.', contentReviewNeeded: true },
  { id: 'celadon-maebyeong', period: 'goryeo', name: '청자 상감운학문 매병', icon: 'i214', hintLine: '청자 상감운학문 매병은 구름과 학 무늬를 상감기법으로 새긴 대표적인 고려청자이다.', contentReviewNeeded: true },
  { id: 'celadon-melon', period: 'goryeo', name: '청자 참외모양 병', icon: 'i129', hintLine: '청자 참외모양 병은 참외 모양을 본떠 만든 고려청자이다.', contentReviewNeeded: true },
  { id: 'tripitaka', period: 'goryeo', name: '팔만대장경', icon: 'i220', hintLine: '팔만대장경은 부처의 힘으로 나라의 어려움을 이겨 내려는 뜻에서 새긴 것으로 알려진 목판이다.', contentReviewNeeded: true },
  { id: 'janggyeong-panjeon', period: 'goryeo', name: '해인사 장경판전', icon: 'i065', hintLine: '장경판전은 팔만대장경 목판을 잘 보존하도록 지은 건물이다.', contentReviewNeeded: true },
  { id: 'metal-type', period: 'goryeo', name: '금속활자', icon: 'i147', hintLine: '금속활자는 금속으로 글자를 만들어 책을 찍는 인쇄 기술이다.', contentReviewNeeded: true },
  { id: 'jikji', period: 'goryeo', name: '직지', icon: 'i130', hintLine: '직지는 현재 남아 있는 금속활자 인쇄본 가운데 세계에서 가장 오래된 책으로 알려져 있다.', contentReviewNeeded: true },
  { id: 'goryeo-painting', period: 'goryeo', name: '고려 불화', icon: 'i219', hintLine: '고려 불화는 고려 시대 불교문화의 섬세한 아름다움을 보여 주는 그림이다.', contentReviewNeeded: true },
  { id: 'bronze-hyangwan', period: 'goryeo', name: '청동 은입사 향완', icon: 'i132', hintLine: '청동 은입사 향완은 청동에 은실로 무늬를 넣어 만든 고려의 향로이다.', contentReviewNeeded: true },
  { id: 'manwoldae', period: 'goryeo', name: '개성 만월대', icon: 'i133', hintLine: '만월대는 고려의 도읍 개경에 있던 궁궐 터이다.', contentReviewNeeded: true },
  // ----- 조선 시대 -----
  { id: 'hunminjeongeum', period: 'joseon', name: '훈민정음 해례본', icon: 'i070', hintLine: '훈민정음 해례본은 세종이 만든 글자의 원리와 사용법을 설명한 책이다.', contentReviewNeeded: true },
  { id: 'sillok', period: 'joseon', name: '조선왕조실록', icon: 'i233', hintLine: '조선왕조실록은 조선 왕들의 시대에 있었던 일을 날마다 적어 남긴 아주 많은 분량의 역사책이다.', contentReviewNeeded: true },
  { id: 'cheugugi', period: 'joseon', name: '측우기', icon: 'i225', hintLine: '측우기는 비가 내린 양을 재어 농사에 도움을 주고자 만든 기구이다.', contentReviewNeeded: true },
  { id: 'jagyeongnu', period: 'joseon', name: '자격루', icon: 'i073', hintLine: '자격루는 물의 힘으로 스스로 시각을 알려 주던 물시계이다.', contentReviewNeeded: true },
  { id: 'angbuilgu', period: 'joseon', name: '앙부일구', icon: 'i224', hintLine: '앙부일구는 해의 그림자로 시각을 읽던 해시계이다.', contentReviewNeeded: true },
  { id: 'honcheonui', period: 'joseon', name: '혼천의', icon: 'i223', hintLine: '혼천의는 해와 달, 별의 움직임을 관측하기 위해 만든 기구이다.', contentReviewNeeded: true },
  { id: 'geobukseon', period: 'joseon', name: '거북선', icon: 'i003', hintLine: '거북선은 임진왜란 때 활약한 것으로 알려진 조선의 배이다.', contentReviewNeeded: true },
  { id: 'donguibogam', period: 'joseon', name: '동의보감', icon: 'i234', hintLine: '동의보감은 허준이 정리한 조선의 의학 책이다.', contentReviewNeeded: true },
  { id: 'daedongyeojido', period: 'joseon', name: '대동여지도', icon: 'i235', hintLine: '대동여지도는 김정호가 만든 조선의 상세한 전국 지도이다.', contentReviewNeeded: true },
  { id: 'moon-jar', period: 'joseon', name: '백자 달항아리', icon: 'i145', hintLine: '백자 달항아리는 둥근 달을 닮은 조선의 흰 도자기이다.', contentReviewNeeded: true },
  // ----- 근현대 -----
  { id: 'independent-news', period: 'modern', name: '독립신문', icon: 'i236', hintLine: '독립신문은 한글로 소식을 전하며 자주 독립 의식을 높이고자 한 신문이다.', contentReviewNeeded: true },
  { id: 'taegeukgi', period: 'modern', name: '태극기', icon: 'i229', hintLine: '태극기는 우리나라를 상징하는 국기로, 독립운동에서도 중요한 상징이었다.', contentReviewNeeded: true },
  { id: 'declaration', period: 'modern', name: '독립선언서', icon: 'i237', hintLine: '독립선언서는 3·1운동 때 우리 민족의 독립 의지를 세계에 알린 글이다.', contentReviewNeeded: true },
  { id: 'ahn-calligraphy', period: 'modern', name: '안중근 의사 유묵', icon: 'i137', hintLine: '안중근 의사 유묵은 안중근 의사가 남긴 붓글씨이다.', contentReviewNeeded: true },
  { id: 'yu-record', period: 'modern', name: '유관순 열사 기록', icon: 'i138', hintLine: '유관순 열사 기록은 3·1운동에 참여한 유관순 열사와 관련된 자료이다.', contentReviewNeeded: true },
  { id: 'provisional-gov', period: 'modern', name: '대한민국 임시정부 청사', icon: 'i081', hintLine: '대한민국 임시정부는 3·1운동 이후 독립운동을 이끌기 위해 세워졌다.', contentReviewNeeded: true },
  { id: 'gwangbok-record', period: 'modern', name: '광복 기념 자료', icon: 'i139', hintLine: '1945년 광복으로 우리 민족은 일제의 지배에서 벗어났다.', contentReviewNeeded: true },
  { id: 'war-record', period: 'modern', name: '6·25 전쟁 기록 자료', icon: 'i140', hintLine: '6·25 전쟁 기록은 전쟁의 아픔과 평화의 소중함을 알려 주는 자료이다.', contentReviewNeeded: true },
  { id: 'donghak-flag', period: 'modern', name: '동학농민운동 깃발', icon: 'i141', hintLine: '동학농민운동은 낡은 제도를 고치고자 농민들이 일으킨 운동이다.', contentReviewNeeded: true },
  { id: 'daehan-doc', period: 'modern', name: '대한제국 문서', icon: 'i142', hintLine: '대한제국 문서는 대한제국 시기의 나라 운영을 보여 주는 기록이다.', contentReviewNeeded: true },
]

/** 꾸미기 전용 스티커. 학습 보상이 아니라 처음부터 열려 있고,
 *  "모은 스티커 n/m" 집계(STICKERS)에는 들어가지 않는다. */
export const DECO_STICKERS: Sticker[] = [
  // ----- 선사 -----
  { id: 'deco-shell-necklace', period: 'prehistoric', name: '조개 목걸이', icon: 'i200', hintLine: '조개껍데기에 구멍을 뚫어 꿴 장신구예요. 조개더미 유적에서 함께 나와요.' },
  { id: 'deco-grinding-stone', period: 'prehistoric', name: '갈돌과 갈판', icon: 'i198', hintLine: '곡식이나 도토리를 갈아 먹던 도구예요.' },
  { id: 'deco-pit-house', period: 'prehistoric', name: '움집', icon: 'i183', hintLine: '땅을 파고 지은 집이에요. 한곳에 머물러 살기 시작했다는 뜻이지요.' },
  { id: 'deco-bone-harpoon', period: 'prehistoric', name: '뼈작살', icon: 'i199', hintLine: '뼈를 갈아 만든 작살로 물고기를 잡았어요.' },
  { id: 'deco-petroglyph', period: 'prehistoric', name: '바위그림', icon: 'i175', hintLine: '바위에 새긴 그림에는 그때 사람들이 무엇을 잡고 살았는지 담겨 있어요.' },
  // ----- 삼국·통일신라 -----
  { id: 'deco-roof-tile', period: 'threeKingdoms', name: '연꽃무늬 수막새', icon: 'i161', hintLine: '기와 끝을 막던 수막새에는 연꽃무늬가 자주 쓰였어요.' },
  { id: 'deco-gogok', period: 'threeKingdoms', name: '곡옥', icon: 'i162', hintLine: '굽은 옥은 목걸이나 금관을 꾸미는 데 쓰였어요.' },
  { id: 'deco-cheonmado', period: 'threeKingdoms', name: '천마 그림', icon: 'i210', hintLine: '하늘을 달리는 말 그림에는 옛사람들의 바람이 담겨 있어요.' },
  { id: 'deco-cloud-gold', period: 'threeKingdoms', name: '단청 구름무늬', icon: 'i169', hintLine: '고분벽화와 단청에는 흐르는 구름무늬가 자주 등장해요.' },
  { id: 'deco-gilt-buddha', period: 'threeKingdoms', name: '금동 불상', icon: 'i205', hintLine: '삼국은 불교를 받아들이며 금동으로 불상을 만들었어요.' },
  { id: 'deco-pensive-bodhisattva', period: 'threeKingdoms', name: '금동 반가사유상', icon: 'i208', hintLine: '한쪽 다리를 올리고 깊이 생각하는 모습의 불상이에요.' },
  { id: 'deco-three-kingdoms-pot', period: 'threeKingdoms', name: '삼국 토기', icon: 'i211', hintLine: '굽다리가 있는 회색 토기는 삼국 시대 무덤에서 자주 나와요.' },
  { id: 'deco-gwimyeon-tile', period: 'threeKingdoms', name: '귀면 기와', icon: 'i212', hintLine: '무서운 얼굴을 새겨 나쁜 기운을 막으려 한 기와예요.' },
  { id: 'deco-divine-bell', period: 'threeKingdoms', name: '성덕대왕 신종', icon: 'i213', hintLine: '통일신라의 큰 종이에요. 맑고 긴 울림으로 이름났어요.' },
  // ----- 고려 -----
  { id: 'deco-lotus', period: 'goryeo', name: '연꽃', icon: 'i166', hintLine: '연꽃은 불교 문화가 널리 퍼지면서 즐겨 쓰인 무늬예요.' },
  { id: 'deco-celadon-medallion', period: 'goryeo', name: '국화무늬 청자판', icon: 'i167', hintLine: '상감으로 국화무늬를 새겨 넣은 청자의 빛깔이에요.' },
  { id: 'deco-najeon-box', period: 'goryeo', name: '나전칠기 상자', icon: 'i218', hintLine: '조개껍데기를 얇게 갈아 붙여 무늬를 낸 공예품이에요.' },
  { id: 'deco-cloud-jade', period: 'goryeo', name: '비색 구름무늬', icon: 'i164', hintLine: '청자의 푸른빛을 닮은 구름무늬예요.' },
  { id: 'deco-duck-dropper', period: 'goryeo', name: '청자 오리 연적', icon: 'i216', hintLine: '오리 모양으로 빚은 청자예요. 붓글씨를 쓸 때 물을 따르던 그릇이지요.' },
  { id: 'deco-bronze-mirror', period: 'goryeo', name: '청동 거울', icon: 'i222', hintLine: '뒷면에 무늬를 새긴 청동 거울이에요. 무덤에서 자주 나와요.' },
  { id: 'deco-celadon-censer', period: 'goryeo', name: '청자 향로', icon: 'i215', hintLine: '뚫어 새긴 무늬 사이로 향 연기가 피어오르게 만든 청자예요.' },
  { id: 'deco-celadon-ewer', period: 'goryeo', name: '청자 주전자', icon: 'i217', hintLine: '물이나 술을 담아 따르던 청자 주전자예요.' },
  { id: 'deco-stone-pagoda', period: 'goryeo', name: '다층 석탑', icon: 'i221', hintLine: '층을 여러 겹 쌓아 올린 고려의 석탑이에요.' },
  // ----- 조선 -----
  { id: 'deco-brush', period: 'joseon', name: '붓', icon: 'i168', hintLine: '붓과 먹으로 글을 쓰고 그림을 그렸어요.' },
  { id: 'deco-inkstone', period: 'joseon', name: '벼루', icon: 'i178', hintLine: '먹을 갈아 쓰던 벼루예요. 글과 그림이 여기에서 시작됐어요.' },
  { id: 'deco-geojunggi', period: 'joseon', name: '거중기', icon: 'i170', hintLine: '무거운 돌을 적은 힘으로 들어 올리던 기구예요.' },
  { id: 'deco-seal', period: 'joseon', name: '도장', icon: 'i173', hintLine: '이름을 새긴 도장을 찍어 문서를 확인했어요.' },
  { id: 'deco-knot', period: 'joseon', name: '매듭', icon: 'i172', hintLine: '실을 엮어 만든 매듭으로 옷과 물건을 꾸몄어요.' },
  { id: 'deco-gat', period: 'joseon', name: '갓', icon: 'i187', hintLine: '말총으로 짜서 비쳐 보이는 조선 선비의 모자예요.' },
  { id: 'deco-jogakbo', period: 'joseon', name: '조각보', icon: 'i188', hintLine: '자투리 천을 이어 만든 보자기예요. 아끼는 마음이 무늬가 되었지요.' },
  { id: 'deco-fan', period: 'joseon', name: '합죽선', icon: 'i189', hintLine: '대나무와 한지로 만든 접부채예요. 그림과 글씨를 담기도 했어요.' },
  { id: 'deco-buncheong', period: 'joseon', name: '분청사기', icon: 'i227', hintLine: '청자에서 백자로 넘어가던 시기에 만든 소박한 그릇이에요.' },
  { id: 'deco-blue-white', period: 'joseon', name: '청화백자', icon: 'i228', hintLine: '흰 바탕에 푸른 물감으로 무늬를 그려 넣은 백자예요.' },
  // ----- 근현대 -----
  { id: 'deco-independence-gate', period: 'modern', name: '독립문', icon: 'i230', hintLine: '자주 독립의 뜻을 담아 세운 문이에요.' },
  { id: 'deco-stamp-paper', period: 'modern', name: '옛 우표', icon: 'i174', hintLine: '우표 한 장에도 그때의 풍경이 남아 있어요.' },
  { id: 'deco-filmstrip', period: 'modern', name: '필름', icon: 'i180', hintLine: '사진과 영상으로 그때의 모습을 남길 수 있게 됐어요.' },
  { id: 'deco-postbox', period: 'modern', name: '우체통', icon: 'i190', hintLine: '우편 제도가 생기면서 멀리 소식을 주고받게 됐어요.' },
  { id: 'deco-camera', period: 'modern', name: '옛 사진기', icon: 'i191', hintLine: '사진기가 들어오면서 그날의 모습을 그대로 남길 수 있었어요.' },
  { id: 'deco-radio', period: 'modern', name: '라디오', icon: 'i231', hintLine: '방송을 통해 온 나라가 같은 소식을 함께 듣게 됐어요.' },
  { id: 'deco-fountain-pen', period: 'modern', name: '만년필', icon: 'i193', hintLine: '붓 대신 펜으로 쓰게 되면서 글 쓰는 모습이 달라졌어요.' },
  { id: 'deco-school-bell', period: 'modern', name: '학교 종', icon: 'i194', hintLine: '학교가 세워지면서 정해진 시간에 함께 배우기 시작했어요.' },
  { id: 'deco-television', period: 'modern', name: '텔레비전', icon: 'i232', hintLine: '텔레비전이 들어오면서 소식과 이야기를 함께 보게 됐어요.' },
]

export const stickerById = new Map([...STICKERS, ...DECO_STICKERS].map((s) => [s.id, s]))
