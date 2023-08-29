import { LoadingButton } from "@mui/lab";
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import PostCard from "./PostCard";
import { deletePosts, getPosts } from "./postSlice";

function PostList({ userId }) {
  const [page, setPage] = useState(1);
  const [postId, setPostId] = useState(null)
  let { currentPagePosts, postsById, isLoading, totalPosts } = useSelector(
    (state) => state.post
  );
  
  let posts = currentPagePosts.map((postId) => postsById[postId]);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userId) dispatch(getPosts({ userId, page }));
  }, [dispatch, userId, postId, page]);

  useEffect(() => {
   if(postId !== null) {
    dispatch(deletePosts({postId}))
    setPostId(null)
   }
  },[postId])
  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} setPostId={setPostId} postId={postId}/>
      ))}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        {totalPosts ? (
          <LoadingButton
            variant="outlined"
            size="small"
            loading={isLoading}
            onClick={() => setPage((page) => page + 1)}
            disabled={Boolean(totalPosts) && posts.length >= totalPosts}
          >
            Load more
          </LoadingButton>
        ) : (
          <Typography variant="h6">No Post Yet</Typography>
        )}
      </Box>
    </>
  );
}

export default PostList;
