import React, { useEffect, useState } from 'react';
import {  Pagination } from 'antd';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import queryString from 'query-string';
import PostsTable from './PostsTable';


const PostsPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`https://dummyjson.com/posts`, {
          params: {
            skip: 0,
            limit: 10,
          },
        });
        setData(response.data.posts);
        setTotal(response.data.total);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, [location.search]); // Fetch initial data only once

  const handleTableChange = (page) => {
    const params = { ...queryString.parse(location.search), skip: (page - 1) * 10 };
    navigate({ search: queryString.stringify(params) });
  };

  return (
    <div>
   
      <PostsTable data={data} loading={loading} />
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
