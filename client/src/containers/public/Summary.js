import React, { useState } from 'react';
import axios from 'axios';
import { db } from '../../firebase'
import { collection, addDoc, getDocs, deleteDoc, updateDoc } from 'firebase/firestore';

function Summary() {
  const [text, setText] = useState('');
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:3001/api/summarize', { text: text });
      setSummary(response.data);
      console.log(summary)


      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleSubmit = () => {
      fetchData();
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

  return (
    <div className="mt-24 mx-20 flex flex-col md:flex-row">
      <div className="flex-1 mr-4">
        <div className="relative">
          <textarea
            className="w-full h-96 p-6 border rounded no-scrollbar"
            placeholder="Paste your text here or upload a file..."
            value={text}
            onChange={handleTextChange}
          />
        </div>
        <div className="flex mt-2 space-x-2">
          <button
            className="px-4 py-2 bg-[#06325E] text-white rounded hover:bg-[#050828]"
            onClick={handleSubmit}
            disabled={isLoading} 
          >
            {isLoading ? 'Loading...' : 'Summarize'}
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
        </div>
      </div>
      <div className="flex-1 h-96 border rounded">
        {summary !== '' ? (
          <p className="p-6 h-full overflow-auto no-scrollbar">{summary}</p>
        ) : (
          <p className="p-6 h-full text-gray-400">Please enter some text or upload file (.png, .jpg, .jpeg) and click "Summarize"</p>
        )}
      </div>
    </div>
  );
}

export default Summary;