import { useEffect } from 'react';

/**
 * usePageMeta
 * ===========
 * Custom hook to dynamically update document head metadata
 * on route transition (SPA client side).
 */
export default function usePageMeta({ title, description, canonicalPath }) {
  useEffect(() => {
    // 1. Update title
    if (title) {
      document.title = title;
    }

    // 2. Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription && description) {
      metaDescription.setAttribute('content', description);
    }

    // 3. Update canonical link
    const canonical = document.querySelector('link[rel="canonical"]');
    if (canonical) {
      const fullUrl = `https://howtospendyourretirement.com${canonicalPath || ''}`;
      canonical.setAttribute('href', fullUrl);
    }
  }, [title, description, canonicalPath]);
}
