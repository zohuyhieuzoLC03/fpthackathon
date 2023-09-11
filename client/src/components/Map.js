import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom'
import path from '../utils/path'
import Modal from "react-modal";
import Form from "./Form";
import { addDataToFirestore } from "../firebase";
import { Tree, Mind } from "tree-graph-react";

const Map = ({isLoggedIn}) => {
  const [selectedType, setSelectedType] = React.useState("tree");

  const handleChangeMap = (event) => {
    setSelectedType(event.target.value);
  };
  const [nodes, setNodes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingSound, setIsUploadingSound] = useState(false)
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [currentMap, setCurrentMap] = useState("");
  const navigate = useNavigate()
  
  const ref = useRef();
  const handleChange = (e) => {
    let savedData = ref.current.saveNodes();
  };
  const handleTextChange = (event) => {
    setText(event.target.value);
  }; 

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/nodes', { text: text });
      console.log(response.data); // In ra kết quả trả về từ server
      setNodes(response.data);
      setCurrentMap(response.data)
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const fileInputRef = React.useRef(null);

  const handleFileUpload = async () => {
    fileInputRef.current.click(); // Kích hoạt sự kiện chọn file khi nhấn nút "Upload File"
  };

  const handleSelectedFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true);
    let response
    try {
      if (file.type.includes('image/')) {
          response = await axios.post('http://localhost:3001/api/upload_image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }
      else {
          response = await axios.post('http://localhost:3001/api/upload_sound', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      }

      // Đặt kết quả của API upload file vào biến state "text"
      setText(response.data);
      setIsUploading(false);
    } catch (error) {
      console.log(error);
    }
    setIsUploading(false);
  };

  const handleSave = async () => {
    // setIsSaving(true);
    // try {
    //   await addDataToFirestore("Name", currentMap, "tag", false);
    //   setIsSaving(false);
    // } catch (error) {
    //   console.log(error);
    //   setIsSaving(false);
    // }
    setIsSaving(true);
    // Xử lý lưu dữ liệu
    setIsSaving(false);
    setShowModal(true);
  }

  useEffect(() => {
    const setNodeColors = (node, level) => {
      if (!node) {
        console.error("Node is undefined or null");
        return;
      }
      const colors = [ '#F52549','#F9A603', '#4897D8', '#9BC01C', '#B5DDD1', '#7f7f7f', '#bcbd22', '#17becf'];
      node.backgroundColor = colors[level % colors.length];
      node.color = '#fff';
      const children = node.sortList.map(key => nodesArray.find(n => n._key === key));
      for (const child of children) {
        setNodeColors(child, level + 1);
      }
      node.shorted = node.name;
      node.name = "aaa"
    };
    const nodesArray = Object.values(nodes);
    const rootNode = nodesArray.find((node) => node._key === "001");
    if (nodesArray.length > 0) {
      setNodeColors(rootNode, 0);
    }
  }, [nodes]);

  return (
    <div className="flex flex-col">
      <div className='flex flex-col m-20 gap-2'>
        <textarea
            className=" h-60 p-6 border rounded no-scrollbar"
            placeholder="Paste your text here or upload a file..."
            value={text}
            onChange={handleTextChange}
          />
          <div className="flex justify-between">
          <div className="flex gap-2">
            <button
              className='px-4 py-2 w-32 bg-[#06325E] text-white rounded hover:bg-[#050828]'
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Mind Map'}
            </button>
            <button
              className="px-4 py-2 bg-[#06325E] text-white rounded hover:bg-[#050828]"
              onClick={handleFileUpload}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            {/* Thêm thẻ input type="file" ẩn đi, dùng để xử lý việc chọn file */}
            <input
              type="file"
              accept=".png, .jpg, .jpeg, .mp3, .wav"
              ref={fileInputRef}
              onChange={handleSelectedFile}
              style={{ display: 'none' }}
            />
             {isLoggedIn && (
            <button 
              className='px-4 py-2 w-32 bg-[#06325E] text-white rounded hover:bg-[#050828]' 
              onClick={handleSave} 
              disabled={isSaving} >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
          )}
          
          </div>
          <label htmlFor="viewChange" className="flex justify-end">
          <select
            id="viewChange"
            value={selectedType}
            onChange={handleChangeMap}
            className="bg-white rounded-md border-2 px-4 py-2 right-0 top-0"
          >
            <option value="tree">Tree</option>
            <option value="mind">Mind</option>
            <option value="mind-single">Mind Single</option>
          </select>
        </label>
          </div>
      </div>
      <div className="mt-8">
    {nodes && (
      <div className="flex flex-col justify-center items-center">
        {selectedType === "tree" && (
          <Tree ref={ref} handleChange={handleChange} nodes={nodes} startId="001" disabled />
        )}
        {selectedType === "mind" && (
          <Mind ref={ref} handleChange={handleChange} nodes={nodes} startId="001" disabled />
        )}
        {selectedType === "mind-single" && (
          <Mind ref={ref} handleChange={handleChange} nodes={nodes} singleColumn startId="001" disabled />
        )}
      </div>
    )}
  </div>
      <Modal
        isOpen={showModal}
        onRequestClose={() => setShowModal(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            borderRadius: "10px",
          },
        }}
      >
        <Form _currentItem={currentMap} onClose={() => setShowModal(false)} place={"Mindmap"}/>
      </Modal>
    </div>
  );
};

export default Map;