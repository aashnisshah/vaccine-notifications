import React from "react";
import PostsSection from "./../components/PostsSection";
import { requireAuth } from "./../util/auth.js";

function PostsPage(props) {
  return (
    <PostsSection
      bg="white"
      textColor="dark"
      size="md"
      bgImage=""
      bgImageOpacity={1}
      title="Dashboard"
      subtitle=""
    />
  );
}

export default requireAuth(PostsPage);
