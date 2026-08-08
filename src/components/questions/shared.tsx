/** 문제 유형 컴포넌트들이 공유하는 선택지 그리드 + 힌트 말풍선 */

interface ChoiceListProps {
  choices: string[]
  wrongPicks: number[]
  onPick: (index: number) => void
  disabled?: boolean
}

export function ChoiceList({ choices, wrongPicks, onPick, disabled }: ChoiceListProps) {
  return (
    <div className="choice-list">
      {choices.map((c, i) => (
        <button
          key={c}
          type="button"
          className={`choice-item ${wrongPicks.includes(i) ? 'choice-item--wrong' : ''}`}
          onClick={() => onPick(i)}
          disabled={wrongPicks.includes(i) || disabled}
        >
          <span className="choice-item__num">{i + 1}</span>
          <span>{c}</span>
          {wrongPicks.includes(i) && <span aria-label="오답">✕</span>}
        </button>
      ))}
    </div>
  )
}

export function HintBubble({ msg }: { msg: string | null }) {
  if (!msg) return null
  return (
    <div className="hint-bubble" role="status">
      💡 {msg}
    </div>
  )
}
