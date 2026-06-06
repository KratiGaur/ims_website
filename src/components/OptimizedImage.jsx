import React from 'react';

function isRemoteAsset(src) {
  return /^(https?:)?\/\//.test(src);
}

function swapExtension(src, extension) {
  if (!src || isRemoteAsset(src) || src.startsWith('data:')) {
    return null;
  }

  const [path, query = ''] = src.split('?');
  const updatedPath = path.replace(/\.(png|jpe?g|webp|avif)$/i, `.${extension}`);

  if (updatedPath === path) {
    return null;
  }

  return query ? `${updatedPath}?${query}` : updatedPath;
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  pictureClassName,
  sizes = '100vw',
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  webpSrc,
  avifSrc,
  preferOptimizedFormats = false,
  imgStyle,
  ...rest
}) {
  const useDerivedFormats = preferOptimizedFormats || import.meta.env.PROD;
  const resolvedAvif = useDerivedFormats ? (avifSrc ?? swapExtension(src, 'avif')) : null;
  const resolvedWebp = useDerivedFormats ? (webpSrc ?? swapExtension(src, 'webp')) : null;
  const resolvedSrc = src ? encodeURI(src) : src;

  return (
    <picture className={pictureClassName}>
      {resolvedAvif ? <source srcSet={encodeURI(resolvedAvif)} type="image/avif" sizes={sizes} /> : null}
      {resolvedWebp ? <source srcSet={encodeURI(resolvedWebp)} type="image/webp" sizes={sizes} /> : null}
      <img
        src={resolvedSrc}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        className={className}
        style={imgStyle}
        {...rest}
      />
    </picture>
  );
}
