import React, { useEffect, useState } from 'react';
import { Table, Input, Select, Pagination } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';

const { Search } = Input;
const { Option } = Select;

const PostsPage = () => {
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();
    const { search: searchParam, tag: tagParam, skip: skipParam } = queryString.parse(location.search);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`https://dummyjson.com/posts`, {
                  params: {
                    skip: skipParam || 0,
                    limit: 10,
                  },
                });
                setData(response.data.posts);
                setTotal(response.data.total);
                setTags([...new Set(response.data.posts.flatMap((post) => post.tags))]);
                setLoading(false);
            } catch (error) {
                console.error('Failed to fetch data:', error);
                setLoading(false);
            }
        };
        fetchPosts();
    }, [location.search]); 

    const handleTableChange = (page) => {
        const params = { ...queryString.parse(location.search), skip: (page - 1) * 10 };
        navigate({ search: queryString.stringify(params) });
    };

    const handleSearch = (value) => {
        const params = { ...queryString.parse(location.search), search: value };
        navigate({ search: queryString.stringify(params) });
    };

    const handleTagFilterChange = (value) => {
        const params = { ...queryString.parse(location.search), tag: value.join(',') };
        navigate({ search: queryString.stringify(params) });
    };

    return (
        <div>
            <Search
                placeholder="Search by body text or title"
                onChange={(e) => handleSearch(e.target.value)}
                style={{ width: 200, marginTop: 16, marginBottom : 16,  }}
            />
            <Select
                mode="multiple"
                style={{ width: '100%', marginBottom: 16 }}
                placeholder="Filter by tags"
                onChange={handleTagFilterChange}
                value={tagParam ? tagParam.split(',') : []}
            >
                {tags.map((tag) => (
                    <Option key={tag}>{tag}</Option>
                ))}
            </Select>
            <Table
                columns={[
                    { title: 'Id', dataIndex: 'id', key: 'id' },
                    { title: 'Title', dataIndex: 'title', key: 'title' },
                    { title: 'Body', dataIndex: 'body', key: 'body' },
                    { title: 'UserId', dataIndex: 'userId', key: 'userId' },
                    { title: 'Tags', dataIndex: 'tags', key: 'tags', render: (tags) => tags.join(', ') },
                    { title: 'Reactions', dataIndex: 'reactions', key: 'reactions' },
                ]}
                dataSource={data
                    .filter((row) => {
                        const searchRegex = new RegExp(searchParam || '', 'i');
                        return searchRegex.test(row.body) || searchRegex.test(row.title);
                    })
                    .filter((row) => {
                        const selectedTags = tagParam ? tagParam.split(',') : [];
                        return selectedTags.every((selectedTag) => row.tags.includes(selectedTag));
                    })}
                pagination={false}
                loading={loading}
                rowKey="id"
            />
            <Pagination
                total={total}
                onChange={handleTableChange}
                pageSize={10}
                current={parseInt((queryString.parse(location.search).skip || 0) / 10) + 1}
            />
        </div>
    );
};

export default PostsPage;
