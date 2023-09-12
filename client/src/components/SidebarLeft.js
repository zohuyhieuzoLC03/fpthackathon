import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import path from '../utils/path';
import icons from "../utils/icons";
import SidebarMenu from '../utils/menu'

const { VscLibrary , PiSealQuestion} = icons;

const notActiveStyle ='py-3 px-4 flex items-center justify-start text-base text-[#06325E] hover:bg-[#06325E] hover:text-white transition duration-300';
const activeStyle = 'py-3 px-4 flex items-center justify-start text-base font-semibold text-[#06325E] hover:bg-[#06325E] hover:text-white transition duration-300';

const SidebarLeft = ({ showLibrary }) => {
  const navigate = useNavigate();
  return (
    <div className='flex flex-col border-r-2 h-screen'>
        <div onClick={() => navigate(path.HOME)} className='w-full h-[70px] py-[15px] px-[30px] flex justify-start items-center cursor-pointer'>
        </div>
        <div className='flex flex-col'> 
        {showLibrary ? <SidebarMenu isLoggedIn/> : <SidebarMenu isLoggedIn={false}/>}
            {showLibrary ? (
              <div>
                  <NavLink
                      to='library'
                      key='library'
                      className= {({isActive}) => isActive ? activeStyle : notActiveStyle}
                  >
                     <VscLibrary size={20} className='text-[#06325E]' />
                      <span className="ml-2">Library</span>
                      
                  </NavLink>
                  <NavLink
                      to='daily_quiz'
                      key='daily_quiz'
                      className= {({isActive}) => isActive ? activeStyle : notActiveStyle}
                  >
                     <PiSealQuestion size={20} className='text-[#06325E]' />
                      <span className="ml-2">Daily Quiz</span>
                  </NavLink>
                  </div>
                    ) : null}
        </div>
    </div>
  );
};

export default SidebarLeft;