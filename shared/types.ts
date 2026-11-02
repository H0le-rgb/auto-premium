export type DemoTheme = 'tire' | 'garage' | 'electric' | 'detail' | 'shaft' | 'truck' | 'tuning' | 'neutral' | 'waste'

export type BusinessPhone = { label?: string; display: string; href: string }

export type BusinessData = {
  slug: string
  name: string
  eyebrow: string
  theme: DemoTheme
  headline: string
  description: string
  phones?: BusinessPhone[]
  services?: string[]
  note?: string
  accent: string
  background: string
  category: string
  layout?: string
}

export type DemoBusiness = BusinessData
