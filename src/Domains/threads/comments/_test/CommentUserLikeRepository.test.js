/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */
const CommentUserLikeRepository = require('../CommentUserLikeRepository');

describe('CommentUserLikeRepository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const commentUserLikeRepository = new CommentUserLikeRepository();

    // Action and Assert
    await expect(commentUserLikeRepository.addCommentLike('', {})).rejects.toThrowError('COMMENT_USER_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentUserLikeRepository.getCommentLikes('')).rejects.toThrowError('COMMENT_USER_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentUserLikeRepository.getCommentLikeByIdCommentAndUser('', '')).rejects.toThrowError('COMMENT_USER_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(commentUserLikeRepository.deleteCommentLike('', '')).rejects.toThrowError('COMMENT_USER_LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
