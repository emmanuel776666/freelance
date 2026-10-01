/**
 * Circular avatar with an initials fallback.
 *
 * The marketplace is seeded with remote placeholder images (pravatar.cc), which
 * means an image can fail to load in an offline environment. Rather than
 * tracking a load state for every avatar in the app, this component renders the
 * image and lets CSS fall back to the initials text underneath it.
 */
interface AvatarProps {
  /** Remote image URL. When omitted the initials are shown instead. */
  src?: string
  /** Accessible label. Also used to derive fallback initials. */
  alt: string
  /** Explicit fallback text, e.g. a client's pre-computed initials. */
  initials?: string
  /** Maps to an `avatar-{size}` CSS class that sets the box dimensions. */
  size?: 'tiny' | 'small' | 'medium' | 'large' | 'xlarge' | 'xxlarge'
}

function Avatar({ src, alt, initials, size = 'medium' }: AvatarProps) {
  // Prefer explicit initials; otherwise derive them from the first two letters
  // of the alt text so every caller still gets a sensible fallback for free.
  const fallback = initials || alt.slice(0, 2).toUpperCase()

  return (
    <span className={`avatar avatar-${size}`}>
      {/* Initials sit behind the image so a broken/unloaded image degrades
          gracefully instead of rendering an empty circle. */}
      <span>{fallback}</span>
      {src ? <img src={src} alt={alt} /> : null}
    </span>
  )
}

export default Avatar
