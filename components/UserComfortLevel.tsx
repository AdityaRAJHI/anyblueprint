import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"

interface UserComfortLevelProps {
  value: 'beginner' | 'intermediate' | 'advanced'
  onChange: (value: 'beginner' | 'intermediate' | 'advanced') => void
}

export default function UserComfortLevel({ value, onChange }: UserComfortLevelProps) {
  return (
    <div className="space-y-2">
      <Label>Your comfort level with development:</Label>
      <RadioGroup
        value={value}
        onValueChange={onChange as (value: string) => void}
        className="flex space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="beginner" id="beginner" />
          <Label htmlFor="beginner">Beginner</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="intermediate" id="intermediate" />
          <Label htmlFor="intermediate">Intermediate</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="advanced" id="advanced" />
          <Label htmlFor="advanced">Advanced</Label>
        </div>
      </RadioGroup>
    </div>
  )
}
