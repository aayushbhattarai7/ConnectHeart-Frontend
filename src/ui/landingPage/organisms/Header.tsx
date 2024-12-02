import { NavLink, useLocation } from 'react-router-dom';
import SideBarDetails from './SideBarDetails';
import { IoMenu } from 'react-icons/io5';
import { useContext, useState } from 'react';
import { useLang } from '../../../hooks/useLang';
import { LanguageEnum } from '../../../types/global.types';
import { LuSunMedium } from 'react-icons/lu';
import { ThemeContext } from '../../../contexts/ThemeContext';
import whiteLogo from '../../../assets/images/logo.png';
import darkLogo from '../../../assets/images/logo1.png';
import axiosInstance from '../../../service/instance';

interface User {
  first_name: string;
  last_name: string;
}

const Header = () => {
  const { lang, setLang } = useLang();
  const [sideBar, setSidebar] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); 

  const toggleLanguage = () => {
    setLang(lang === LanguageEnum.en ? LanguageEnum.ne : LanguageEnum.en);
  };
  const location = useLocation();
  const theme = useContext(ThemeContext);
  const darkMode = theme.state.darkMode;

  const toggleTheme = () => {
    if (darkMode) {
      theme.dispatch({ type: 'LIGHTMODE' });
    } else {
      theme.dispatch({ type: 'DARKMODE' });
    }
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault(); 
    const searchParts = searchTerm.trim().split(' '); 
    if (searchParts.length === 1) {
      searchUser(searchParts[0], '');
    } else if (searchParts.length >= 2) {
      searchUser(searchParts[0], searchParts[1]);
    }
  };

  const searchUser = async (first_name: string, last_name: string) => {
    try {
      const response = await axiosInstance.get('/user/search', {
        params: {
          first_name,
          last_name,
        },
      });
      setUser(response.data);
      console.log(response.data, 'Search response');
    } catch (error) {
      console.error('Error searching user:', error);
    }
  };

  const logo = darkMode ? darkLogo : whiteLogo;
  const targetPath =
    location.pathname !== '/login' && location.pathname !== '/signup' ? '/' : '/login';

  return (
    <div className="relative">
      <header
        className={
          darkMode
            ? 'fixed top-0 left-0 w-full h-[11vh] bg-white text-black shadow-md z-50'
            : 'fixed top-0 left-0 w-full h-[11vh] bg-gray-900 text-white shadow-md z-50'
        }
      >
        <div
          className="font-poppins font-medium flex items-center justify-between 
        p-4 h-full"
        >
          <div>
            <h2 className="pl-5">
              <NavLink to={targetPath}>
                <img className="w-[10rem] h-[10rem] pb-3" src={logo} alt="Logo" />
              </NavLink>
            </h2>
          </div>
          <div>
          </div>
          <div className="flex justify-center items-center gap-7">
            <button onClick={toggleLanguage}>
              {lang === 'en' ? <p>English</p> : <p>नेपाली</p>}
            </button>
            <button onClick={() => toggleTheme()}>
              <LuSunMedium size={25} />
            </button>
            {location.pathname === '/login' && (
              <div className="justify-end flex items-end w-full">
                <NavLink
                  to="/signup"
                  className="text-white bg-blue-600 w-20 px-[0.7rem]
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
        <div className="hidden 2xl:block z-50">
          <SideBarDetails />
        </div>
        {sideBar && <SideBarDetails />}
        <div className="top-8 fixed left-2 z-50 block xl:hidden">
          <button className="text-3xl" onClick={() => setSidebar(!sideBar)}>
            <IoMenu />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;


/** {/* {connects?.map((connect) => {
            return (
              <div>
                {senders === connect.id ? (
                  <div>
                    <div
                      key={senders}
                      className="flex gap-6 fixed top-[6.7rem] h-16 rounded right-[21rem] text-black bg-white border w-[56rem]"
                    >
                      <div>
                        {senders ? (
                          <div
                            key={senders}
                            className="flex gap-6 fixed top-[6.7rem] h-16 rounded right-[21rem] text-black border w-[56rem]"
                          >
                            {connect?.profile?.path ? (
                              <img
                                className="h-12 w-12 rounded-full mb-3"
                                src={connect?.profile?.path}
                                alt=""
                              />
                            ) : (
                              <img
                                className="w-12 h-12 rounded-full"
                                src="/profilenull.jpg"
                                alt="Default Profile"
                              />
                            )}

                            <div className="">
                              <div className="flex pt-2 flex-col">
                                <p className="font-medium text-xl">
                                  {connect?.details?.first_name} {connect?.details.last_name}
                                </p>
                                {type && senders === connect.id && <p>Typing...</p>}
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}  */