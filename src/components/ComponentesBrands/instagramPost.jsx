import { useEffect, useState } from "react";

function InstagramFeed({ accessToken, userId }) {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchInstagramPosts() {
            try {
                const res = await fetch(
                    `https://graph.facebook.com/v18.0/${userId}/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${accessToken}`
                );
                const data = await res.json();
                setPosts(data.data.slice(0, 3)); // solo los 3 últimos
            } catch (err) {
                console.error("❌ Error al cargar Instagram:", err);
            }
        }
        fetchInstagramPosts();
    }, [accessToken, userId]);

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {posts.map(post => (
                <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img
                        src={post.media_url}
                        alt={post.caption || "Instagram post"}
                        className="rounded-lg w-full h-auto object-cover"
                    />
                </a>
            ))}
        </div>
    );
}

export default InstagramFeed;
