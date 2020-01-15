import {emojify} from './MarkdownRenderer';

describe('emojify', () => {
  it('should handle lots of emojis', () => {
    expect(
      emojify(
        'I :heart: :coffee:! - :hushed::star::heart_eyes: ::: test : : :+1:+',
      ),
    ).toBe('I ❤️ ☕️! - 😯⭐️😍 ::: test : : 👍+');
  });
  it('should handle emoji at start', () => {
    expect(emojify(':heart: eyes')).toBe('❤️ eyes');
  });

  it('should handle emoji at end', () => {
    expect(emojify('eyes :heart:')).toBe('eyes ❤️');
  });

  it('should leave incomplete emoji alone', () => {
    expect(emojify(':heart')).toBe(':heart');
  });

  it('should leave invalid emoji alone', () => {
    expect(emojify(':ljkasdadfsljfajkl:')).toBe(':ljkasdadfsljfajkl:');
  });

  it('should handle colon at start', () => {
    expect(emojify(': :heart: eyes')).toBe(': ❤️ eyes');
  });

  it('should handle colon at end', () => {
    expect(emojify(':heart: eyes :')).toBe('❤️ eyes :');
  });

  it('should allow colons', () => {
    expect(emojify('::')).toBe('::');
    expect(emojify(':::')).toBe(':::');
    expect(emojify('::::')).toBe('::::');
    expect(emojify(': : ')).toBe(': : ');
    expect(emojify(': : : ')).toBe(': : : ');
    expect(emojify(': : : : ')).toBe(': : : : ');

  });
});
