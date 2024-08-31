import { NavLink, useLocation } from 'react-router-dom';
import SideBarDetails from './SideBarDetails';
import { IoMenu } from 'react-icons/io5';
import {  useState } from 'react';
import { useLang } from '../../../hooks/useLang';
import { LanguageEnum } from '../../../types/global.types';
import { LuSunMedium } from 'react-icons/lu';

const Header = () => {
  const { lang, setLang } = useLang();
  const [sideBar, setSidebar] = useState(false);
  const toggleLanguage = () => {
    setLang(lang === LanguageEnum.en ? LanguageEnum.ne : LanguageEnum.en);
  };
  const location = useLocation();

  const targetPath =
    location.pathname !== '/login' && location.pathname !== '/signup' ? '/' : '/login';
  return (
    <div className="relative">
      <header className="fixed top-0 left-0 w-full h-[11vh] bg-white shadow-md z-50">
        <div
          className="font-poppins font-medium flex items-center justify-between 
        p-4 h-full"
        >
          <div>
            <h2 className="pl-5">
              <NavLink to={targetPath}>
                <img className="w-24 h-24 pb-3" src="/logo.png" alt="Logo" />
              </NavLink>
            </h2>
          </div>

          <div className="flex justify-center items-center gap-7">
            <button onClick={toggleLanguage}>
              {lang === 'en' ? <p>English</p> : <p>नेपाली</p>}
            </button>
            <button>
              <LuSunMedium size={25} />
            </button>
            {/* {location.pathname !== '/login' && location.pathname !== '/signup' && (
              <>
                <NavLink to={'/support'}>
                  <IoNotificationsSharp className="text-2xl" />
                </NavLink>
              </>
            )} */}

            {location.pathname === '/login' && (
              <div className="justify-end flex items-end w-full">
                <NavLink
                  to="/signup"
                  className="text-white bg-blue-600 w-20 px-4
                 py-1 rounded-lg h-8 transition duration-300 ease-in-out hover:bg-blue-900"
                >
                  Signup
                </NavLink>
              </div>
            )}

            {location.pathname === '/signup' && (
              <div className="justify-end flex items-end w-full px-10">
                <NavLink
                  to="/login"
                  className="text-white bg-blue-600 w-20 px-4 py-1
                 rounded-lg h-8 transition duration-300 ease-in-out hover:bg-blue-900"
                >
                  Login
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="">
        <div className=" hidden 2xl:block z-50">
          <SideBarDetails />
        </div>
        {sideBar && <SideBarDetails />}
        <div className="  top-8 fixed  left-2 z-50 block xl:hidden">
          <button className="text-3xl" onClick={() => setSidebar(!sideBar)}>
            <IoMenu />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
