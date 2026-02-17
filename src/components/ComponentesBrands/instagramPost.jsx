import { useEffect, useMemo, useState } from "react";

const normalizeBrand = (value) => String(value || "").trim().toLowerCase();

function getImageUrl(post) {
    if (!post) return "";
    if (post.media_type === "VIDEO") return post.thumbnail_url || post.media_url || "";
    return post.media_url || "";
}

export default function InstagramFeed({ brand, limit = 3, className = "" }) {
    const [posts, setPosts] = useState([]);
    const [status, setStatus] = useState("idle"); // idle | loading | success | error

    const resolvedBrand = useMemo(() => normalizeBrand(brand), [brand]);

    useEffect(() => {
        let isMounted = true;

        async function fetchPosts() {
            setStatus("loading");
            try {
                const safeLimit = Number.isFinite(Number(limit)) ? Number(limit) : 3;

                const endpoint = resolvedBrand
                    ? `/api/instagram/${resolvedBrand}/latest?limit=${safeLimit}`
                    : `/api/instagram/latest?limit=${safeLimit}`;

                const res = await fetch(endpoint);
                if (!res.ok) throw new Error("Request failed");

                const data = await res.json();
                if (!isMounted) return;

                setPosts(Array.isArray(data) ? data : []);
                setStatus("success");
            } catch (e) {
                if (!isMounted) return;
                setPosts([]);
                setStatus("error");
            }
        }

        fetchPosts();
        return () => {
            isMounted = false;
        };
    }, [resolvedBrand, limit]);

    if (status === "loading" && posts.length === 0) {
        return (
            <section className={`w-full ${className}`}>
                <div className="mx-auto max-w-6xl px-4">
                    <p className="text-sm opacity-70">Cargando Instagram…</p>
                </div>
            </section>
        );
    }

    if (status === "error") {
        // Silencioso para no romper la página si falla Instagram.
        return null;
    }

    if (!posts?.length) return null;

    return (
        <section className={`w-full ${className}`}>
            <div className="mx-auto max-w-6xl px-4">
                <div className="mb-4 flex items-end justify-between gap-4">
                    <h2 className="text-xl font-semibold">Instagram</h2>
                    <span className="text-xs uppercase tracking-wider opacity-70">
                        {resolvedBrand || ""}
                    </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {posts.map((post) => {
                        const imageUrl = getImageUrl(post);

                        return (
                            <a
                                key={post.id}
                                href={post.permalink}
                                target="_blank"
                                rel="noreferrer"
                                className="group overflow-hidden rounded-lg border border-black/10"
                                title="Ver en Instagram"
                            >
                                <div className="aspect-square w-full overflow-hidden bg-black/5">
                                    {imageUrl ? (
                                        <img
                                            src={imageUrl}
                                            alt={post.caption ? post.caption.slice(0, 60) : "Instagram post"}
                                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div className="flex h-full w-full items-center justify-center text-sm opacity-60">
                                            Sin imagen
                                        </div>
                                    )}
                                </div>

                                {post.caption ? (
                                    <div className="p-3">
                                        <p className="line-clamp-2 text-sm opacity-80">{post.caption}</p>
                                    </div>
                                ) : null}
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
