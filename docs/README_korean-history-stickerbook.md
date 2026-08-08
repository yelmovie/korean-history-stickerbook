# Korean History Stickerbook: Time-Travel Diary

An interactive Korean history learning web app where students collect artifact, heritage, and historical record stickers while completing their own history diary.

## Overview

**Korean History Stickerbook: Time-Travel Diary** is an upper-elementary educational web app designed for inquiry-based Korean history learning. Instead of simple name-matching quizzes, students observe historical artifacts, interpret clues, connect evidence, place items on timelines, solve restoration puzzles, and organize their learning into a personal history diary.

The project is built as a lightweight classroom-friendly MVP that can run without a backend. Student progress, collected stickers, and diary layouts are stored locally in the browser.

## Target Learners

- Upper elementary students
- Recommended for Grades 5–6
- Also suitable for advanced Grade 4 history enrichment activities

## Core Learning Goals

Students will practice how to:

- Observe artifacts and identify useful evidence
- Connect historical objects with their period and purpose
- Compare artifacts from different eras
- Interpret short historical records and visual clues
- Arrange events in chronological order
- Explain historical meaning with short written responses
- Create and present a personal history diary

## Main Features

### 1. Time-Travel Main Screen

Students enter the story world as young history explorers and begin their mission to collect lost historical stickers.

### 2. Stage Selection

Five historical stages guide students through the overall flow of Korean history:

1. Prehistoric Museum
2. Three Kingdoms Heritage Exploration
3. Goryeo Treasure Restoration Lab
4. Joseon Invention Research Lab
5. Modern History Archive

### 3. Interactive Stage Missions

Each stage uses a different activity style:

- Artifact observation
- Evidence selection
- Timeline placement
- Map-based heritage exploration
- Drag-and-drop matching
- Line-connecting tasks
- Puzzle-style restoration
- Sequence ordering
- Short explanation writing

### 4. Sticker Collection

Students earn stickers by solving missions. Sticker categories include artifacts, heritage sites, historical records, inventions, people, events, and achievement badges.

### 5. History Diary Editor

Students place collected stickers into their own diary pages and complete short written explanations for each historical period.

### 6. Presentation and Completion

The completed diary can be reviewed in presentation mode. The final screen shows learning progress, collected stickers, and earned titles such as **Young History Curator**.

## Learning Design

This app avoids overly simple quiz patterns. The default question level focuses on:

- Evidence-based reasoning
- Comparison
- Historical context
- Cause-and-effect thinking
- Chronological understanding
- Short written justification

Example question types:

- “Which evidence best supports this artifact’s period?”
- “Why can this object be connected to settled life?”
- “What do these two cultural heritages have in common?”
- “Place these events in the correct order.”
- “Complete one sentence explaining why this item is historically important.”

## Technical Stack

Recommended MVP stack:

- React
- TypeScript
- Vite
- CSS-based UI components
- LocalStorage for progress saving
- Optional Phaser or Canvas for selected mini-games

## Stability Principles

This project is designed for long-term classroom use.

Key principles:

- No backend required for MVP
- Data-driven questions and sticker metadata
- Versioned localStorage save structure
- Asset manifest for safer image loading
- CSS-based buttons, cards, panels, and animations
- Fallback UI for missing assets
- Responsive 16:9 tablet-first layout
- Clear separation between data, components, pages, and assets

## Suggested Folder Structure

```text
src/
  components/
    AppButton.tsx
    Modal.tsx
    PaperCard.tsx
    StickerReward.tsx
    StageHeader.tsx
    ResultPanel.tsx

  pages/
    MainPage.tsx
    StageSelectPage.tsx
    Stage1PrehistoryPage.tsx
    Stage2ThreeKingdomsPage.tsx
    Stage3GoryeoPage.tsx
    Stage4JoseonPage.tsx
    Stage5ModernPage.tsx
    DiaryEditorPage.tsx
    DiaryShowcasePage.tsx
    CompletionPage.tsx

  data/
    assetManifest.ts
    questions.ts
    stickers.ts
    stages.ts

  utils/
    storage.ts
    audio.ts
    asset.ts
    clamp.ts

  styles/
    tokens.css
    layout.css
    components.css
    stages.css
```

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Preview

```bash
npm run preview
```

## Classroom Use

A suggested 40-minute lesson flow:

1. Introduce the mission: “Use evidence to understand history.”
2. Complete artifact and heritage missions.
3. Solve restoration and invention challenges.
4. Arrange modern historical events.
5. Decorate the history diary.
6. Present one selected artifact or event with a reason.

## Content Review Note

Historical explanations should be reviewed against reliable official sources before classroom release. Recommended review sources include national heritage, museum, and history education references.

## License

This project is intended for educational use. Add a specific license before public distribution.
