// Animation timing and easing tokens
// Reference: 08_animation_bible.md Section 3

export const DURATION = {
  instant:  0.01,
  fast:     0.15,
  normal:   0.3,
  smooth:   0.5,
  dramatic: 0.8,
} as const;

export const EASE = {
  out:         'power2.out',
  in:          'power2.in',
  inOut:       'power2.inOut',
  dramaticOut: 'power3.out',
  dramaticIn:  'power3.in',
  cameraMove:  'power3.inOut',
  bounce:      'back.out(1.4)',
  gentle:      'sine.inOut',
  cssOut:      'cubic-bezier(0.33, 1, 0.68, 1)',
  cssIn:       'cubic-bezier(0.32, 0, 0.67, 0)',
  cssInOut:    'cubic-bezier(0.65, 0, 0.35, 1)',
  cssBounce:   'cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const;

export const STAGGER = {
  fast:    0.05,
  normal:  0.08,
  relaxed: 0.12,
} as const;
