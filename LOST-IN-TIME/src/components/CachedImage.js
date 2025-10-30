import React, { memo } from 'react';
import { Image } from 'react-native';
import { useCachedImageSource } from '../hooks/useCachedImageSource';

function CachedImage({ uri, storagePath, updatedAt, cacheKey, style, ...props }) {
  const source = useCachedImageSource(uri, { storagePath, updatedAt, cacheKey });

  if (!source) {
    return null;
  }

  return <Image {...props} style={style} source={source} />;
}

export default memo(CachedImage);
