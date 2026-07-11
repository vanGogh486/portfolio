# Midnight Elevator — Branch Timing Analysis

## Intro Video (intro.mp4)
- Duration: 37.3s
- Choice UI first appears: ~20.4s (white text overlay visible)
- Red A special effect: ~26.6s
- **choiceTriggerTime set to: 20.1s** (pauses 0.3s before choice UI appears)

## Branch A (branch-a.mp4)
- Duration: 63.0s
- Does NOT contain intro sequence — plays from 0s directly into branch A
- First frame: opens directly from the door choice

## Branch B (branch-b.mp4)
- Duration: 65.3s
- Does NOT contain intro sequence — plays from 0s directly into branch B
- First frame: opens directly from the door choice

## Implementation Strategy
- **startTime jump approach**: Branch videos start from 0s — they are pure branch content
- Pause intro at 20.1s via timeupdate listener (not ended event)
- Show choice overlay ON TOP of paused intro frame
- Choice uses transparent click zones over video's built-in UI
- Branch loads via canplay event with 300ms crossfade from intro to branch
