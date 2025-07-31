import fetch from 'node-fetch';

export class InstagramModel {
    static async getLatestPosts({ userId, accessToken, limit = 3 }) {
        const endpoint = `https://graph.facebook.com/v18.0/${userId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&access_token=${accessToken}`;
        try {
            const res = await fetch(endpoint);
            const data = await res.json();
            if (!res.ok) throw new Error(data.error?.message || 'Error fetching Instagram posts');
            return data.data.slice(0, limit);
        } catch (error) {
            console.error("❌ Error en InstagramModel:", error);
            throw error;
        }
    }
}
