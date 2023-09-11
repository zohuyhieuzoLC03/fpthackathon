import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { getDataFromFirestoreById } from "../../firebase";
import { Tree, Mind } from "tree-graph-react";
import { useNavigate } from 'react-router-dom';

const OpenMap = () => {
  const navigate = useNavigate();
  const ref = useRef();
  const [selectedType, setSelectedType] = React.useState("tree");
  const [nodes, setNodes] = useState(null); // Trạng thái mới để lưu trữ dữ liệu mindmap
  const { itemId } = useParams();

  const handleChangeMap = (event) => {
    setSelectedType(event.target.value);
  };

  const handleChange = (e) => {
    let savedData = ref.current.saveNodes();
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await getDataFromFirestoreById(itemId, "Mindmap");
      console.log(data)
      setNodes(data.data);
    }
    fetchData();
  }, []);

  return (
    <div className="mt-8">
      {nodes && (
        <div className="flex flex-col justify-center items-center">
          <div className="flex gap-2 ">
            <div 
            className='bg-[#06325E] hover:bg-[#050828] w-[52px] flex px-2 rounded-lg cursor-pointer justify-center items-center'
            onClick={() => navigate("/private/library")}>
                  <p className='text-white'>Back</p>
            </div>
          <label htmlFor="viewChange">
            <select
              id="viewChange"
              value={selectedType}
              onChange={handleChangeMap}
              className="bg-white rounded-md border-2 px-4 py-2"
            >
              <option value="tree">Tree</option>
              <option value="mind">Mind</option>
              <option value="mind-single">Mind Single</option>
            </select>
          </label>
          </div>
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
  )

}

export default OpenMap;