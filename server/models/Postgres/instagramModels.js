import fetch from "node-fetch";

const DEFAULT_GRAPH_VERSION = "v18.0";

export class InstagramModel {
    static async getLatestPosts({ userId, accessToken, limit = 3 }) {
        const graphVersion = process.env.INSTAGRAM_GRAPH_VERSION || DEFAULT_GRAPH_VERSION;

        const endpoint =
            `https://graph.facebook.com/${graphVersion}/${userId}/media` +
            `?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp` +
            `&access_token=${accessToken}`;

        try {
            const res = await fetch(endpoint);
            const data = await res.json();

            if (!res.ok) {
                throw new Error(data?.error?.message || "Error fetching Instagram posts");
            }

            const items = Array.isArray(data?.data) ? data.data : [];
            return items.slice(0, limit);
        } catch (error) {
            console.error("❌ Error en InstagramModel:", error);
            throw error;
        }
    }
}
