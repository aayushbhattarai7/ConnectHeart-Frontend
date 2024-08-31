import { useEffect, useState } from 'react';
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
import CommentOptions from '../molecules/CommentOption';
import { FaCircleArrowLeft, FaCircleArrowRight } from 'react-icons/fa6';
import { FaRegCommentDots } from 'react-icons/fa';
import Label from '../../common/atoms/Label';
import { authLabel } from '../../../localization/auth';
import { useLang } from '../../../hooks/useLang';

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
  comment?: string;
  parentComment?: Comment | null;
  childComment?: Comment[];
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
  const [displayPost, setDisplayPost] = useState(false);
  const [connects, setConnects] = useState<Connection[]>([]);
  const { lang } = useLang();
  const getPost = async () => {
    try {
      const response = await axiosInstance.get('/post/', {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('🚀 ~ getPost ~ response:', response);

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
    setDisplayPost(false);
  };

  const renderComments = (comments: Comment[], isChild: boolean = false) => {
    if (!visibleCommentsPostId) return null;

    return comments.map((cmt) => (
      <div key={cmt?.id} className="flex  bg-gray-100 justify-start ">
        <div
          key={cmt.id}
          className={`relative mb-4 ${isChild ? 'ml-6' : 'ml-1'}
                 p-4 rounded-md  shadow-sm `}
        >
          {isChild && (
            <div className="absolute top-0 left-0 w-1 border-l-2 border-gray-300 h-full"></div>
          )}

          <div className="">
            <div className="flex gap-2 p-2">
              {cmt?.commentAuth?.profile?.path ? (
                <img
                  className="w-8 h-8  rounded-full"
                  src={cmt?.commentAuth?.profile?.path}
                  alt="Profile"
                />
              ) : (
                <img
                  className="w-8 h-8  rounded-full"
                  src="/profilenull.jpg"
                  alt="Default Profile"
                />
              )}
              <div className="flex flex-col">
                <p className="mt-1 font-medium">
                  {cmt?.commentAuth?.details?.first_name} {cmt?.commentAuth?.details?.last_name}{' '}
                </p>
                <div className="flex gap-4 w-[20rem] flex-wrap">
                  <p className="flex-wrap break-words w-fit flex ">{cmt?.comment}</p>
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
            </div>
            {replyCommentId === cmt.id && (
              <div className=" p-4 rounded-md">
                <ReplyComment
                  postId={posts[0]?.id || ''}
                  commentId={cmt.id || ''}
                  refresh={getPost}
                />
              </div>
            )}
            <button
              onClick={() => toggleReplyForm(cmt.id!)}
              className=" text-black hover:bg-blue-700 p-1 hover:text-white rounded-md"
            >
              Reply
            </button>
          </div>
          {cmt.childComment && renderComments(cmt.childComment, true)}
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
    <div className="mt-6 flex flex-col lg:flex-row justify-evenly items-start mx-auto   lg:p-6 bg-gray-100 ">
      <div className="flex flex-col justify-start items-center overflow-y-auto h-fit w-full  mt-30 2xl:w-[52rem] xl:w-[50rem]  lg:w-[45rem] md:w-[40rem] sm:w-[35rem] mx-auto   mb-16 bg-gray-100">
        <Post postId={posts[0]?.id || ''} refresh={getPost} />
        {error && <p>{error}</p>}
        {posts.map((post) => (
          <div
            className=" flex justify-center shadow-xl  w-full rounded-xl mx-auto   mb-14 text-ellipsis bg-white"
            key={post.id}
          >
            <div className="items-start sm:mr-20 sm:flex-row w-full p-10">
              <div key={post.postIt?.id} className="bg-white  mb-5">
                <div className="flex flex-col bg-white relative z-0 p-4">
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
                  <p className="text-black absolute top-10 left-[5.2rem]">
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
              <div className="  flex justify-between pl-[5rem] mx-auto mb-1">
                <div>
                  {post.likes.length === 0 ? (
                    <div className='mt-8'>
                      <p>No Likes</p>
                    </div>
                  ) : (
                    <p>
                      <p className="pl-3 text-xl text-red-500">
                        <FaHeart />
                      </p>
                      {post.likes.length <= 2 ? (
                        <span>{post.likes.length} Like</span>
                      ) : (
                        <span>{post.likes.length} Likes</span>
                      )}
                    </p>
                  )}
                </div>
                <div className="flex flex-col font-poppins">
                  <button
                    className="rounded-xl text-black text-2xl h-7 pl-5 ml-6  w-14"
                    // onClick={() => toggleComments(post.id)}
                  >
                    {visibleCommentsPostId === post.id ? (
                      <FaRegCommentDots />
                    ) : (
                      <FaRegCommentDots />
                    )}
                  </button>
                  <p>view comments</p>
                </div>
              </div>

              <div className="flex  ml-10 mb-4 w-full border "></div>

              <div className="flex gap-20 justify-around ml-10">
                <div className="flex flex-col font-poppins">
                  <Like postId={post?.id} userId={currentUserId!} />
                  <p>Like</p>
                </div>
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col font-poppins">
                    <button
                      className="rounded-xlh-7 ml-2 pl-5 text-2xl w-14"
                      onClick={() => toggleComments(post.id)}
                    >
                      {commentForm === post.id ? (
                        <FaRegCommentDots className="text-black" />
                      ) : (
                        <FaRegCommentDots />
                      )}
                    </button>
                    <p>Comment</p>
                  </div>
                  <div></div>
                </div>

                <div className="flex flex-col font-poppins">
                  <button className="ml-2">
                    <FaShare className="text-xl" />
                  </button>
                  <p>Share</p>
                </div>
              </div>
              {visibleCommentsPostId === post.id &&
                (post.comment && post.comment.length > 0 ? (
                  <div className="mb-7 2xl:ml-20">{renderComments(post.comment)}</div>
                ) : (
                  <p className="ml-10 mb-3">No comments yet</p>
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

      <div className="mt-10 mb-1 flex-col hidden xl:block ">
        <Notification />
        <div className="fixed  lg:top-[38rem] lg:w-[24rem] h-80 right-1 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col items-center mt-4 mx-auto overflow-y-auto lg:w-[23rem] xs:w-[30rem] ">
            <div className="flex justify-center  mb-4">
              <Label
                name="connection"
                className={`text-xl font-poppins font-medium text-gray-800`}
                label={authLabel.connection[lang]}
              />
            </div>
            {connects.length === 0 ? (
              <div className="h-56 flex justify-center items-center">
                <Label
                  name="noConnection"
                  className={` text-xl font-poppins font-medium`}
                  label={authLabel.noConnection[lang]}
                />{' '}
              </div>
            ) : (
              <div>
                {connects?.map((connect) => {
                  return (
                    <div>
                      <div className="2xl:w-[23rem]  bg-white shadow-md rounded-lg overflow-hidden ">
                        <ul className="divide-y divide-gray-200">
                          <li
                            key={connect?.id}
                            className="flex flex-col sm:flex-row  xs:gap-2 lg:justify-between p-2 hover:bg-gray-50"
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
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      {sideMenu && (
        <div className=" mb-5 xs:mb-10 flex-col h-fit ">
          <Notification />
          <div className=" fixed top-[37rem] sm:w-[18rem] overflow-y-auto right-1 h-72  bg-white  shadow-lg rounded-lg ">
            <div className="flex justify-center items-center  mb-4">
              <Label
                name="connection"
                className={`text-xl font-poppins font-medium text-gray-800`}
                label={authLabel.connection[lang]}
              />
            </div>
            {connects.length === 0 ? (
              <div className="flex items-center justify-center h-56 mb-4">
                <Label
                  name="noConnection"
                  className={`text-xl font-poppins font-medium text-gray-800`}
                  label={authLabel.noConnection[lang]}
                />
              </div>
            ) : (
              <div>
                {' '}
                {connects?.map((connect) => {
                  return (
                    <div>
                      <div className="   border rounded-lg  ">
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
        className="fixed right-2 z-50 top-28 text-2xl block xl:hidden"
        onClick={() => handleSideClick()}
      >
        {sideMenu ? <FaCircleArrowRight /> : <FaCircleArrowLeft />}
      </button>
    </div>
  );
};

export default ShowPost;
