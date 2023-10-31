import React from 'react'
import 
{BsCart3, BsGrid1X2Fill, BsFillArchiveFill, BsFillGrid3X3GapFill, BsPeopleFill, 
  BsListCheck, BsMenuButtonWideFill, BsFillGearFill,BsFillDiscFill,BsFillLaptopFill,BsNvidia}
 from 'react-icons/bs'
 import{BiSolidMemoryCard,BiMemoryCard} from 'react-icons/bi'

function Sidebar({openSidebarToggle, OpenSidebar}) {
  return (
    <aside id="sidebar" className={openSidebarToggle ? "sidebar-responsive": ""}>
        <div className='sidebar-title'>
            <div className='sidebar-brand'>
                <BsFillLaptopFill  className='icon_header'/> ROG STRIX
            </div>
            <span className='icon close_icon' onClick={OpenSidebar}>X</span>
        </div>

        <ul className='sidebar-list'>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsGrid1X2Fill className='icon'/> Dashboard
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsNvidia className='icon'/> Vendor
                    <h6><BsNvidia className='icon'/>Nvidia</h6>
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsFillGrid3X3GapFill className='icon'/> Model
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="header.html#card-inner">
                    <BiSolidMemoryCard className='icon'/> Totalmemory
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsFillDiscFill className='icon'/> Driver version
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsMenuButtonWideFill className='icon'/> Reports
                </a>
            </li>
            <li className='sidebar-list-item'>
                <a href="">
                    <BsFillGearFill className='icon'/> Setting
                </a>
            </li>
        </ul>
    </aside>
  )
}

export default Sidebar