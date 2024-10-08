import { useContext, useEffect, useState } from 'react';
import axiosInstance from '../../../service/instance';
import Comments from '../molecules/Comment';
import ReplyComment from '../molecules/ReplyComment';
import { FaShare } from 'react-icons/fa';
import axios from 'axios';
import Post from './Post';
import Like from './Like';
import Dropdown from '../molecules/DropDownMenu';
import { jwtDecode } from 'jwt-decode';
import Notification from './Notification';
import { FaHeart } from 'react-icons/fa';
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6';
import { FaRegCommentDots } from 'react-icons/fa';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';
import CommentOptions from '../molecules/CommentOption';
import { ThemeContext } from '../../../contexts/ThemeContext';

interface Post {
  id: string;
  thought: string;
  feeling?: string;
  postImage?: PostMedia[];
  comment?: Comment[];
  likes: likes[];
  createdAt: string;
  postIt: {
    id: string;
    details: {
      first_name?: string;
      last_name?: string;
    };
    profile: {
      id?: string;
      path?: string;
    };
  };
}
interface DecodedToken {
  id: string;
  email: string;
}

interface likes {
  id: string;
  isLiked: boolean;
  auth: Auth;
}

interface Auth {
  id: string;
}

interface Connection {
  id: string;
  email?: string;
  username?: string;
  details: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    gender: string;
  };
  profile: {
    id?: string;
    path?: string;
  };
}

interface Comment {
  id?: string;
  createdAt: string;
  comment?: string;
  parentComment?: Comment | null;
  childComment?: Comment[];
  topLevelComment: string;
  commentAuth: {
    id: string;
    details: {
      first_name: string;
      last_name: string;
    };
    profile: {
      id: string;
      path: string;
    };
  };
  isChild: boolean;
  isParent: boolean;
}

interface PostMedia {
  id?: string;
  path?: string;
}

const ShowPost = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [decodedToken, setDecodedToken] = useState<DecodedToken | null>(null);
  const [replyCommentId, setReplyCommentId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [visibleCommentsPostId, setVisibleCommentsPostId] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState<string | null>(null);
  const [sideMenu, setSideMenu] = useState(false);
  const [connects, setConnects] = useState<Connection[]>([]);
  const { lang } = useLang();
  const {
    state: { darkMode },
  } = useContext(ThemeContext);

  const bgColor = darkMode ? 'bg-white' : 'bg-gray-900';
  const connectBgColor = darkMode ? 'bg-white' : 'bg-gray-900';
  const textColor = darkMode ? 'text-black' : 'text-white';
  const hoverDiv = darkMode ? 'hover:bg-gray-50' : 'hover:bg-gray-800';
  const getPost = async () => {
    try {
      const response = await axiosInstance.get('/post/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🚀 ~ getPost ~ response:', response.data.posts);

      setPosts(response.data?.posts);
      const userId = sessionStorage.getItem('accessToken');
      setCurrentUserId(userId);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching posts');
      } else {
        setError('Error while fetching posts');
      }
    }
  };

  useEffect(() => {
    const token = sessionStorage.getItem('accessToken');

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setDecodedToken(decoded);
      } catch (error) {
        console.error('Failed to decode token', error);
      }
    } else {
      console.error('No token found in sessionStorage');
    }
  }, []);

  const getConnection = async () => {
    try {
      const response = await axiosInstance.get('/connect/friends', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setConnects(response?.data?.friends);
      console.log(response?.data?.friends);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Error while fetching connection');
      } else {
        setError('Error while fetching connection');
      }
    }
  };
  function getTimeDifference(createdAt: string) {
    const noteDate = new Date(createdAt);
    const now = new Date();
    const diffMs = now.getTime() - noteDate.getTime();

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (diffDays > 0) {
      return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    } else {
      return `${diffMinutes} minute${diffMinutes > 1 ? 's' : ''} ago`;
    }
  }

  const toggleComments = (postId: string) => {
    setVisibleCommentsPostId((prevPostId) => (prevPostId === postId ? null : postId));
    setCommentForm((prevPostId) => (prevPostId === postId ? null : postId));
  };

  const toggleReplyForm = (comment: string) => {
    setReplyCommentId((prevCmtId) => (prevCmtId === comment ? null : comment));
  };

  const handleSideClick = () => {
    setSideMenu(!sideMenu);
  };

  const renderComments = (comments: Comment[], isChild: boolean = false) => {
    if (!visibleCommentsPostId) return null;

    return comments.map((cmt) => (
      <div key={cmt?.id} className={`flex${bgColor} p-3 mb-2`}>
        <img
          className="w-8 h-8 rounded-full mr-3"
          src={cmt?.commentAuth?.profile?.path || '/profilenull.jpg'}
          alt="Profile"
        />
        <div className="w-full">
          <div className="flex items-center">
            <p className="text-sm font-semibold">
              {cmt?.commentAuth?.details?.first_name} {cmt?.commentAuth?.details?.last_name}{' '}
              <span className="font-extralight">{getTimeDifference(cmt?.createdAt)}</span>
            </p>
            <div className="flex gap-4 w-[20rem] ">
              {(decodedToken?.id === cmt?.commentAuth.id ||
                posts.some((post) => post.postIt.id === decodedToken?.id)) && (
                <CommentOptions
                  commentId={cmt?.id!}
                  refresh={getPost}
                  commentUser={cmt?.commentAuth.id}
                  comment={cmt.comment!}
                />
              )}
            </div>
          </div>

          <p className="mt-1 text-sm ">{cmt?.comment}</p>

          <div className="flex items-center gap-3 mt-1">
            <button className="text-blue-600 text-xs font-medium hover:underline">Like</button>
            <button
              onClick={() => toggleReplyForm(cmt.id!)}
              className="text-blue-600 text-xs font-medium hover:underline"
            >
              Reply
            </button>
          </div>

          {isChild && replyCommentId === cmt.id && (
            <div className="p-2 mt-2">
              <ReplyComment
                postId={posts[0]?.id || ''}
                commentId={cmt.id || ''}
                refresh={getPost}
              />
            </div>
          )}

          {cmt.childComment && (
            <div className="ml-2 mt-3 pl-3 border-l border-gray-300">
              {renderComments(cmt.childComment, true)}
            </div>
          )}
        </div>
      </div>
    ));
  };

  const MediaList = (medias: PostMedia[]) => {
    return (
      <div className="flex gap-2 flex-wrap">
        {medias.map((media) => {
          const { id, path } = media;
          const isImage = path?.match(/\.(jpeg|jpg|gif|png|svg)$/);
          const isVideo = path?.match(/\.(mp4|webm|ogg)$/);
          return (
            <div className="" key={id}>
              {isImage && (
                <img className="rounded-lg 2xl:w-[55rem] h-[27rem] border-black" src={path} />
              )}
              {isVideo && (
                <video className="rounded-lg" controls>
                  <source
                    className="rounded-2xl"
                    src={path}
                    type={`video/${path?.split('.').pop()}`}
                  />
                </video>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    getPost();
    getConnection();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1034) {
        setSideMenu(false);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div
      className={
        darkMode
          ? 'mt-6 flex flex-col lg:flex-row justify-evenly items-start mx-auto   lg:p-6 bg-gray-100'
          : 'mt-6 flex flex-col lg:flex-row justify-evenly items-start mx-auto   lg:p-6 bg-gray-800'
      }
    >
      <div className="flex flex-col justify-start items-center overflow-y-auto h-fit w-full  mt-30 2xl:w-[52rem] xl:w-[50rem]  lg:w-[45rem] md:w-[40rem] sm:w-[35rem] mx-auto  mb-16 ">
        <Post postId={posts[0]?.id || ''} refresh={getPost} />
        {error && <p>{error}</p>}
        {posts.map((post) => (
          <div
            className={
              darkMode
                ? ' flex justify-center shadow-xl  w-full rounded-xl mx-auto   mb-14 text-ellipsis bg-white'
                : ' flex justify-center  shadow-xl  w-full rounded-xl mx-auto text-gray-200  mb-14 text-ellipsis bg-gray-900'
            }
            key={post.id}
          >
            <div className="items-start sm:mr-20 sm:flex-row w-full p-10">
              <div key={post.postIt?.id} className="  mb-5">
                <div className="flex flex-col relative z-0 p-4">
                  <div className="flex gap-1">
                    {post?.postIt?.profile?.path ? (
                      <img
                        className="w-14 h-14  rounded-full "
                        src={post?.postIt?.profile?.path}
                        alt="Profile"
                      />
                    ) : (
                      <img className="w-14 h-14  rounded-full " src="/profilenull.jpg" alt="" />
                    )}

                    <div className="flex gap-1 mb-3 text-nowrap  px-2">
                      <p className="font-medium font-poppins text-lg ">
                        {post.postIt?.details?.first_name}
                      </p>
                      <p className="font-medium font-poppins text-lg">
                        {post.postIt?.details?.last_name}{' '}
                      </p>
                      {post?.feeling ? (
                        <p className="font-poppins pt-[2px] ">
                          {' '}
                          is feeling{' '}
                          <span className="font-poppins font-medium">{post?.feeling}</span>{' '}
                        </p>
                      ) : (
                        <p className=" text-lg font-poppins">shared the post</p>
                      )}
                    </div>
                  </div>
                  <p className=" absolute top-10 left-[5.2rem]">
                    {getTimeDifference(post?.createdAt)}
                  </p>
                </div>

                <div className=" mb-3  rounded-2xl break-words">
                  <div
                    className="flex flex-col justify-start items-start mb-4 rounded-lg"
                    key={post.id}
                  >
                    <p className="font-poppins font-medium ml-10">{post.thought}</p>
                  </div>

                  <div className="flex flex-col  justify-center items-center pl-10 rounded-2xl">
                    <div className="flex  overflow-hidden rounded-lg pl-10">
                      <div className="rounded-lg ">
                        {post?.postImage && MediaList(post.postImage)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="  flex justify-between pl-[3rem] mx-auto mb-1">
                <div className="flex">
                  {post.likes.length === 0 ? (
                    <div className="mt-8 flex">
                      <p>No Likes</p>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-5">
                      <p className="pl-3 text-xl text-red-500">
                        <FaHeart />
                      </p>
                      {post.likes.length < 2 ? (
                        <span>
                          {post.likes.length} {authLabel.like[lang]}
                        </span>
                      ) : (
                        <span>
                          {post.likes.length} {authLabel.likes[lang]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex mt-4 font-poppins">
                  <button
                    className="rounded-xl  text-2xl h-7 pl-5 ml-6  w-14"
                    // onClick={() => toggleComments(post.id)}
                  >
                    {visibleCommentsPostId === post.id ? (
                      <FaRegCommentDots />
                    ) : (
                      <FaRegCommentDots />
                    )}
                  </button>
                  {post.comment?.length === 0 ? (
                    <p>No comments</p>
                  ) : (
                    <div>
                      {post.comment && post?.comment.length < 2 ? (
                        <span>
                          {post.comment.length} {authLabel.comment[lang]}
                        </span>
                      ) : (
                        <span>
                          {post.comment?.length} {authLabel.comments[lang]}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex  ml-10 mb-4 w-full border "></div>

              <div className="flex gap-20 justify-around ml-10">
                <div className="flex flex-col  font-poppins">
                  <div className="ml-1">
                    <Like postId={post?.id} userId={currentUserId!} refresh={getPost} />
                  </div>
                  <p>{authLabel.like[lang]}</p>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col font-poppins">
                    <button
                      className="rounded-xlh-7 ml-2 pl-5 text-2xl w-14"
                      onClick={() => toggleComments(post.id)}
                    >
                      {commentForm === post.id ? (
                        <FaRegCommentDots className="" />
                      ) : (
                        <FaRegCommentDots />
                      )}
                    </button>
                    <p className="pl-6 font-poppins">{authLabel.comment[lang]}</p>
                  </div>
                  <div></div>
                </div>

                <div className="flex flex-col font-poppins">
                  <button className="ml-1">
                    <FaShare className="text-xl" />
                  </button>
                  <p>{authLabel.share[lang]}</p>
                </div>
              </div>
              {visibleCommentsPostId === post.id &&
                (post.comment && post.comment.length > 0 ? (
                  <div className="mb-7 2xl:ml-20">{renderComments(post.comment)}</div>
                ) : (
                  <p className="ml-10 mb-3">{authLabel.noCommentsyet[lang]}</p>
                ))}

              <div className="w-full">
                {commentForm === post.id && (
                  <div className="flex  gap-10">
                    <Comments postId={post?.id || ''} refresh={getPost} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end"></div>
            {decodedToken?.id === post.postIt?.id && (
              <Dropdown
                postId={post.id}
                refresh={getPost}
                thought={post.thought}
                feeling={post.feeling!}
              />
            )}
          </div>
        ))}
      </div>

      <div className={'mt-10 mb-1 flex-col hidden xl:block '}>
        <Notification />
        <div
          className={`fixed  lg:top-[38rem] lg:w-[24rem] h-80 ${connectBgColor} right-1 shadow-lg rounded-lg`}
        >
          <div className="flex flex-col items-center mt-4 mx-auto overflow-y-auto lg:w-[23rem] xs:w-[30rem] ">
            <div className="flex justify-center  mb-4">
              <Label
                name="connection"
                className={`text-xl ${textColor} font-poppins font-medium`}
                label={authLabel.connection[lang]}
              />
            </div>
            {connects.length === 0 ? (
              <div className="h-56 flex justify-center items-center">
                <Label
                  name="noConnection"
                  className={` text-xl ${textColor} font-poppins font-medium`}
                  label={authLabel.noConnection[lang]}
                />{' '}
              </div>
            ) : (
              <div>
                {connects?.map((connect) => {
                  return (
                    <div>
                      <div
                        className={`2xl:w-[23rem] ${connectBgColor} border border-gray-600  shadow-md rounded-lg overflow-hidden `}
                      >
                        <ul className="divide-y divide-gray-200">
                          <li
                            key={connect?.id}
                            className={`flex flex-col sm:flex-row  xs:gap-2 lg:justify-between p-2 ${hoverDiv} `}
                          >
                            <div
                              className={`flex items-center ${textColor} space-x-4 cursor-pointer `}
                              // onClick={() => handleUserClick(user.id)}
                            >
                              {connect?.profile?.path ? (
                                <img
                                  className="h-16 w-16 rounded-full object-cover"
                                  src={connect?.profile?.path}
                                  alt="Profile"
                                />
                              ) : (
                                <img
                                  className="h-16 w-16 rounded-full object-cover"
                                  src="/profilenull.jpg"
                                  alt="Default Profile"
                                />
                              )}
                              <div className="text-center sm:text-left mt-2 sm:mt-0">
                                <p className="font-semibold text-lg">
                                  {connect?.details?.first_name} {connect?.details?.last_name}
                                </p>
                                {connect?.email && <p className=" text-sm">{connect?.email}</p>}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {sideMenu && (
        <div className={`mb-5 xs:mb-10 flex-col block ${bgColor} h-full `}>
          <Notification />
          <div className={`fixed top-[30rem] sm:w-[18rem] overflow-y-auto right-1 h-[23rem] ${bgColor} shadow-xl rounded-lg `}>
            <div className="flex justify-center items-center  mb-4">
              <Label
                name="connection"
                className={`text-xl font-poppins ${textColor} font-medium`}
                label={authLabel.connection[lang]}
              />
            </div>
            {connects.length === 0 ? (
              <div className={`flex items-center w-[32rem]  ${bgColor} justify-center h-72 mb-4`}>
                <Label
                  name="noConnection"
                  className={`text-xl font-poppins font-medium ${textColor}`}
                  label={authLabel.noConnection[lang]}
                />
              </div>
            ) : (
              <div>
                {' '}
                {connects?.map((connect) => {
                  return (
                    <div>
                      <div className=" border rounded-lg  ">
                        <ul className="divide-y divide-gray-200">
                          <li
                            key={connect?.id}
                            className="flex flex-col xs:gap-2 lg:justify-between p-2 hover:bg-gray-50"
                          >
                            <div
                              className="flex items-center space-x-4 cursor-pointer"
                              // onClick={() => handleUserClick(user.id)}
                            >
                              {connect?.profile?.path ? (
                                <img
                                  className="h-16 w-16 rounded-full object-cover"
                                  src={connect?.profile?.path}
                                  alt="Profile"
                                />
                              ) : (
                                <img
                                  className="h-16 w-16 rounded-full object-cover"
                                  src="/profilenull.jpg"
                                  alt="Default Profile"
                                />
                              )}
                              <div className="text-center sm:text-left mt-2 sm:mt-0">
                                <p className="font-semibold text-lg text-gray-700">
                                  {connect?.details?.first_name} {connect?.details?.last_name}
                                </p>
                                {connect?.email && (
                                  <p className="text-gray-500 text-sm">{connect?.email}</p>
                                )}
                              </div>
                            </div>
                          </li>
                        </ul>
                      </div>
                    </div>
                  );
                })}{' '}
              </div>
            )}
          </div>
        </div>
      )}
      <button
        className={`fixed right-2 z-50 top-28 text-2xl ${textColor} block xl:hidden`}
        onClick={() => handleSideClick()}
      >
        {sideMenu ? <FaCircleArrowRight /> : <FaCircleArrowLeft />}
      </button>
    </div>
  );
};

export default ShowPost;
