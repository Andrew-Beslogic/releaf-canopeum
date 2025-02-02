import { LanguageContext } from '@components/context/LanguageContext'
import PostCommentsDialog from '@components/social/PostCommentsDialog'
import type { PageViewMode } from '@models/types/PageViewMode'
import { useContext, useState } from 'react'

import { type Post } from '../../services/api'
import AssetGrid from '@components/AssetGrid'
import TextExpansion from '@components/inputs/textExpansion'
import getApiClient from '@services/apiInterface'

const PostWidget = (props: { post: Post, likePostEvent: (postId: number) => void, viewMode: PageViewMode }) => {
  const { post, likePostEvent, viewMode } = props

  const { formatDate } = useContext(LanguageContext)
  const [commentsModalOpen, setCommentsModalOpen] = useState(false)

  const openPostComments = () => setCommentsModalOpen(true)

  const handleCommentsModalClose = () => setCommentsModalOpen(false)

  const likePost = async () => {
    if (post.hasLiked) {
      await getApiClient().likeClient.delete(post.id!)
      likePostEvent(post.id!)
    } else {
      await getApiClient().likeClient.likePost(post.id!, {})
      likePostEvent(post.id!)
    }
  }

  const handleCommentCountChange = (action: 'added' | 'deleted') => {
    /* eslint-disable @typescript-eslint/no-explicit-any -- Temporary workaround.
    We want the post commentCount property to be read-only; figure out how to do so with the NSwag models generation */
    if (action === 'added') {
      ;(post.commentCount as any) += 1
    } else {
      ;(post.commentCount as any) -= 1
    }
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }

  return (
    <>
      <div className='bg-white rounded-2 px-5 py-4 d-flex flex-column gap-3'>
        <div className='d-flex justify-content-start gap-2'>
          <img
            alt='site'
            className='rounded-circle'
            src={post.site.image.asset}
            style={{ height: '48px', width: '48px' }}
          />
          <div className='d-flex flex-column'>
            <h6 className='text-uppercase fw-bold mb-1'>{post.site.name}</h6>
            <span className='text-muted initialism'>
              {formatDate(post.createdAt, { dateStyle: 'short' })}
            </span>
          </div>
        </div>

        <TextExpansion text={post.body} maxLength={700} />

        {post.media.length > 0 && <AssetGrid medias={post.media} />}

        <div className='d-flex justify-content-end gap-4'>
          <button className='d-flex gap-2 unstyled-button' type='button'>
            <span
              className={'material-symbols-outlined' + (post.hasLiked == true ? ' fill-icon' : '')}
              onClick={likePost}
            >
              eco
            </span>
            <div>{post.likeCount}</div>
          </button>

          <button
            className='d-flex gap-2 unstyled-button'
            onClick={openPostComments}
            type='button'
          >
            <span className='material-symbols-outlined text-primary'>sms</span>
            <div>{post.commentCount}</div>
          </button>

          <button className='d-flex gap-2 unstyled-button' type='button'>
            <span className='material-symbols-outlined text-primary'>share</span>
            <div>{post.shareCount}</div>
          </button>
        </div>
      </div>

      <PostCommentsDialog
        handleClose={handleCommentsModalClose}
        onCommentAction={handleCommentCountChange}
        open={commentsModalOpen}
        postId={post.id}
        viewMode={viewMode}
      />
    </>
  )
}

export default PostWidget
