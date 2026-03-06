import { BubbleBackground } from '@/components/animate-ui/components/backgrounds/bubble'

export default function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <BubbleBackground
        interactive={true}
        className="absolute inset-0"
      />
      <div className="grid-overlay"></div>
      <div className="noise-overlay"></div>
    </div>
  )
}
