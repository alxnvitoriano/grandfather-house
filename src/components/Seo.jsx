import { useEffect } from 'react';

export const SITE_NAME = 'Casa do Velinho';

export const DEFAULT_DESCRIPTION =
    'Decoração de Natal para transformar a sua casa em um verdadeiro conto natalino. Árvores, pisca-piscas, guirlandas e enfeites com entrega para todo o Brasil.';

const upsertMeta = (attribute, key, content) => {
    if (!content) return;
    let tag = document.head.querySelector(`meta[${attribute}="${key}"]`);
    if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attribute, key);
        document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
};

const upsertCanonical = (href) => {
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
    }
    link.setAttribute('href', href);
};

// Atualiza title, description, Open Graph e canonical a cada troca de rota.
// Resolve o SEO da SPA sem depender de biblioteca externa.
const Seo = ({ title, description = DEFAULT_DESCRIPTION, image, noIndex = false }) => {
    useEffect(() => {
        const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
        const url = window.location.href;

        document.title = fullTitle;
        upsertMeta('name', 'description', description);
        upsertMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow');

        upsertMeta('property', 'og:title', fullTitle);
        upsertMeta('property', 'og:description', description);
        upsertMeta('property', 'og:url', url);

        upsertMeta('name', 'twitter:title', fullTitle);
        upsertMeta('name', 'twitter:description', description);

        if (image) {
            upsertMeta('property', 'og:image', image);
            upsertMeta('name', 'twitter:image', image);
        }

        upsertCanonical(url);
    }, [title, description, image, noIndex]);

    return null;
};

export default Seo;
