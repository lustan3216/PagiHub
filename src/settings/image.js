import { select, string } from './util'

export default function() {
  return {
    basic: {
      fit: select('fit', {
        options: ['fill', 'contain', 'cover', 'none', 'scale-down']
      }),
      src: string('src', {
        value: 'https://placeimg.com/1320/840/any',
        validate: [{ type: 'url', message: '需選擇正確的網址' }]
      }),
      placeholder: string('placeholder', { value: 'placeholder' }),
      error: string('error', { value: 'error' })
    }
  }
}
