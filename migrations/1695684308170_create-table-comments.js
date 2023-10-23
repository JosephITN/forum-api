/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

exports.up = (pgm) => {
  pgm.createTable('comments', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    idThread: {
      type: 'VARCHAR(50)',
      notNull: true,
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
  pgm.addConstraint('comments', 'fk_comments.threads.id', 'FOREIGN KEY("idThread") REFERENCES threads(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.created_users.id', 'FOREIGN KEY("createdBy") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.updated_users.id', 'FOREIGN KEY("updatedBy") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('comments', 'fk_comments.deleted_users.id', 'FOREIGN KEY("deletedBy") REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('comments', 'fk_comments.threads.id');
  pgm.dropConstraint('comments', 'fk_comments.created_users.id');
  pgm.dropConstraint('comments', 'fk_comments.updated_users.id');
  pgm.dropConstraint('comments', 'fk_comments.deleted_users.id');
  pgm.dropTable('comments');
};
