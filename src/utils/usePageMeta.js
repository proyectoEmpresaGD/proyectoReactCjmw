import { useEffect } from "react";

function ensureMetaTag(name) {
    let tag = document.head.querySelector(`meta[name="${name}"]`);
    if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute("name", name);
        document.head.appendChild(tag);
    }
    return tag;
}

export default function usePageMeta({ title, description }) {
    useEffect(() => {
        if (title) document.title = title;

        if (description) {
            const metaDescription = ensureMetaTag("description");
            metaDescription.setAttribute("content", description);
        }
    }, [title, description]);
}