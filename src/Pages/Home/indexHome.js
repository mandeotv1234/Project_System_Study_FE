import "bootstrap/dist/css/bootstrap.min.css";
import "../../Style/Home.scss";
import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  UploadOutlined,
  DownloadOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Button, Upload, message } from "antd";
import { useState, useEffect } from "react";
import Papa from "papaparse";


function Home() {
  return (
    <div className="home">
      <div className="home-header">
        <h1>Home Page</h1>
      </div>
      <div className="home-content">
        <p>Welcome to the home page!</p>
      </div>
    </div>
  );
}

export default Home;
