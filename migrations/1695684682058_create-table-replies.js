/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

exports.up = (pgm) => {
  pgm.createTable('replies', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    idThread: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    idComment: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    idReply: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    content: {
      type: 'TEXT',
      notNull: true,
    },
    createdAt: {
      type: 'TEXT',
      notNull: true,
    },
    createdBy: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    updatedAt: {
      type: 'TEXT',
      notNull: false,
    },
    updatedBy: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
    is_deleted:{
      type: 'BOOL',
      default: false,
    },
    deletedAt: {
      type: 'TEXT',
      notNull: false,
    },
    deletedBy: {
      type: 'VARCHAR(50)',
      notNull: false,
    },
  });
  pgm.addConstraint('replies', 'fk_replies.threads.id', 'FOREIGN KEY("idThread") REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.comments.id', 'FOREIGN KEY("idComment") REFERENCES comments(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.replies.id', 'FOREIGN KEY("idReply") REFERENCES replies(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.created_users.id', 'FOREIGN KEY("createdBy") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.updated_users.id', 'FOREIGN KEY("updatedBy") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('replies', 'fk_replies.deleted_users.id', 'FOREIGN KEY("deletedBy") REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('replies', 'fk_replies.threads.id');
  pgm.dropConstraint('replies', 'fk_replies.comments.id');
  pgm.dropConstraint('replies', 'fk_replies.replies.id');
  pgm.dropConstraint('replies', 'fk_replies.created_users.id');
  pgm.dropConstraint('replies', 'fk_replies.updated_users.id');
  pgm.dropConstraint('replies', 'fk_replies.deleted_users.id');
  pgm.dropTable('replies');
};
