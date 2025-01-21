import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postsList";
import { PostsViewSwitcher } from "../components/postsViewSwitcher";
import { api } from "../api";

export const MainPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([
          { id: 1, title: "First Post", author: "username", comments: 5 },
          { id: 2, title: "Second Post!", author: "username", comments: 3 },
          { id: 3, title: "Why DDD?", author: "username", comments: 7 },
        ]);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList posts={posts} />
    </Layout>
  );
};
