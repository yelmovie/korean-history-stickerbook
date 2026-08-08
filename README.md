# 한국사 스티커북: 시간여행 다이어리

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
