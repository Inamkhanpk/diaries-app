import React, { FC } from 'react';
import Diaries from '../diary/Diaries';
import Editor from './../entry/Editor';
import './../../App.css'
const Home: FC = () => {
  return (
    <div className="App">
      <div className="left">
        <Diaries />
      </div>
      <div className="right">
        <Editor />
      </div>
    </div>
  );
};

export default Home;