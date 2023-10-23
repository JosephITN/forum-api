/* eslint-disable camelcase */

exports.up = pgm => {
    pgm.createTable('comment_user_likes', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        commentId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        userId: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        range: {
            type: 'SMALLINT',
            notNull: true,
            default: 5,
        },
        createdAt: {
            type: 'TEXT',
            notNull: true,
        },
        updatedAt: {
            type: 'TEXT',
            notNull: false,
        },
    });
    /**
     * Unique
     */
    pgm.addConstraint('comment_user_likes', 'unique_comment_id_and_user_id', 'UNIQUE("commentId", "userId")');
    /**
     * Foreign
     */
    pgm.addConstraint('comment_user_likes', 'fk_likes.user.id', 'FOREIGN KEY("userId") REFERENCES users(id) ON DELETE CASCADE');
    pgm.addConstraint('comment_user_likes', 'fk_likes.comment.id', 'FOREIGN KEY("commentId") REFERENCES comments(id) ON DELETE CASCADE');
};

exports.down = pgm => {
    pgm.dropTable('comment_user_likes');
};
