import React from 'react';
import { Table } from 'antd';

const PostsTable = ({ data, loading }) => {
  return (
    <Table
      columns={[
        { title: 'Id', dataIndex: 'id', key: 'id' },
        { title: 'Title', dataIndex: 'title', key: 'title' },
        { title: 'Body', dataIndex: 'body', key: 'body' },
        { title: 'UserId', dataIndex: 'userId', key: 'userId' },
        { title: 'Tags', dataIndex: 'tags', key: 'tags', render: (tags) => tags.join(', ') },
        { title: 'Reactions', dataIndex: 'reactions', key: 'reactions' },
      ]}
      dataSource={data}
      pagination={false}
      loading={loading}
      rowKey="id"
    />
  );
};

export default PostsTable;
