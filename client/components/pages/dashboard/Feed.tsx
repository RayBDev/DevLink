import React from 'react';

import CreatePost from './CreatePost';
import Posts from './Posts';

const Feed = () => {
  return (
    <section id="Feed">
      <CreatePost />
      <Posts />
    </section>
  );
};

export default Feed;
