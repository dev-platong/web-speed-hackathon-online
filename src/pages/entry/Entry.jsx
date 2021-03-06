import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useStore, useSelector, useDispatch } from 'react-redux';
import Helmet from 'react-helmet';

import { Main } from '../../foundation/components/Main';

import { renderNotFound } from '../../domains/error/error_actions';

import { fetchBlog } from '../../domains/blog/blog_actions';
import { BlogHeader } from '../../domains/blog/components/BlogHeader';

import { fetchEntry, likeEntry } from '../../domains/entry/entry_actions';
import { EntryHeader } from '../../domains/entry/components/EntryHeader/EntryHeader';
import { EntryView } from '../../domains/entry/components/EntryView';
import { EntryFooter } from '../../domains/entry/components/EntryFooter';

import { fetchCommentList } from '../../domains/comment_list/comment_list_actions';
import { CommentList } from '../../domains/comment_list/components/CommentList';

export default function Entry() {
  const location = useLocation();
  const { blogId, entryId } = useParams();
  const dispatch = useDispatch();
  const blogRedux = useSelector((state) => state.blog);
  const entryRedux = useSelector((state) => state.entry);
  const commentListRedux = useSelector((state) => state.commentList);
  const store = useStore();

  const blog = blogRedux ? blogRedux.toJS() : blogRedux;
  const commentList = commentListRedux ? commentListRedux.toJS() : [];
  const entry = entryRedux ? entryRedux.toJS() : {};

  useEffect(() => {
    (async () => {
      const { blogReducer } = await import('../../domains/blog/blog_reducer');
      const { commentListReducer } = await import(
        '../../domains/comment_list/comment_list_reducer'
      );
      const { entryReducer } = await import(
        '../../domains/entry/entry_reducer'
      );
      store.injectReducer('blog', blogReducer);
      store.injectReducer('commentList', commentListReducer);
      store.injectReducer('entry', entryReducer);
      try {
        await fetchBlog({ dispatch, blogId });
        await fetchEntry({ dispatch, blogId, entryId });
        await fetchCommentList({ dispatch, blogId, entryId });
      } catch {
        await renderNotFound({ dispatch });
      }
    })();
  }, [dispatch, blogId, entryId]);

  return (
    <>
      <Helmet>
        <title>
          {entry.title !== undefined && blog
            ? `${entry.title} - ${blog.nickname} - Amida Blog: あみぶろ`
            : 'Amida Blog: あみぶろ'}
        </title>
      </Helmet>
      <div className="Entry">
        <BlogHeader blog={blog} />

        <Main>
          <article className="Entry__contents">
            <header className="Entry__header">
              <EntryHeader
                title={entry.title}
                location={location}
                publishedAt={entry.published_at}
              />
            </header>
            <section>
              <EntryView items={entry.items || []} />
            </section>
            <footer className="Entry__footer">
              <EntryFooter
                likeCount={entry.like_count}
                location={location}
                publishedAt={entry.published_at}
                onClickLike={() => likeEntry({ dispatch, blogId, entryId })}
              />
            </footer>
          </article>
          <article className="Entry__comment-list">
            <header className="Entry__comment-list-header">
              <h2>コメント一覧</h2>
            </header>
            <CommentList list={commentList || []} />
          </article>
        </Main>
      </div>
    </>
  );
}
