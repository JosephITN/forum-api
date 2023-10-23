/**
 * Copyright (c) 2023.
 * Made with ❤ by Joseph Dedy Irawan
 * joseph@lecturer.itn.ac.id
 */

exports.up = (pgm) => {
  pgm.createTable('threads', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    title: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    body: {
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
  pgm.addConstraint('threads', 'fk_threads.created_users.id', 'FOREIGN KEY("createdBy") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('threads', 'fk_threads.updated_users.id', 'FOREIGN KEY("updatedBy") REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('threads', 'fk_threads.deleted_users.id', 'FOREIGN KEY("deletedBy") REFERENCES users(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('threads', 'fk_threads.created_users.id');
  pgm.dropConstraint('threads', 'fk_threads.updated_users.id');
  pgm.dropConstraint('threads', 'fk_threads.deleted_users.id');
  pgm.dropTable('threads');
};
