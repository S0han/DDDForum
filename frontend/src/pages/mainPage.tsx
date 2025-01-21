import React, { useEffect, useState } from "react";
import { Layout } from "../components/layout";
import { PostsList } from "../components/postsList.tsx";
import { PostsViewSwitcher } from "../components/postsViewSwitcher";
import { api } from "../api";

export const MainPage = () => {
  const posts = [{ ... }];

  return (
    <Layout>
      <PostsViewSwitcher />
      <PostsList
        posts={posts}
      />
    </Layout>
  );
};