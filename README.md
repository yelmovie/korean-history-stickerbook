# 한국사 스티커북: 시간여행 다이어리

**배포 주소**: https://korean-history-stickerbook.vercel.app
(저장은 브라우저 origin별로 분리된다 — Production 주소와 Preview 주소는 저장이 서로 이어지지 않으니, 학생에게는 위 Production 주소만 안내할 것)

초등 5~6학년(4학년 심화)용 한국사 탐구 학습 웹앱.
유물·유적·기록 자료를 **관찰하고, 근거를 고르고, 시대에 배치하고, 순서를 배열하며** 스티커를 모아 나만의 역사 다이어리를 완성한다.

## 실행 방법

```bash
npm install
npm run dev      # 개발 서버 (http://localhost:5173)
npm run build    # 프로덕션 빌드 → dist/
npm run preview  # 빌드 결과 미리보기
```

교사용 전체 해금: `http://localhost:5173/?unlock=all`

## 화면 구성 (10)

1. 메인 → 2. 스테이지 선택 → 3~7. 시대별 스테이지(선사/삼국/고려/조선/근현대) → 8. 다이어리 꾸미기 → 9. 다이어리 전시 → 10. 수료

스테이지 상호작용: 관찰 포인트+근거 선택, 드래그 시대·지역 배치, 선잇기, 청자 복원 퍼즐, 사건 순서 배열. 전부 React Pointer Events + SVG + CSS (Phaser 미사용).

## 구조

```
src/
  pages/       10개 화면 (스테이지 5개는 StagePage 하나가 데이터로 처리)
  components/  공통 UI + questions/ 문제 유형별 상호작용 5종
  data/        questions.ts(문제은행) stickers.ts(스티커 50종) stages.ts assets.ts(에셋 경로 단일 관리)
  utils/       storage.ts(저장) audio.ts(BGM/SFX)
  styles/      tokens/layout/components/pages.css (16:9 레터박스, cqw 단위)
public/assets/ opt/(webp 최적화 에셋) sound/(BGM·SFX) CREDITS.md
source-assets/ 원본 PNG (배포 제외, .gitignore)
docs/          설계 JSON, 에셋 카탈로그, 역사 검수 목록
scripts/       optimize_assets.py (원본 → webp 파이프라인)
```

## 저장 구조

localStorage 단일 키 `kh_stickerbook_save_v1` (version 필드 포함):
완료 스테이지, 획득 스티커, 문항별 첫 시도 결과, 다이어리 배치(0~1 비율 좌표), 설정.
JSON 손상 시 안전 기본값으로 복구하고 안내 모달을 띄운다.

## 역사 사실 검수

문제·스티커 설명 전체가 `contentReviewNeeded` 플래그로 표시되어 있다.
배포 전 [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md)를 국가유산포털·국립중앙박물관·국사편찬위원회 자료로 검수할 것.

## 문서

| 문서 | 내용 |
|---|---|
| [docs/MAKING.md](docs/MAKING.md) | **제작기** — 날짜별로 무엇을 어떻게 만들었는지 (근거: 커밋 이력) |
| [docs/IMPROVEMENTS.md](docs/IMPROVEMENTS.md) | **기능향상기** — 한 번 만든 것을 왜 다시 고쳤는지 |
| [docs/KOGL-AUDIT.md](docs/KOGL-AUDIT.md) | 실물 사진 40장의 공공누리 유형 전수 감사 |
| [docs/CONTENT-REVIEW.md](docs/CONTENT-REVIEW.md) | 역사 사실 검수 목록 (사람 확인 필요 항목 포함) |
| [public/assets/CREDITS.md](public/assets/CREDITS.md) | 에셋 출처 기록 |
| [source-assets/README.md](source-assets/README.md) | 원본 보관소 분류 기준과 되돌리는 법 |

## 저작권

기획·제작: **옐샘 · 아이스크림미디어** · 제공: **issamGPT AI Mart**

ⓒ 2026 옐샘 · 아이스크림미디어. 이용 조건은 issamGPT 이용약관을 따른다.

- **앱 화면 캡처 이미지와 앱 안의 배경·캐릭터·스티커 일러스트, 음원은 저작권 보호를 받는다.** 내려받아 재배포하거나, 다른 자료·서비스에 옮겨 쓰거나, 상업적으로 이용할 수 없다.
- 실물 유물 사진의 저작권은 각 소장 기관에 있으며, **공공누리 제1유형** 조건에 따라 출처를 표시하고 사용한다. 이 사진들의 이용 조건은 각 기관의 공공누리 표시를 따른다. 유형별 확인 근거는 [docs/KOGL-AUDIT.md](docs/KOGL-AUDIT.md).
- 배경·캐릭터·스티커 일러스트와 음원은 생성형 AI 로 제작한 교육용 자료다. 실제 유물 사진이 아니다.
- 본문 글꼴 Jua 는 SIL Open Font License 로 셀프호스팅한다.
- 같은 표기가 앱 안 **설정 → ⓘ 정보**에도 나온다.
